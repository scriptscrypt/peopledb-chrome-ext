// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: 'public/content.js',
        main: 'index.html'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    manifest: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000
    }
  }
});
