import { expect, test } from '@playwright/test'
import { secretOfCurrentGame, startGame, tapGuess, typeGuess, wrongGuessFor } from './helpers'

/**
 * SEC-07: cabeceras de seguridad servidas por el Worker real (assets y API) y
 * ninguna violación de la CSP durante el uso normal de la aplicación.
 */

const common = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
}

test('la SPA, sus rutas, el service worker y el manifiesto llevan la CSP y el resto', async ({
  request,
}) => {
  for (const path of ['/', '/play', '/rules', '/sw.js', '/manifest.webmanifest']) {
    const res = await request.get(path)
    expect(res.ok(), path).toBe(true)
    const h = res.headers()
    expect(h, path).toMatchObject({ ...common, 'x-frame-options': 'DENY' })
    expect(h['content-security-policy'], path).toContain("default-src 'none'")
    expect(h['content-security-policy'], path).not.toContain('unsafe-')
  }
})

test('la API lleva su CSP restrictiva, también en los errores', async ({ request }) => {
  for (const path of ['/api/health', '/api/nope']) {
    const h = (await request.get(path)).headers()
    expect(h, path).toMatchObject(common)
    expect(h['content-security-policy'], path).toBe("default-src 'none'; frame-ancestors 'none'")
  }
})

test('ninguna violación de la CSP: todas las vistas, partida completa y service worker', async ({
  page,
}) => {
  const violations: string[] = []
  page.on('console', (m) => {
    if (/Content Security Policy/i.test(m.text())) violations.push(m.text())
  })
  // Chrome registra cada violación en la consola; además se recogen los eventos del documento.
  await page.addInitScript(() => {
    const w = window as unknown as { __csp: string[] }
    w.__csp = []
    document.addEventListener('securitypolicyviolation', (e) =>
      w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`),
    )
  })

  await startGame(page, 4)
  const secret = await secretOfCurrentGame(page)
  await typeGuess(page, wrongGuessFor(secret))
  await tapGuess(page, secret)
  await expect(page.getByTestId('won')).toBeVisible()
  for (const name of ['Historial', 'Reglas', 'Ajustes']) {
    await page.getByRole('link', { name }).click()
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  }
  await page.getByTestId('locale-en').check()
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Settings')
  // El service worker se registra y toma el control bajo la CSP
  await page.evaluate(() => navigator.serviceWorker.ready)

  expect(violations).toEqual([])
  expect(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp)).toEqual([])
})

test('la CSP se aplica de verdad: bloquea un script y un estilo en línea inyectados', async ({
  page,
}) => {
  await page.goto('/')
  const result = await page.evaluate(async () => {
    const blocked: string[] = []
    document.addEventListener('securitypolicyviolation', (e) => blocked.push(e.violatedDirective))
    const script = document.createElement('script')
    script.textContent = 'window.__injected = true'
    document.body.append(script)
    const style = document.createElement('style')
    style.textContent = 'body { display: none }'
    document.head.append(style)
    await new Promise((r) => setTimeout(r, 100))
    return {
      blocked,
      injected: (window as unknown as { __injected?: boolean }).__injected ?? false,
      hidden: getComputedStyle(document.body).display === 'none',
    }
  })
  expect(result.injected).toBe(false)
  expect(result.hidden).toBe(false)
  expect(result.blocked).toEqual(expect.arrayContaining(['script-src-elem', 'style-src-elem']))
})
