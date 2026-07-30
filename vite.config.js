import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ThorUberBH/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'icon-192.png',
        'icon-512.png',
      ],

      manifest: {
        id: '/ThorUberBH/',
        name: 'ThorUberBH',
        short_name: 'ThorUberBH',

        description:
          'Aplicativo para acompanhamento de desempenho como motorista de aplicativos.',

        theme_color: '#2563eb',
        background_color: '#f4f6f8',

        display: 'standalone',
        start_url: '/ThorUberBH/',
        scope: '/ThorUberBH/',

        icons: [
          {
            src: '/ThorUberBH/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/ThorUberBH/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/ThorUberBH/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})