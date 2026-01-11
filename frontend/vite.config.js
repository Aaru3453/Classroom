import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      jsxRuntime: 'automatic',
      // Remove babel config for now
    })
  ],
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
});