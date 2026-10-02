import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    projects: [
      {
        test: {
          name: 'domain',
          root: 'packages/domain',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'contracts',
          root: 'packages/contracts',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'api',
          root: 'apps/api',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'web',
          root: 'apps/web',
          alias: {
            'virtual:pwa-register/vue': new URL(
              './apps/web/src/test-stubs/pwa-register-vue.ts',
              import.meta.url,
            ).pathname,
          },
          environment: 'jsdom',
          include: ['src/**/*.test.ts'],
          setupFiles: ['src/test-setup.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['packages/*/src/**', 'apps/*/src/**'],
      exclude: [
        '**/*.test.ts',
        '**/*.d.ts',
        '**/*.contract.ts',
        '**/test-services.ts',
        '**/test-setup.ts',
        '**/test-stubs/**',
        // Raíces de composición: sin lógica, cubiertas por los e2e.
        'apps/web/src/main.ts',
        'apps/web/src/ui/router.ts',
        'apps/web/src/application/local-services.ts',
      ],
      thresholds: {
        // Global
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // F1: el dominio exige ≥ 95 (doc 04)
        'packages/domain/src/**': { lines: 95, functions: 95, branches: 95, statements: 95 },
      },
    },
  },
})
