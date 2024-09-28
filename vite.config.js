import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true, // Active CORS pour toutes les origines
  },
  envPrefix: 'VITE_',
  envDir: './',
});
