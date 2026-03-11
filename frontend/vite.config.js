import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/static/',
  build: {
    outDir: '../static',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/download': 'http://localhost:8000',
      '/upload': 'http://localhost:8000',
      '/stats': 'http://localhost:8000',
      '/internet-speed': 'http://localhost:8000',
    },
  },
})
