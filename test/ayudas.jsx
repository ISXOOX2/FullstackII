// Funciones de apoyo compartidas por las pruebas (no es una prueba en sí misma).
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { reiniciarBD } from '../src/data/db.js';
import { CLAVE_CARRITO } from '../src/services/carritoService.js';
import { CLAVE_SESION, guardarSesion } from '../src/services/sesionService.js';
import { autenticar } from '../src/services/usuariosService.js';
import { obtenerProducto } from '../src/services/productosService.js';
import { fechaISO, sumarDias } from '../src/utils/formato.js';
import { api } from '../src/services/api.js';

/**
 * Mock de los microservicios: cada función de api.js se reemplaza por un spy que responde
 * "sin conexión". Así las pruebas no dependen de que Spring Boot esté encendido y la tienda
 * usa sus datos locales. Una prueba puede cambiar la respuesta de un spy (ver prueba 14).
 */
export function simularMicroserviciosApagados() {
  Object.keys(api).forEach((nombre) => {
    api[nombre] = jasmine.createSpy(nombre).and.callFake(() => Promise.reject(new Error('sin conexión')));
  });
}

/** Deja el navegador "de fábrica": base de datos inicial, sin carrito, sin sesión y sin microservicios. */
export function reiniciarTodo() {
  reiniciarBD();
  localStorage.removeItem(CLAVE_CARRITO);
  sessionStorage.removeItem(CLAVE_SESION);
  simularMicroserviciosApagados();
}

/**
 * Dibuja un componente que usa <Link> o rutas. Como en React IV, MemoryRouter simula la
 * navegación sin un navegador real; initialEntries indica en qué ruta "entró" el usuario.
 */
export function renderConRouter(ui, { ruta = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>);
}

/** Dibuja la aplicación completa (todas las rutas) partiendo en la ruta indicada. */
export function renderApp(ruta = '/') {
  return renderConRouter(<App />, { ruta });
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
