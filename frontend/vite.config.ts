import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const frontendDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  envDir: path.resolve(frontendDir, '..'),
  optimizeDeps: {
    include: [
      '@base-ui/react/button',
      '@base-ui/react/merge-props',
      '@base-ui/react/use-render',
    ],
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(frontendDir, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
