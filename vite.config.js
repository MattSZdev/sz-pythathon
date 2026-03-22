import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],
  // Esto asegura que "global" exista en el navegador, vital para librerías Web3
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      // Recordatorio: Esto es SOLO para desarrollo local
      '/api/binance': {
        target: 'https://fapi.binance.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/binance/, '/fapi/v1/klines')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext', // Necesario para el Top-level await de algunas librerías de Pyth
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})