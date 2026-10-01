import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const secretPath = env.VITE_ADMIN_SECRET_PATH || 'manager-portal-sec-x9k2';

  return {
    plugins: [
      react(),
      {
        name: 'secret-portal-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Secret obfuscated path rewrite (e.g., /manager-portal-sec-x9k2)
            const urlPath = req.url.split('?')[0].replace(/\/+$/, '');
            if (urlPath === `/${secretPath}` || urlPath === '/manager-portal-sec-x9k2') {
              req.url = '/manager-portal-sec-x9k2.html';
            }
            next();
          });
        },
      },
    ],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          managerPortal: resolve(__dirname, 'manager-portal-sec-x9k2.html'),
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  };
});
