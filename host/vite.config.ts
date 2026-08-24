import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'node:path'

// Falls back to localhost for local dev; override via env vars for deployed remotes.
const catalogUrl =
  process.env.CATALOG_REMOTE_URL || 'http://localhost:5001/assets/remoteEntry.js'
const cartUrl = process.env.CART_REMOTE_URL || 'http://localhost:5002/assets/remoteEntry.js'
const wishlistUrl = process.env.WISHLIST_REMOTE_URL || 'http://localhost:5003/assets/remoteEntry.js'
const authUrl = process.env.AUTH_REMOTE_URL || 'http://localhost:5004/assets/remoteEntry.js'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        catalog_mfe: catalogUrl,
        cart_mfe: cartUrl,
        wishlist_mfe: wishlistUrl,
        auth_mfe: authUrl,
      },
      shared: ['react', 'react-dom', 'react-redux'],
    }),
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 5000,
  },
  build: {
    target: 'esnext',
  },
})
