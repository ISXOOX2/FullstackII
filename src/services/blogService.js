// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • El blog se lee desde el microservicio ms-catalogo (ruta /api/v1/blog) con axios (instancia apiBlog de api.js).
// • Con VITE_USAR_API=false (sin backend) se usan los artículos guardados en data/blogs.js.
// • Los artículos los publica el administrador en la API (Swagger) y el front los toma solo:
//   ver el hook useArticulos, que vuelve a pedir la lista cada 30 segundos.
// ───────────────────────────────────────────────────────────────────────────
import { BLOGS, obtenerBlog } from '../data/blogs.js';
import { apiBlog, USAR_API } from './api.js';

/** Cada cuánto se vuelve a pedir la lista de artículos (30 segundos). */
export const REFRESCO_BLOG_MS = 30000;

/** GET /api/v1/blog -> artículos del más nuevo al más antiguo. */
export async function listarArticulos() {
  if (!USAR_API) return BLOGS;
  const respuesta = await apiBlog.get('');
  return respuesta.data;
}

/** GET /api/v1/blog/{id} -> un artículo, o null si no existe. */
export async function obtenerArticulo(id) {
  if (!USAR_API) return obtenerBlog(id);
  try {
    const respuesta = await apiBlog.get(`/${id}`);
    return respuesta.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}
