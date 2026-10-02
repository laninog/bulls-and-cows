import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function waitForServiceWorkerControl(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  // La primera carga no está controlada; tras recargar, sí.
  await page.reload()
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true)
}

test('manifiesto válido para instalar: nombre, display, start_url e iconos 192/512 accesibles', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const href = await page.locator('link[rel="manifest"]').getAttribute('href')
  expect(href).toBeTruthy()
  const manifest = await (await request.get(href!)).json()
  expect(manifest).toMatchObject({
    name: 'Bulls and Cows',
    display: 'standalone',
    start_url: '/',
    theme_color: '#3f51b5',
  })
  const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes)
  expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']))
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true)
  for (const icon of manifest.icons) {
    const res = await request.get(icon.src)
    expect(res.status(), icon.src).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  }
})

test('sin conexión: arranca, navega entre vistas y se juega una partida casual completa', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await waitForServiceWorkerControl(page)

  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bulls and Cows')
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Nueva partida')

  // Navegación directa a otra ruta sin red: la sirve el fallback del service worker
  await page.goto('/rules')
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Cómo se juega')

  // Partida casual: todo es local (D-11), así que funciona sin red
  await page.goto('/')
  await page.getByRole('button', { name: 'Empezar' }).click()
  await page.waitForURL('**/play')
  const secret = await page.evaluate(async () => {
    const id = sessionStorage.getItem('bnc:current-game')!
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('bnc')
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    return new Promise<string>((res, rej) => {
      const r = db.transaction('games').objectStore('games').get(id)
      r.onsuccess = () => res((r.result as { secret: string }).secret)
      r.onerror = () => rej(r.error)
    })
  })
  await page.getByTestId('digit-0').focus()
  await page.keyboard.type(secret)
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('won')).toBeVisible()
})

test('el service worker nunca responde la API: sin red, /api falla en lugar de servir la SPA', async ({
  page,
  context,
}) => {
  await page.goto('/')
  await waitForServiceWorkerControl(page)
  await context.setOffline(true)
  const outcome = await page.evaluate(async () => {
    try {
      const r = await fetch('/api/health')
      return `status ${r.status} ${r.headers.get('content-type')}`
    } catch {
      return 'network-error'
    }
  })
  expect(outcome).toBe('network-error')
})
