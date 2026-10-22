import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite (el "motor" que compila y levanta el proyecto React).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
});
