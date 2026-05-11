import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: if you want to run dev server on a specific port
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // When running vite dev, this will proxy to your backend
        changeOrigin: true,
        // In a real Docker dev setup, you'd point this to the backend container name
      },
    },
  },
})
