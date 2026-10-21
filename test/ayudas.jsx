// Funciones de apoyo compartidas por las pruebas (no es una prueba en sí misma).
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AvisosProvider } from '../src/context/AvisosContext.jsx';
import { SesionProvider } from '../src/context/SesionContext.jsx';
import { CarritoProvider } from '../src/context/CarritoContext.jsx';
import { reiniciarBD } from '../src/data/db.js';
import { CLAVE_CARRITO } from '../src/services/carritoService.js';
import { CLAVE_SESION } from '../src/services/sesionService.js';
import { obtenerProducto } from '../src/services/productosService.js';

/** Deja el navegador "de fábrica": base de datos inicial, sin carrito y sin sesión. */
export function reiniciarTodo() {
  reiniciarBD();
  localStorage.removeItem(CLAVE_CARRITO);
  sessionStorage.removeItem(CLAVE_SESION);
}

/** Dibuja un componente dentro del enrutador y de los tres contextos de la aplicación. */
export function renderConApp(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AvisosProvider>
        <SesionProvider>
          <CarritoProvider>{ui}</CarritoProvider>
        </SesionProvider>
      </AvisosProvider>
    </MemoryRouter>,
  );
}

/** Un diseño real de los datos iniciales (por id) para usar en las pruebas. */
export const productoDePrueba = (id) => obtenerProducto(id);
