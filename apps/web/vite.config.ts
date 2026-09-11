import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Se generan pero no se publican (SEC-08): F5 los envía al capturador de errores.
    sourcemap: 'hidden',
  },
})
