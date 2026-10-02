import { expect, test } from '@playwright/test'

test('la aplicación arranca en la pantalla de inicio', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bulls and Cows')
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Nueva partida')
  await expect(page.getByText('Jugando como invitado')).toBeVisible()
  await expect(page).toHaveTitle('Nueva partida · Bulls and Cows')
})

test('/play sin partida redirige a inicio (DT-09)', async ({ page }) => {
  await page.goto('/play')
  await expect(page).toHaveURL('/')
})
