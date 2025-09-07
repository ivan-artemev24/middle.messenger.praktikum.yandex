import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist',
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  appType: 'spa'
});
