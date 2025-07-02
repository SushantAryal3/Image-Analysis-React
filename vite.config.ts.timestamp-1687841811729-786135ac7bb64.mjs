// vite.config.ts
import dotenv from 'file:///H:/NAXA/localews-frontend-typescript/node_modules/dotenv/lib/main.js';
import { defineConfig } from 'file:///H:/NAXA/localews-frontend-typescript/node_modules/vite/dist/node/index.js';
import react from 'file:///H:/NAXA/localews-frontend-typescript/node_modules/@vitejs/plugin-react/dist/index.mjs';
var __vite_injected_original_import_meta_url = 'file:///H:/NAXA/localews-frontend-typescript/vite.config.ts';
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx'],
    alias: {
      '@': new URL('./src/', __vite_injected_original_import_meta_url).pathname,
      '@Assets': new URL('./src/assets/', __vite_injected_original_import_meta_url).pathname,
      '@Atoms': new URL('./src/ui/atoms/', __vite_injected_original_import_meta_url).pathname,
      '@Molecules': new URL('./src/ui/molecules/', __vite_injected_original_import_meta_url).pathname,
      '@Organisms': new URL('./src/ui/organisms/', __vite_injected_original_import_meta_url).pathname,
      '@Templates': new URL('./src/ui/templates/', __vite_injected_original_import_meta_url).pathname,
      '@Pages': new URL('./src/ui/pages/', __vite_injected_original_import_meta_url).pathname,
      '@CustomComponents': new URL('./src/ui/customComponents/', __vite_injected_original_import_meta_url).pathname,
      '@Utils': new URL('./src/utils/', __vite_injected_original_import_meta_url).pathname,
      '@Store': new URL('./src/store/', __vite_injected_original_import_meta_url).pathname,
      '@Schemas': new URL('./src/schemas/', __vite_injected_original_import_meta_url).pathname,
      '@Hooks': new URL('./src/hooks/', __vite_injected_original_import_meta_url).pathname,
      '@Api': new URL('./src/api/', __vite_injected_original_import_meta_url).pathname,
      '@Services': new URL('./src/api/services/', __vite_injected_original_import_meta_url).pathname,
      '@Constants': new URL('./src/constants/', __vite_injected_original_import_meta_url).pathname,
      '@Queries': new URL('./src/api/queries/', __vite_injected_original_import_meta_url).pathname,
      '@Routes': new URL('./src/routes/', __vite_injected_original_import_meta_url).pathname,
    },
  },
  build: {
    sourcemap: true,
  },
  define: {
    'process.env': {
      API_URL: process.env.API_URL,
      SITE_NAME: process.env.SITE_NAME,
      FAST_API_URL: process.env.FAST_API_URL,
    },
  },
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
    },
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFxOQVhBXFxcXGxvY2FsZXdzLWZyb250ZW5kLXR5cGVzY3JpcHRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkg6XFxcXE5BWEFcXFxcbG9jYWxld3MtZnJvbnRlbmQtdHlwZXNjcmlwdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vSDovTkFYQS9sb2NhbGV3cy1mcm9udGVuZC10eXBlc2NyaXB0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGRvdGVudiBmcm9tICdkb3RlbnYnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuLy8gaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuXHJcbmRvdGVudi5jb25maWcoKTtcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgZXh0ZW5zaW9uczogWycudHMnLCAnLnRzeCddLFxyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBuZXcgVVJMKCcuL3NyYy8nLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxyXG4gICAgICAnQEFzc2V0cyc6IG5ldyBVUkwoJy4vc3JjL2Fzc2V0cy8nLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxyXG4gICAgICAnQEF0b21zJzogbmV3IFVSTCgnLi9zcmMvdWkvYXRvbXMvJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcclxuICAgICAgJ0BNb2xlY3VsZXMnOiBuZXcgVVJMKCcuL3NyYy91aS9tb2xlY3VsZXMvJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcclxuICAgICAgJ0BPcmdhbmlzbXMnOiBuZXcgVVJMKCcuL3NyYy91aS9vcmdhbmlzbXMvJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcclxuICAgICAgJ0BUZW1wbGF0ZXMnOiBuZXcgVVJMKCcuL3NyYy91aS90ZW1wbGF0ZXMvJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcclxuICAgICAgJ0BQYWdlcyc6IG5ldyBVUkwoJy4vc3JjL3VpL3BhZ2VzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICAgICdAQ3VzdG9tQ29tcG9uZW50cyc6IG5ldyBVUkwoJy4vc3JjL3VpL2N1c3RvbUNvbXBvbmVudHMvJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcclxuICAgICAgJ0BVdGlscyc6IG5ldyBVUkwoJy4vc3JjL3V0aWxzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICAgICdAU3RvcmUnOiBuZXcgVVJMKCcuL3NyYy9zdG9yZS8nLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxyXG4gICAgICAnQFNjaGVtYXMnOiBuZXcgVVJMKCcuL3NyYy9zY2hlbWFzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICAgICdASG9va3MnOiBuZXcgVVJMKCcuL3NyYy9ob29rcy8nLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxyXG4gICAgICAnQEFwaSc6IG5ldyBVUkwoJy4vc3JjL2FwaS8nLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxyXG4gICAgICAnQFNlcnZpY2VzJzogbmV3IFVSTCgnLi9zcmMvYXBpL3NlcnZpY2VzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICAgICdAQ29uc3RhbnRzJzogbmV3IFVSTCgnLi9zcmMvY29uc3RhbnRzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICAgICdAUXVlcmllcyc6IG5ldyBVUkwoJy4vc3JjL2FwaS9xdWVyaWVzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICAgICdAUm91dGVzJzogbmV3IFVSTCgnLi9zcmMvcm91dGVzLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgJ3Byb2Nlc3MuZW52Jzoge1xyXG4gICAgICBCQVNFX1VSTDogcHJvY2Vzcy5lbnYuQkFTRV9VUkwsXHJcbiAgICAgIFNJVEVfTkFNRTogcHJvY2Vzcy5lbnYuU0lURV9OQU1FLFxyXG4gICAgICBGQVNUX0FQSTogcHJvY2Vzcy5lbnYuRkFTVF9BUEksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBvcGVuOiB0cnVlLFxyXG4gICAgcG9ydDogMzA0MCxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogcHJvY2Vzcy5lbnYuQkFTRV9VUkwsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgIH0sXHJcbiAgICAgICcvZmFzdGFwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LkZBU1RfQVBJLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZmFzdGFwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1MsT0FBTyxZQUFZO0FBQ3ZULFNBQVMsb0JBQW9CO0FBRTdCLE9BQU8sV0FBVztBQUhtSyxJQUFNLDJDQUEyQztBQUt0TyxPQUFPLE9BQU87QUFDZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDLE9BQU8sTUFBTTtBQUFBLElBQzFCLE9BQU87QUFBQSxNQUNMLEtBQUssSUFBSSxJQUFJLFVBQVUsd0NBQWUsRUFBRTtBQUFBLE1BQ3hDLFdBQVcsSUFBSSxJQUFJLGlCQUFpQix3Q0FBZSxFQUFFO0FBQUEsTUFDckQsVUFBVSxJQUFJLElBQUksbUJBQW1CLHdDQUFlLEVBQUU7QUFBQSxNQUN0RCxjQUFjLElBQUksSUFBSSx1QkFBdUIsd0NBQWUsRUFBRTtBQUFBLE1BQzlELGNBQWMsSUFBSSxJQUFJLHVCQUF1Qix3Q0FBZSxFQUFFO0FBQUEsTUFDOUQsY0FBYyxJQUFJLElBQUksdUJBQXVCLHdDQUFlLEVBQUU7QUFBQSxNQUM5RCxVQUFVLElBQUksSUFBSSxtQkFBbUIsd0NBQWUsRUFBRTtBQUFBLE1BQ3RELHFCQUFxQixJQUFJLElBQUksOEJBQThCLHdDQUFlLEVBQUU7QUFBQSxNQUM1RSxVQUFVLElBQUksSUFBSSxnQkFBZ0Isd0NBQWUsRUFBRTtBQUFBLE1BQ25ELFVBQVUsSUFBSSxJQUFJLGdCQUFnQix3Q0FBZSxFQUFFO0FBQUEsTUFDbkQsWUFBWSxJQUFJLElBQUksa0JBQWtCLHdDQUFlLEVBQUU7QUFBQSxNQUN2RCxVQUFVLElBQUksSUFBSSxnQkFBZ0Isd0NBQWUsRUFBRTtBQUFBLE1BQ25ELFFBQVEsSUFBSSxJQUFJLGNBQWMsd0NBQWUsRUFBRTtBQUFBLE1BQy9DLGFBQWEsSUFBSSxJQUFJLHVCQUF1Qix3Q0FBZSxFQUFFO0FBQUEsTUFDN0QsY0FBYyxJQUFJLElBQUksb0JBQW9CLHdDQUFlLEVBQUU7QUFBQSxNQUMzRCxZQUFZLElBQUksSUFBSSxzQkFBc0Isd0NBQWUsRUFBRTtBQUFBLE1BQzNELFdBQVcsSUFBSSxJQUFJLGlCQUFpQix3Q0FBZSxFQUFFO0FBQUEsSUFDdkQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZTtBQUFBLE1BQ2IsVUFBVSxRQUFRLElBQUk7QUFBQSxNQUN0QixXQUFXLFFBQVEsSUFBSTtBQUFBLE1BQ3ZCLFVBQVUsUUFBUSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRLFFBQVEsSUFBSTtBQUFBLFFBQ3BCLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM5QztBQUFBLE1BQ0EsWUFBWTtBQUFBLFFBQ1YsUUFBUSxRQUFRLElBQUk7QUFBQSxRQUNwQixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsY0FBYyxFQUFFO0FBQUEsTUFDbEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
