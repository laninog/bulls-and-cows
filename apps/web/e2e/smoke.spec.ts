import { expect, test } from '@playwright/test'

test('la aplicación arranca y muestra los niveles del dominio', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bulls and Cows')
  await expect(page.getByTestId('levels')).toContainText('3, 4, 5, 6')
})
