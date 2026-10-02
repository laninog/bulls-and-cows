import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    // PWA (D-05): instalable y con el app shell en caché; el juego casual funciona sin red.
    VitePWA({
      // El jugador decide cuándo actualizar: recargar a mitad de un intento perdería lo tecleado.
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: 'Bulls and Cows',
        short_name: 'Bulls & Cows',
        description: 'Adivina el número secreto · Guess the secret number',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f5f6fb',
        theme_color: '#3f51b5',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
        // Navegaciones de la SPA sin red → index.html precacheado. La API nunca.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        // SEC-08: sin mapas públicos del service worker.
        sourcemap: false,
      },
    }),
  ],
  build: {
    // Se generan pero no se publican (SEC-08): F5 los envía al capturador de errores.
    sourcemap: 'hidden',
  },
})
