import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'd3': ['d3'],
          'jszip': ['jszip']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
