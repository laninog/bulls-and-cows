import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Lee el secreto de la partida en curso desde IndexedDB. En modo casual el
 * secreto vive en el navegador (D-11): el test no usa ningún gancho de
 * producción, solo lo que cualquier jugador podría leer.
 */
async function secretOfCurrentGame(page: Page): Promise<string> {
  return page.evaluate(async () => {
    const id = sessionStorage.getItem('bnc:current-game')
    if (!id) throw new Error('no current game')
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('bnc')
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    const row = await new Promise<{ secret: string }>((res, rej) => {
      const r = db.transaction('games').objectStore('games').get(id)
      r.onsuccess = () => res(r.result as { secret: string })
      r.onerror = () => rej(r.error)
    })
    return row.secret
  })
}

async function typeGuess(page: Page, guess: string) {
  await page.getByTestId('digit-0').focus()
  await page.keyboard.type(guess)
  await page.keyboard.press('Enter')
}

test.describe('partida completa en modo invitado', () => {
  test('nivel 3: intento fallido, intento ganador, historial', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Nivel (número de dígitos)').selectOption('3')
    await page.getByRole('button', { name: 'Empezar' }).click()
    await expect(page).toHaveURL('/play')
    await expect(page.getByRole('heading', { level: 2 })).toContainText('Nivel 3')
    await expect(page.getByText('Todavía no has hecho ningún intento.')).toBeVisible()

    const secret = await secretOfCurrentGame(page)
    expect(secret).toMatch(/^[0-9]{3}$/)

    // Intento inválido: repetidos → no se registra
    await typeGuess(page, '112')
    await expect(page.getByTestId('guess-message')).toHaveText('No repitas dígitos.')
    await expect(page.getByTestId('attempts')).toHaveCount(0)

    // Intento válido pero fallido
    const wrong = secret === '012' ? '345' : '012'
    await page.getByTestId('digit-0').focus()
    await page.keyboard.press('Control+A')
    for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace')
    await typeGuess(page, wrong)
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await expect(page.getByTestId('digit-0')).toBeFocused()

    // Intento ganador
    await typeGuess(page, secret)
    await expect(page.getByTestId('won')).toBeVisible()
    await expect(page.getByTestId('won').getByRole('heading')).toHaveText(
      '¡Has ganado en 2 intentos!',
    )
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(2)

    // Historial
    await page.getByRole('button', { name: 'Ver historial' }).click()
    await expect(page).toHaveURL('/history')
    const rows = page.getByTestId('history').locator('tbody tr')
    await expect(rows).toHaveCount(1)
    await expect(rows.first()).toContainText('Ganada')
    await expect(rows.first()).toContainText('2 intentos')
  })

  test('la partida sobrevive a una recarga', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Empezar' }).click()
    await expect(page).toHaveURL('/play')
    await typeGuess(page, '987')
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
    await page.reload()
    await expect(page).toHaveURL('/play')
    await expect(page.getByTestId('attempts').locator('li')).toHaveCount(1)
  })

  test('abandonar vuelve a inicio y queda en el historial', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Nivel (número de dígitos)').selectOption('5')
    await page.getByRole('button', { name: 'Empezar' }).click()
    await page.getByRole('button', { name: 'Abandonar partida' }).click()
    await expect(page).toHaveURL('/')
    await page.getByRole('link', { name: 'Historial' }).click()
    await expect(page.getByTestId('history').locator('tbody tr').first()).toContainText(
      'Abandonada',
    )
  })
})
