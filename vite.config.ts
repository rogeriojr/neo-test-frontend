import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
// Função para copiar a pasta assets para a pasta dist durante o build
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    closeBundle() {
      // Verifica se a pasta assets existe
      if (fs.existsSync('./assets')) {
        // Cria a pasta assets na dist se não existir
        if (!fs.existsSync('./dist/assets')) {
          fs.mkdirSync('./dist/assets', { recursive: true });
        }

        // Copia os arquivos da pasta assets para a pasta dist/assets
        const files = fs.readdirSync('./assets');
        files.forEach(file => {
          fs.copyFileSync(`./assets/${file}`, `./dist/assets/${file}`);
        });

        console.log('Assets copied successfully!');
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyAssetsPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['styled-components', 'react-slick', 'slick-carousel'],
        },
      },
    },
  },
  server: {
    port: 5175,
    strictPort: false,
    open: false,
    cors: true,
  },
})