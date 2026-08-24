import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginPage': './src/components/LoginPage.tsx',
      },
      remotes: {},
      shared: ['react', 'react-dom', 'react-redux'],
    }),
  ],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5004,
    cors: true,
  },
  preview: {
    port: 5004,
    cors: true,
  },
})
