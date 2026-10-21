import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite (el "motor" que compila y levanta el proyecto React).
// base: carpeta desde donde se sirve el sitio. En desarrollo y con Live Server es "/".
// El workflow de GitHub Pages compila con --base=/FullstackII/ (nombre del repositorio).
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { port: 5173, host: true },
});
