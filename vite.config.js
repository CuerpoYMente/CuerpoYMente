import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 IMPORTANTE: base: '' y configuración para fallback
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
