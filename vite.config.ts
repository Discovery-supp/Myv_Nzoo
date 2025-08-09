import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    allowedHosts: [
      'nzoo-immo.onrender.com',
      'nzoo-immo-4.onrender.com'
    ]
  }
});

