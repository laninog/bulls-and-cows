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

    test('partida con intentos, intento a medias con aviso, y ganada', async ({ page }) => {
      await startGame(page, 4)
      const secret = await secretOfCurrentGame(page)
      await typeGuess(page, wrongGuessFor(secret))
      await expectNoViolations(page)
      await page.keyboard.type('55')
      await expect(page.getByTestId('guess-message')).toHaveText('No repitas dígitos.')
      await expectNoViolations(page)
      await page.keyboard.press('Backspace')
      await typeGuess(page, secret)
      await expect(page.getByTestId('won')).toBeVisible()
      await expectNoViolations(page)
    })

    test('reglas y ajustes, en español y en inglés', async ({ page }) => {
      for (const path of ['/rules', '/settings']) {
        await page.goto(path)
        await expectNoViolations(page)
      }
      await page.getByTestId('locale-en').check()
      for (const path of ['/rules', '/settings']) {
        await page.goto(path)
        await expectNoViolations(page)
      }
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

    // Al llegar, el foco está en el título de la vista; las teclas ya escriben
    await expect(page.getByRole('heading', { level: 2 })).toBeFocused()
    const secret = await secretOfCurrentGame(page)

    // Intento fallido tecleado directamente; Enter envía
    await page.keyboard.type(wrongGuessFor(secret))
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await expect(page.getByTestId('announcer')).toHaveText(/^Intento 1: /)

    // Intento ganador con el teclado de la pantalla recorrido con Tab y activado con Enter:
    // el foco no se pierde aunque la tecla pulsada pase a estar atenuada
    await page.getByRole('button', { name: 'Abandonar' }).focus()
    for (const d of secret) {
      const key = page.getByTestId(`key-${d}`)
      while (!(await key.evaluate((el) => el === document.activeElement)))
        await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      await expect(key).toBeFocused()
      await expect(key).toHaveAttribute('aria-disabled', 'true')
      await page.getByRole('button', { name: 'Abandonar' }).focus()
    }
    await expect(page.getByTestId('guess-spoken')).toHaveText(secret.split('').join(', '))
    await page.getByTestId('submit').focus()
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
