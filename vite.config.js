import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite (el "motor" que compila y levanta el proyecto React).
// base './' permite publicar el sitio en GitHub Pages (github.io) sin romper las rutas.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, host: true },
});
