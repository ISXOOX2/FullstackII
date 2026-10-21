// Punto de entrada de la aplicación (diapositivas "React II: React Router + Bootstrap").
//  1) Se importan los estilos globales: primero Bootstrap y después el tema propio, para que
//     nuestras reglas (tema.css) puedan sobrescribir las de Bootstrap (cascada CSS).
//  2) <BrowserRouter> envuelve a <App /> para que React Router maneje la navegación.
//
// Nota: solo se importa el CSS de Bootstrap (como en la guía 2.1.2). El JS de Bootstrap no hace
// falta porque react-bootstrap ya implementa en React el menú, el carrusel, los modales, etc.
// Las fuentes (Jost y Cormorant Garamond) se cargan desde Google Fonts en index.html (clase Css 2).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/tema.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
