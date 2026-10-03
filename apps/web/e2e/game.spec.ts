import { expect, test } from '@playwright/test'
import { secretOfCurrentGame, startGame, tapGuess, typeGuess, wrongGuessFor } from './helpers'

test.describe('partida completa en modo invitado', () => {
  test('nivel 3: inválido, fallido, ganador, historial', async ({ page }) => {
    await startGame(page, 3)
    await expect(page).toHaveTitle('Partida · Bulls and Cows')
    await expect(page.getByRole('heading', { level: 2 })).toContainText('Nivel 3')
    await expect(page.getByText('Todavía no has hecho ningún intento.')).toBeVisible()

    const secret = await secretOfCurrentGame(page)
    expect(secret).toMatch(/^[0-9]{3}$/)

    // Repetidos: no se aceptan y se avisa; incompleto: no se registra
    await typeGuess(page, '11')
    await expect(page.getByTestId('guess-message')).toHaveText('Completa todos los dígitos.')
    await expect(page.getByTestId('digit-1')).toHaveText('')
    await page.keyboard.type('1')
    await expect(page.getByTestId('guess-message')).toHaveText('No repitas dígitos.')
    await expect(page.getByTestId('attempts')).toHaveCount(0)
    await page.keyboard.press('Backspace')

    await typeGuess(page, wrongGuessFor(secret))
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await expect(page.getByTestId('digit-0')).toHaveText('')
    await expect(page.getByTestId('digit-0')).toHaveAttribute('aria-current', 'true')

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

  test('teclado de la pantalla: sin teclado del sistema, usados atenuados, corregir y jugar', async ({
    page,
  }) => {
    await startGame(page, 4)
    // Ningún campo de texto: el teclado del móvil no puede abrirse
    await expect(page.locator('input, textarea, [contenteditable]')).toHaveCount(0)

    const keypad = page.getByRole('group', { name: 'Teclado numérico' })
    await keypad.getByRole('button', { name: '1', exact: true }).click()
    await keypad.getByRole('button', { name: '2', exact: true }).click()
    await expect(page.getByTestId('key-1')).toHaveAttribute('aria-disabled', 'true')
    // Atenuada pero pulsable: explica por qué no se acepta
    await page.getByTestId('key-1').click({ force: true })
    await expect(page.getByTestId('guess-message')).toHaveText('No repitas dígitos.')

    // Corregir el primer dígito tocando su casilla; borrar el último
    await page.getByTestId('digit-0').click()
    await page.getByTestId('key-9').click()
    await page.getByTestId('key-3').click()
    await page.getByTestId('key-4').click()
    await page.getByRole('button', { name: 'Borrar' }).click()
    await page.getByTestId('key-5').click()
    await expect(page.getByTestId('digits')).toHaveText(/9\s*2\s*3\s*5/)

    await page.getByRole('button', { name: 'Jugar' }).click()
    await expect(page.getByTestId('attempts').locator('li').first()).toContainText('9 2 3 5')
    await expect(page.getByTestId('key-9')).not.toHaveAttribute('aria-disabled', 'true')
  })

  test('ganar solo con el teclado de la pantalla', async ({ page }) => {
    await startGame(page, 3)
    await tapGuess(page, await secretOfCurrentGame(page))
    await expect(page.getByTestId('won')).toBeVisible()
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
