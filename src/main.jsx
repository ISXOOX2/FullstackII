// Punto de entrada de la aplicación (diapositivas "React II: React Router + Bootstrap").
//  1) Se importan los estilos globales: primero Bootstrap, después las fuentes y el tema propio,
//     para que nuestras reglas (tema.css) puedan sobrescribir las de Bootstrap (cascada CSS).
//  2) <BrowserRouter> envuelve a <App /> para que React Router maneje la navegación.
//
// Nota: solo se importa el CSS de Bootstrap (como en la guía 2.1.2). El JS de Bootstrap no hace
// falta porque react-bootstrap ya implementa en React el menú, el carrusel, los modales, etc.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import './assets/css/tema.css';
import App from './App.jsx';

// basename: en GitHub Pages el sitio vive en /FullstackII/; en desarrollo es "/".
// Vite deja ese valor en import.meta.env.BASE_URL según la opción "base" del build.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
