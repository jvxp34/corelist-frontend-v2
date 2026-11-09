import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// Modo "celular" (npm run dev -- --mode celular --host 0.0.0.0): https com
// certificado local, porque o navegador só libera a câmera em https, e
// /api repassado para o Django em localhost:8000 (ver .env.celular).
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'celular' ? [basicSsl()] : []),
  ],
  build: {
    rollupOptions: {
      output: {
        // O Amplify reescreve arquivos .wasm para a página do site: o leitor
        // de QR code (zxing-wasm) sai como .wasm.js, que ele entrega.
        assetFileNames: (arquivo) =>
          (arquivo.names?.[0] ?? '').endsWith('.wasm')
            ? 'assets/[name]-[hash].wasm.js'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: mode === 'celular'
    ? {
        proxy: {
          '/api': { target: 'http://localhost:8000', changeOrigin: true },
        },
      }
    : undefined,
}))
