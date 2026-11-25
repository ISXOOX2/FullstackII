// Se ejecuta antes de las pruebas (ver "setupFiles" en vite.config.js).
// Agrega los matchers de @testing-library/jest-dom, como .toBeInTheDocument() o .toHaveTextContent(),
// que se ven en la clase React IV.
import '@testing-library/jest-dom/vitest';

// jsdom no implementa window.scrollTo (la app lo usa al cambiar de página). Se reemplaza por una
// función vacía para que las pruebas no llenen la terminal de avisos.
window.scrollTo = () => {};

// jsdom no trae matchMedia y GSAP (ScrollTrigger y gsap.matchMedia) lo necesita.
// Se simula diciendo que ninguna media query se cumple: en las pruebas no se anima nada.
window.matchMedia = window.matchMedia || ((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
}));
