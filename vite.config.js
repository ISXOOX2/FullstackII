import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite (el "motor" que compila y levanta el proyecto React).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },

  // Configuración de las pruebas unitarias con Vitest (clase React IV).
  test: {
    // jsdom simula el navegador (DOM) dentro de Node, para poder dibujar componentes React.
    environment: 'jsdom',
    // describe, it y expect quedan disponibles sin importarlos (igual se importan para que se lea claro).
    globals: true,
    // Archivo que se ejecuta antes de las pruebas: agrega los matchers de jest-dom.
    setupFiles: './test/setup.js',
    include: ['test/**/*.test.{js,jsx}'],
    // Informe de cobertura: npm run test:coverage → resumen en la terminal y página en coverage/index.html
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx'],
    },
  },
});
