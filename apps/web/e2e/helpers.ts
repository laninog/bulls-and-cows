import type { Page } from '@playwright/test'

/**
 * Lee el secreto de la partida en curso desde IndexedDB. En modo casual el
 * secreto vive en el navegador (D-11): el test no usa ningún gancho de
 * producción, solo lo que cualquier jugador podría leer.
 */
export async function secretOfCurrentGame(page: Page): Promise<string> {
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

/** Un intento válido que no es el secreto, para cualquier nivel. */
export function wrongGuessFor(secret: string): string {
  const a = '012345'.slice(0, secret.length)
  return secret === a ? '456789'.slice(0, secret.length) : a
}

export async function startGame(page: Page, level: 3 | 4 | 5 | 6 = 3) {
  await page.goto('/')
  await page.getByRole('radio', { name: new RegExp(`${level} dígitos`) }).check()
  await page.getByRole('button', { name: 'Empezar' }).click()
  await page.waitForURL('**/play')
}

export async function typeGuess(page: Page, guess: string) {
  await page.getByTestId('digit-0').focus()
  await page.keyboard.type(guess)
  await page.keyboard.press('Enter')
}
