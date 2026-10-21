// Funciones de apoyo compartidas por las pruebas (no es una prueba en sí misma).
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { AvisosProvider } from '../src/context/AvisosContext.jsx';
import { SesionProvider } from '../src/context/SesionContext.jsx';
import { CarritoProvider } from '../src/context/CarritoContext.jsx';
import { reiniciarBD } from '../src/data/db.js';
import { CLAVE_CARRITO } from '../src/services/carritoService.js';
import { CLAVE_SESION, guardarSesion } from '../src/services/sesionService.js';
import { autenticar } from '../src/services/usuariosService.js';
import { obtenerProducto } from '../src/services/productosService.js';
import { fechaISO, sumarDias } from '../src/utils/formato.js';

/** Deja el navegador "de fábrica": base de datos inicial, sin carrito y sin sesión. */
export function reiniciarTodo() {
  reiniciarBD();
  localStorage.removeItem(CLAVE_CARRITO);
  sessionStorage.removeItem(CLAVE_SESION);
}

/**
 * Dibuja un componente suelto dentro del enrutador y de los tres contextos.
 * MemoryRouter es el enrutador "de mentira" para pruebas: la ruta inicial se indica a mano.
 */
export function renderConContextos(ui, { ruta = '/' } = {}) {
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

/** Dibuja la aplicación completa (todas las rutas) partiendo en la ruta indicada. */
export function renderApp(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

/** Deja una sesión iniciada con una de las cuentas de demostración del README. */
export function iniciarSesionComo(correo, password) {
  const usuario = autenticar(correo, password);
  guardarSesion(usuario);
  return usuario;
}

/** Un diseño real de los datos iniciales (por id) para usar en las pruebas. */
export const productoDePrueba = (id) => obtenerProducto(id);

/** Próximo miércoles desde mañana (el estudio atiende de martes a sábado). */
export function proximoMiercoles() {
  let fecha = sumarDias(fechaISO(), 1);
  while (new Date(fecha + 'T00:00:00').getDay() !== 3) fecha = sumarDias(fecha, 1);
  return fecha;
}
