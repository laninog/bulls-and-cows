import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { secretOfCurrentGame, startGame, typeGuess, wrongGuessFor } from './helpers'

/** WCAG 2.2 A y AA. Criterio de F2.2: cero violaciones (no solo críticas). */
async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const summary = violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  )
  expect(summary).toEqual([])
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`axe · tema ${colorScheme}`, () => {
    test.use({ colorScheme })

    test('inicio', async ({ page }) => {
      await page.goto('/')
      await expectNoViolations(page)
    })

    test('partida con intentos, con selectores y ganada', async ({ page }) => {
      await startGame(page, 4)
      const secret = await secretOfCurrentGame(page)
      await typeGuess(page, wrongGuessFor(secret))
      await expectNoViolations(page)
      await page.getByTestId('stepper-toggle').click()
      await expectNoViolations(page)
      await typeGuess(page, secret)
      await expect(page.getByTestId('won')).toBeVisible()
      await expectNoViolations(page)
    })

    test('historial con partidas', async ({ page, isMobile }) => {
      await startGame(page)
      await page.getByRole('button', { name: 'Abandonar' }).click()
      await page.getByRole('link', { name: 'Historial' }).click()
      await expect(page.getByTestId(isMobile ? 'history-cards' : 'history')).toBeVisible()
      await expectNoViolations(page)
    })
  })
}

test.describe('solo teclado', () => {
  test('partida completa sin usar el ratón: inicio → nivel → jugar → ganar → historial', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/')

    // Enlace de salto: primer elemento enfocable
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused()

    // Elegir nivel 4 con flechas dentro del grupo de radios y empezar con Enter
    const radio3 = page.getByRole('radio', { name: /3 dígitos/ })
    await radio3.focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('radio', { name: /4 dígitos/ })).toBeChecked()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Empezar' })).toBeFocused()
    await page.keyboard.press('Enter')
    await page.waitForURL('**/play')

    // Al llegar, el foco ya está en el primer dígito
    await expect(page.getByTestId('digit-0')).toBeFocused()
    const secret = await secretOfCurrentGame(page)

    // Intento fallido tecleado directamente; Enter envía
    await page.keyboard.type(wrongGuessFor(secret))
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await expect(page.getByTestId('announcer')).toHaveText(/^Intento 1: /)
    await expect(page.getByTestId('digit-0')).toBeFocused()

    // Intento ganador usando flechas arriba/abajo en lugar de teclear dígitos
    for (let i = 0; i < 4; i++) {
      const target = Number(secret[i])
      for (let k = 0; k <= target; k++) await page.keyboard.press('ArrowUp') // vacío→0→…→target
      if (i < 3) await page.keyboard.press('ArrowRight')
    }
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('won')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Jugar otra vez' })).toBeFocused()

    // Ir al historial: Tab al segundo botón y Enter
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Ver historial' })).toBeFocused()
    await page.keyboard.press('Enter')
    await page.waitForURL('**/history')
    await expect(page.getByRole('heading', { level: 2, name: 'Historial' })).toBeFocused()
    await expect(page.getByTestId(isMobile ? 'history-cards' : 'history')).toContainText('Ganada')
  })
})
