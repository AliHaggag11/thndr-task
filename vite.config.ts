import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      cleanupOutdatedCaches: false,
      sourcemap: true
    },
    includeAssets: ['NDAQ.png'],
    manifest: {
      name: 'NASDAQ Stock Tracker',
      short_name: 'NASDAQ',
      description: 'Track NASDAQ stocks in real-time',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'NDAQ.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'NDAQ.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      start_url: '/',
      scope: '/',
      prefer_related_applications: false
    }
  })],
})
