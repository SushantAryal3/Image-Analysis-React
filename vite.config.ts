import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

dotenv.config();
export default defineConfig({
  base: '/Image-Analysis-React/',
  plugins: [react(), tsconfigPaths()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': '/src',
      '@Assets': '/src/assets',
      '@Pages': '/src/ui/pages',
      '@CustomComponents': '/src/ui/customComponents',
      '@Utils': '/src/utils',
      '@Constants': '/src/constants',
    },
  },
  define: {},
});
