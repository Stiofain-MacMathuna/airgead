import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isLocal = mode === 'development';

  return {
    plugins: [react()],
    server: isLocal
      ? {
          host: '0.0.0.0',
          port: 3000,
          proxy: {
            '/api': {
              target: 'http://backend:8080', 
              changeOrigin: true,
              secure: false,
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq, req) => {
                  console.log('[VITE PROXY] Forwarding:', req.method, req.url);
                  console.log('[VITE PROXY] Headers:', req.headers);
                });
                proxy.on('proxyRes', (proxyRes, req, res) => {
                  console.log('[VITE PROXY] Response status:', proxyRes.statusCode);
                });
              },
            },
          },
        }
      : undefined,
  };
});