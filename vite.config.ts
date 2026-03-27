import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { tokensCSSPlugin } from './vite-plugins/tokens-css'

// https://vite.dev/config/
export default defineConfig(() => ({
  base: '/',
  plugins: [
    react(),
    tokensCSSPlugin(), // Generate CSS from JSON at build time
  ],
  server: {
    port: 5175,
    strictPort: false, // Allow fallback if port is in use
    hmr: {
      overlay: true,  // Show errors as overlay
    },
    watch: {
      usePolling: true,  // Enable polling for file changes
      interval: 100,     // Check for changes every 100ms
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/": path.resolve(__dirname, "./src/"),
      "@wex/design-tokens": path.resolve(__dirname, "./packages/design-tokens/css/index.css"),
      "@wex/design-tokens/tailwind-preset": path.resolve(__dirname, "./packages/design-tokens/tailwind-preset.js"),
    },
  },
  build: {
    // Increase the warning threshold to silence large chunk warnings
    // (no functional impact; adjust as needed)
    chunkSizeWarningLimit: 1500,
  },
}))
