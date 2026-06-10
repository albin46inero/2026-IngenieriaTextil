import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Content-Security-Policy': "frame-src https://www.youtube.com https://www.youtube-nocookie.com;"
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separa las librerías grandes
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('motion') || id.includes('lucide-react') || id.includes('react-icons')) {
              return 'ui-vendor'
            }
            if (id.includes('axios') || id.includes('recharts') || id.includes('react-pdf')) {
              return 'data-vendor'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})