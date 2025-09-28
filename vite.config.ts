import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],
      manifest: {
        name: 'UCCA Akwa Ibom State Portal',
        short_name: 'UCCA AKS',
        description: 'Universal Council of Christ Ambassadors, AKS Portal',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/pwa-icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-icon-192x192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          // (Optional) extra sizes for better compatibility
          {
            src: '/pwa-icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/pwa-icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
