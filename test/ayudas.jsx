// Funciones de apoyo compartidas por las pruebas (no es una prueba en sí misma).
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AvisosProvider } from '../src/context/AvisosContext.jsx';
import { SesionProvider } from '../src/context/SesionContext.jsx';
import { CarritoProvider } from '../src/context/CarritoContext.jsx';
import { reiniciarBD } from '../src/data/db.js';
import { CLAVE_CARRITO } from '../src/services/carritoService.js';
import { CLAVE_SESION, guardarSesion } from '../src/services/sesionService.js';
import { autenticar } from '../src/services/usuariosService.js';
import { obtenerProducto } from '../src/services/productosService.js';

/** Deja el navegador "de fábrica": base de datos sembrada, sin carrito y sin sesión. */
export function reiniciarTodo() {
  reiniciarBD();
  localStorage.removeItem(CLAVE_CARRITO);
  sessionStorage.removeItem(CLAVE_SESION);
}

/** Inicia sesión "por detrás" (sin pasar por el formulario) con una de las cuentas de la semilla. */
export function conectarComo(correo, password) {
  guardarSesion(autenticar(correo, password));
}

export const ADMIN = ['admin.trazofino@gmail.com', 'Admin#123'];
export const VENDEDOR = ['vendedor.trazofino@gmail.com', 'Venta#123'];
export const CLIENTE = ['cliente.demo@gmail.com', 'Cliente#1'];

/** Renderiza un componente con el enrutador y los tres contextos de la aplicación. */
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

/** Producto real de la semilla (por id) para usar en las pruebas. */
export const productoDePrueba = (id) => obtenerProducto(id);
