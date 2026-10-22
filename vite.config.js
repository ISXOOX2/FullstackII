import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite (el "motor" que compila y levanta el proyecto React).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // La carpeta backend/ es Java (Spring Boot): Vite no necesita vigilar sus archivos.
    watch: { ignored: ['**/backend/**'] },
  },
});
