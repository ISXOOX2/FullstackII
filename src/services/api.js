// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Conexión con los 3 microservicios Spring Boot usando axios (clase "React V: Conectándose a
//   una API"). Cada microservicio corre en su propio puerto y tiene su propia base MySQL:
//     producto-service  -> http://localhost:8081  (catálogo y categorías)
//     usuario-service   -> http://localhost:8082  (login con JWT y registro)
//     carrito-service   -> http://localhost:8083  (carrito; consulta a producto-service)
// • Peticiones HTTP: GET para leer, POST para crear, PUT para actualizar, DELETE para eliminar.
// • Se exporta como OBJETO para que en las pruebas con Jasmine cada función se pueda
//   reemplazar por un mock (jasmine.createSpy) sin levantar los microservicios.
// • Si un microservicio no responde, la tienda sigue funcionando con los datos locales
//   (db.js): cada página decide qué hacer en el .catch().
// ───────────────────────────────────────────────────────────────────────────
import axios from 'axios';

export const URLS = {
  productos: 'http://localhost:8081/api',
  usuarios: 'http://localhost:8082/api',
  carritos: 'http://localhost:8083/api',
};

// Si un microservicio tarda más de 3 segundos se considera caído.
const CONFIG = { timeout: 3000 };

/** Header con el token JWT que entregó usuario-service al iniciar sesión. */
const conToken = (token) => ({ ...CONFIG, headers: { Authorization: `Bearer ${token}` } });

export const api = {
  // ─── producto-service ─────────────────────────────────────────────────────
  /** GET /api/productos -> lista de diseños */
  listarProductos: () => axios.get(`${URLS.productos}/productos`, CONFIG).then((res) => res.data),

  /** GET /api/productos/{id} -> un diseño (404 si no existe) */
  obtenerProducto: (id) => axios.get(`${URLS.productos}/productos/${id}`, CONFIG).then((res) => res.data),

  // ─── usuario-service ──────────────────────────────────────────────────────
  /** POST /api/auth/login -> { token, usuario } (401 si las credenciales son incorrectas) */
  login: (correo, password) =>
    axios.post(`${URLS.usuarios}/auth/login`, { correo, password }, CONFIG).then((res) => res.data),

  /** POST /api/usuarios -> usuario creado (400 datos inválidos, 409 correo o RUN repetido) */
  registrar: (datos) => axios.post(`${URLS.usuarios}/usuarios`, datos, CONFIG).then((res) => res.data),

  /** GET /api/usuarios/me -> mis datos (requiere el token) */
  misDatos: (token) => axios.get(`${URLS.usuarios}/usuarios/me`, conToken(token)).then((res) => res.data),

  // ─── carrito-service ──────────────────────────────────────────────────────
  /** GET /api/carritos/{clave} -> { items, total, cantidadTotal } */
  obtenerCarrito: (clave) => axios.get(`${URLS.carritos}/carritos/${clave}`, CONFIG).then((res) => res.data),

  /** PUT /api/carritos/{clave} -> guarda la reserva completa: [{ productoId, cantidad }] */
  guardarCarrito: (clave, items) =>
    axios.put(`${URLS.carritos}/carritos/${clave}`, { items }, CONFIG).then((res) => res.data),
};

/**
 * Mensaje de error para mostrar en pantalla. Los microservicios responden siempre con el
 * mismo DTO de error ({ status, mensaje, campos }), así que basta con leer "mensaje".
 * Si no hubo respuesta (servicio apagado) devuelve null.
 */
export function mensajeDeError(error) {
  if (!error || !error.response) return null;
  const datos = error.response.data || {};
  if (datos.campos) return Object.values(datos.campos)[0];
  return datos.mensaje || 'Ocurrió un error en el servidor.';
}

/** true si el microservicio no respondió (apagado, sin red o timeout). */
export function servicioNoDisponible(error) {
  return !error || !error.response;
}
