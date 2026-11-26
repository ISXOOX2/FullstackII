// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Aquí se conecta el frontend con el BACKEND (Spring Boot) usando axios (guía 3.2.2).
// • Hay UNA instancia de axios POR MICROSERVICIO: cada una sabe su dirección base (baseURL).
//   Así cada servicio del front usa la suya:  apiCatalogo.get('/disenos')
// • Un "interceptor" agrega el token JWT a TODAS las peticiones en un solo lugar.
// • RENOVACIÓN: si al token le quedan menos de 15 minutos, antes de la petición se pide uno nuevo
//   (POST /auth/renovar). Si el servidor responde 401 (token vencido o alterado), se cierra la sesión.
// • Las direcciones salen de variables de entorno (archivo .env). En AWS, Nginx recibe todo
//   en un solo dominio y redirige /api/v1/... al microservicio que corresponde.
// ───────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import { borrarSesion, guardarSesion, leerSesion } from './sesionService.js';

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

// ---------------------------------------------------------------------------
// Token JWT: vencimiento y renovación
// ---------------------------------------------------------------------------

/** Si al token le quedan menos de 15 minutos, se renueva antes de la siguiente petición. */
export const MARGEN_RENOVACION_MS = 15 * 60 * 1000;

/**
 * Fecha de vencimiento del token (ms). El JWT tiene 3 partes separadas por puntos; la del medio
 * (payload) es JSON en base64 y trae "exp" en segundos. Leerla NO es inseguro: la firma la revisa el backend.
 */
export function vencimientoToken(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).exp * 1000;
  } catch {
    return 0;
  }
}

export const tokenVencido = (token, ahora = Date.now()) => vencimientoToken(token) <= ahora;

let renovacionEnCurso = null; // si varias peticiones salen juntas, se renueva una sola vez

async function renovarTokenSiHaceFalta(config) {
  const sesion = leerSesion();
  if (!sesion?.token || config.url?.startsWith('/auth/')) return;
  const quedan = vencimientoToken(sesion.token) - Date.now();
  if (quedan <= 0 || quedan > MARGEN_RENOVACION_MS) return; // vencido (lo resolverá el 401) o todavía vigente
  if (!renovacionEnCurso) {
    renovacionEnCurso = axios
      .post(`${URLS.usuarios}/auth/renovar`, null, { headers: { Authorization: `Bearer ${sesion.token}` } })
      .then((respuesta) => {
        guardarSesion({ ...sesion, ...respuesta.data.usuario, token: respuesta.data.token });
        window.dispatchEvent(new Event('sesion-renovada')); // App actualiza su estado
      })
      .catch(() => {}) // si falla, la petición sigue con el token actual
      .finally(() => { renovacionEnCurso = null; });
  }
  await renovacionEnCurso;
}

/** Crea una instancia de axios con su dirección base y el token JWT de la sesión. */
function crearCliente(baseURL) {
  const cliente = axios.create({
    baseURL,
    timeout: 10000, // si el servidor no responde en 10 s, la petición falla en vez de quedar colgada
    headers: { 'Content-Type': 'application/json' },
  });

  // Antes de enviar cada petición: renueva el token si está por vencer y lo agrega como
  // "Authorization: Bearer <token>".
  cliente.interceptors.request.use(async (config) => {
    await renovarTokenSiHaceFalta(config);
    const token = leerSesion()?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Si el servidor responde 401 a una petición CON token, la sesión ya no sirve: se cierra.
  cliente.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
      const enviabaToken = Boolean(error.config?.headers?.Authorization);
      // leerSesion(): si varias peticiones fallan juntas, solo la primera cierra la sesión y avisa
      if (error.response?.status === 401 && enviabaToken && !error.config.url?.startsWith('/auth/') && leerSesion()) {
        borrarSesion();
        window.dispatchEvent(new Event('sesion-expirada'));
      }
      return Promise.reject(error);
    },
  );

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
