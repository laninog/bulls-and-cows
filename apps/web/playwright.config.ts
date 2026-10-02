import { defineConfig, devices } from '@playwright/test'

const port = 4173

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // La batería asume español; i18n.spec.ts cubre la detección de otros idiomas.
    locale: 'es-ES',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Se prueba lo que se despliega: el Worker real (miniflare) sirviendo la build y la API.
  webServer: {
    command: `pnpm --filter @bnc/api exec wrangler dev --port ${port} --ip 127.0.0.1`,
    url: `http://localhost:${port}/api/health`,
    reuseExistingServer: !process.env['CI'],
    env: { WRANGLER_SEND_METRICS: 'false' },
    timeout: 60_000,
  },
})
