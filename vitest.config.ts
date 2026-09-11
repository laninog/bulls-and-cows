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
          environment: 'jsdom',
          include: ['src/**/*.test.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['packages/*/src/**', 'apps/*/src/**'],
      exclude: ['**/*.test.ts', '**/*.d.ts', 'apps/web/src/main.ts'],
      // Umbrales globales de F0. F1 sube el dominio a 95 (doc 04).
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
})
