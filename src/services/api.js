// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Aquí se conecta el frontend con el BACKEND (Spring Boot) usando axios (guía 3.2.2).
// • Hay UNA instancia de axios POR MICROSERVICIO: cada una sabe su dirección base (baseURL).
//   Así cada servicio del front usa la suya:  apiCatalogo.get('/disenos')
// • Un "interceptor" agrega el token JWT a TODAS las peticiones en un solo lugar.
// • Las direcciones salen de variables de entorno (archivo .env). En AWS, Nginx recibe todo
//   en un solo dominio y redirige /api/v1/... al microservicio que corresponde.
// ───────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import { leerSesion } from './sesionService.js';

// Dirección base de cada microservicio. Si no hay .env, se usan rutas relativas del mismo dominio.
const URLS = {
  usuarios: import.meta.env.VITE_API_USUARIOS || '/api/v1/usuarios',
  catalogo: import.meta.env.VITE_API_CATALOGO || '/api/v1/catalogo',
  reservas: import.meta.env.VITE_API_RESERVAS || '/api/v1/reservas',
  blog: import.meta.env.VITE_API_BLOG || '/api/v1/blog',
};

/**
 * true cuando el backend ya está listo (VITE_USAR_API=true en el .env).
 * Mientras sea false, los servicios siguen usando la base de datos simulada (data/db.js).
 */
export const USAR_API = import.meta.env.VITE_USAR_API === 'true';

/** Crea una instancia de axios con su dirección base y el token JWT de la sesión. */
function crearCliente(baseURL) {
  const cliente = axios.create({
    baseURL,
    timeout: 10000, // si el servidor no responde en 10 s, la petición falla en vez de quedar colgada
    headers: { 'Content-Type': 'application/json' },
  });

  // Antes de enviar cada petición: si hay sesión con token, se agrega "Authorization: Bearer <token>".
  cliente.interceptors.request.use((config) => {
    const token = leerSesion()?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return cliente;
}

// Una instancia por microservicio
export const apiUsuarios = crearCliente(URLS.usuarios); // registro, login (JWT), roles
export const apiCatalogo = crearCliente(URLS.catalogo); // diseños, categorías, tatuadores, insumos
export const apiReservas = crearCliente(URLS.reservas); // agenda, reservas, pagos, reembolsos y cambios
export const apiBlog = crearCliente(URLS.blog); //        artículos del blog

/** Convierte un error de axios en un mensaje claro para mostrar al usuario. */
export function mensajeDeError(error) {
  if (error.response?.data?.mensaje) return error.response.data.mensaje; // mensaje que envía el backend
  if (error.response?.status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
  if (error.response?.status === 403) return 'No tienes permiso para hacer esta acción.';
  if (error.code === 'ECONNABORTED' || !error.response) return 'No pudimos conectar con el servidor. Intenta de nuevo.';
  return 'Ocurrió un error inesperado.';
}

/*
 * Ejemplo de cómo quedará un servicio cuando exista el backend (por ejemplo en productosService.js):
 *
 *   import { apiCatalogo, USAR_API } from './api.js';
 *
 *   export async function listarProductosApi() {
 *     const respuesta = await apiCatalogo.get('/disenos');   // GET /api/v1/catalogo/disenos
 *     return respuesta.data;
 *   }
 *
 * Y para pedir un reembolso (microservicio de reservas):
 *
 *   await apiReservas.post(`/${ordenId}/solicitudes`, { tipo: 'reembolso', motivo, justificativo });
 */
