import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Chinesisch-lern-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\/hanzi-data\/.+\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hanzi-char-data',
              expiration: { maxEntries: 600 },
            },
          },
          {
            urlPattern: /\/hanzi-lookup\/.+$/,
            handler: 'CacheFirst',
            options: { cacheName: 'hanzi-lookup-assets' },
          },
        ],
      },
      manifest: {
        name: 'HSK B1 Lernapp',
        short_name: 'HSK B1',
        description: 'Chinesisch lernen — HSK B1 Vokabeln & Zeichen',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/Chinesisch-lern-app/',
        icons: [
          { src: '/Chinesisch-lern-app/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/Chinesisch-lern-app/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/Chinesisch-lern-app/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
