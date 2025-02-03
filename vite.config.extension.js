// vite.config.extension.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    watch: {
      include: [
        'src/**',
        'public/**'
      ],
      exclude: [
        'node_modules/**',
        'dist/**'
      ]
    },
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'public/content.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        dir: 'dist'
      },
    },
    manifest: true,
    minify: false, // Easier debugging during development
    sourcemap: true,
    outDir: 'dist'
  },
});
