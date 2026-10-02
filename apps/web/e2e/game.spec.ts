import { expect, test } from '@playwright/test'
import { secretOfCurrentGame, startGame, typeGuess, wrongGuessFor } from './helpers'

test.describe('partida completa en modo invitado', () => {
  test('nivel 3: inválido, fallido, ganador, historial', async ({ page }) => {
    await startGame(page, 3)
    await expect(page).toHaveTitle('Partida · Bulls and Cows')
    await expect(page.getByRole('heading', { level: 2 })).toContainText('Nivel 3')
    await expect(page.getByText('Todavía no has hecho ningún intento.')).toBeVisible()

    const secret = await secretOfCurrentGame(page)
    expect(secret).toMatch(/^[0-9]{3}$/)

    // Repetidos: se avisa y no se registra
    await typeGuess(page, '112')
    await expect(page.getByTestId('guess-message')).toHaveText('No repitas dígitos.')
    await expect(page.getByTestId('attempts')).toHaveCount(0)
    for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace')

    await typeGuess(page, wrongGuessFor(secret))
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await expect(page.getByTestId('digit-0')).toBeFocused()

    await typeGuess(page, secret)
    await expect(page.getByTestId('won').getByRole('heading')).toHaveText(
      '¡Has ganado en 2 intentos!',
    )
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(2)

    await page.getByRole('button', { name: 'Ver historial' }).click()
    await expect(page).toHaveURL('/history')
    const rows = page.getByTestId('history').locator('tbody tr')
    await expect(rows).toHaveCount(1)
    await expect(rows.first()).toContainText('Ganada')
    await expect(rows.first()).toContainText('2 intentos')
  })

  test('la partida sobrevive a una recarga', async ({ page }) => {
    await startGame(page)
    await typeGuess(page, '987')
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await page.reload()
    await expect(page).toHaveURL('/play')
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
  })

  test('abandonar vuelve a inicio y queda en el historial', async ({ page }) => {
    await startGame(page, 5)
    await page.getByRole('button', { name: 'Abandonar' }).click()
    await expect(page).toHaveURL('/')
    await page.getByRole('link', { name: 'Historial' }).click()
    await expect(page.getByTestId('history').locator('tbody tr').first()).toContainText(
      'Abandonada',
    )
  })

  test('modo selectores +/−: se compone un intento solo con los botones', async ({ page }) => {
    await startGame(page, 3)
    await page.getByTestId('stepper-toggle').click()
    await expect(page.getByTestId('stepper-toggle')).toHaveAttribute('aria-pressed', 'true')
    // 1, 2, 3 pulsando "+" (desde vacío: +1 → 0)
    for (const [i, presses] of [
      [0, 2],
      [1, 3],
      [2, 4],
    ] as const) {
      for (let k = 0; k < presses; k++) await page.getByTestId(`inc-${i}`).click()
    }
    await page.getByRole('button', { name: 'Jugar' }).click()
    await expect(page.getByTestId('attempts').locator('li').first()).toContainText('1 2 3')
    // La preferencia persiste
    await page.reload()
    await expect(page.getByTestId('stepper-toggle')).toHaveAttribute('aria-pressed', 'true')
  })
})

test('historial: tabla en escritorio, tarjetas en móvil (sin desplazamiento horizontal)', async ({
  page,
  isMobile,
}) => {
  await startGame(page)
  await page.getByRole('button', { name: 'Abandonar' }).click()
  await page.getByRole('link', { name: 'Historial' }).click()
  await expect(page.getByTestId(isMobile ? 'history-cards' : 'history')).toBeVisible()
  await expect(page.getByTestId(isMobile ? 'history' : 'history-cards')).toBeHidden()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(overflow).toBe(false)
})
