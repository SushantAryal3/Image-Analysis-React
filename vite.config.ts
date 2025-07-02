import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import { domToCodePlugin } from 'dom-to-code/vite';
import react from '@vitejs/plugin-react';
dotenv.config();
export default defineConfig({
  base: '/image-analysis-react/',
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': '/src',
      '@Assets': '/src/assets',
      '@Atoms': '/src/ui/atoms',
      '@Molecules': '/src/ui/molecules',
      '@Organisms': '/src/ui/organisms',
      '@Templates': '/src/ui/templates',
      '@Pages': '/src/ui/pages',
      '@CustomComponents': '/src/ui/customComponents',
      '@Utils': '/src/utils',
      '@Store': '/src/store',
      '@Schemas': '/src/schemas',
      '@Hooks': '/src/hooks',
      '@Api': '/src/api',
      '@Services': '/src/api/services',
      '@Constants': '/src/constants',
      '@Queries': '/src/api/queries',
      '@Routes': '/src/routes',
      '@Animations': '/src/animations',
      '@Validation': '/src/validation',
    },
  },
  define: {},
  server: {
    open: true,
    port: 3040,
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/fastapi': {
        target: process.env.FAST_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fastapi/, ''),
      },
      '/weatherapi': {
        target: process.env.HWCW_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weatherapi/, ''),
      },
    },
  },
});
