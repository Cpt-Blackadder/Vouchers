import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Matches the repository name
  css: {
    postcss: './postcss.config.cjs',
  },
});