import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cart_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './CartPage': './src/components/CartPage.tsx',
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
    port: 5002,
    cors: true,
  },
  preview: {
    port: 5002,
    cors: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
})
