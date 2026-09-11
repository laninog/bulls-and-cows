// ESLint 9 — flat config
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.wrangler/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ['apps/web/**/*.{ts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.config.{js,ts}', 'apps/web/playwright.config.ts', 'apps/web/e2e/**'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      // SEC-03 / DT-07: el secreto se filtró por consola en el legacy.
      // Cualquier console.* es error en todo el repo.
      'no-console': 'error',
      'no-debugger': 'error',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    // El Worker sí puede emitir logs estructurados de error, nunca de info.
    files: ['apps/api/src/**/*.ts'],
    rules: { 'no-console': ['error', { allow: ['error', 'warn'] }] },
  },
  prettier,
)
