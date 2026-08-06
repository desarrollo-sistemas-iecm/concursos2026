import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Si se define VITE_BASE_PATH en el .env se usa esa subruta, de lo contrario en local '/' y en build rutas relativas './'
  const base = mode === 'development' ? '/' : (env.VITE_BASE_PATH || './');

  return {
    plugins: [
      vue(),
      tailwindcss()
    ],
    base: base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: path.resolve(__dirname, '../backend/public'),
      emptyOutDir: true
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3005',
          changeOrigin: true
        },
        '/socket.io': {
          target: 'http://localhost:3005',
          ws: true
        }
      }
    }
  };
});
