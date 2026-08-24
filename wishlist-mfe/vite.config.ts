import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'wishlist_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './WishlistPage': './src/components/WishlistPage.tsx',
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
    port: 5003,
    cors: true,
  },
  preview: {
    port: 5003,
    cors: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
})
