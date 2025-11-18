import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for Pack Manager frontend
// Placing the config inside the frontend/ directory and explicitly setting
// root ensures Vite serves index.html from this folder even when invoked
// from the parent workspace (pack-manager).
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['semver', 'semver/functions/gt']
  },
  server: {
    host: true, // allow LAN access and use --host CLI flag
    port: 5173,
    strictPort: true,
    open: false
  },
  preview: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
