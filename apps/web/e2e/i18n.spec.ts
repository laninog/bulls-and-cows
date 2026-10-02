import { expect, test } from '@playwright/test'

test.describe('idioma detectado del navegador', () => {
  test.use({ locale: 'en-US' })

  test('un navegador en inglés ve la app en inglés', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page).toHaveTitle('New game · Bulls and Cows')
    await expect(page.getByRole('heading', { level: 2 })).toHaveText('New game')
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible()
  })
})

test.describe('idioma no soportado', () => {
  test.use({ locale: 'fr-FR' })

  test('cae a inglés', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})

test('cambiar de idioma en Ajustes: inmediato, sin recargar, y persistente', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')

  // Marca para detectar recargas: si la página se recarga, desaparece.
  await page.evaluate(() => ((window as unknown as { __noReload: boolean }).__noReload = true))

  await page.getByRole('link', { name: 'Ajustes' }).click()
  await page.getByTestId('locale-en').check()

  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Settings')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('Settings · Bulls and Cows')
  await expect(page.getByRole('navigation')).toContainText('Rules')
  expect(
    await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload),
  ).toBe(true)

  // Se recuerda tras recargar, aunque el navegador siga en español
  await page.reload()
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Settings')

  // Y una partida se juega en inglés
  await page.getByRole('link', { name: 'Bulls and Cows' }).click()
  await page.getByRole('button', { name: 'Start' }).click()
  await page.waitForURL('**/play')
  await expect(page.getByRole('heading', { level: 2 })).toContainText('Level 3')
  await page.getByTestId('digit-0').focus()
  await page.keyboard.type('112')
  await expect(page.getByTestId('guess-message')).toHaveText("Don't repeat digits.")
})

test('reglas: accesibles desde inicio, con el ejemplo y vuelta a jugar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '¿Cómo se juega?' }).click()
  await expect(page).toHaveURL('/rules')
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Cómo se juega')
  await expect(page.getByRole('heading', { level: 2 })).toBeFocused()
  const examples = page.getByTestId('rules-example').locator('li')
  await expect(examples).toHaveCount(3)
  await expect(examples.nth(2)).toContainText('3 bulls, 0 cows')
  await page.getByRole('link', { name: 'Empezar a jugar' }).click()
  await expect(page).toHaveURL('/')
})

test('el modo de entrada elegido en Ajustes se aplica en la partida', async ({ page }) => {
  await page.goto('/settings')
  await page.getByTestId('input-stepper').check()
  await page.getByRole('link', { name: 'Bulls and Cows' }).click()
  await page.getByRole('button', { name: 'Empezar' }).click()
  await page.waitForURL('**/play')
  await expect(page.getByTestId('stepper-toggle')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('inc-0')).toBeVisible()
})
