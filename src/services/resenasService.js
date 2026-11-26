// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Reseñas de clientes para generar confianza: estrellas de 1 (la peor) a 5 (la mejor),
//   un comentario y una foto opcional del tatuaje.
// • Regla: solo un cliente con sesión iniciada puede publicar, y una reseña por cliente
//   (si vuelve a opinar, se actualiza la suya).
// • Sin backend usa el CRUD genérico de db.js. Con backend (VITE_USAR_API=true) publica con
//   PUT /api/v1/catalogo/resenas/mia: el servidor saca el id del cliente del TOKEN, así nadie puede
//   escribir ni borrar la reseña de otro desde las herramientas del navegador (F12).
// ───────────────────────────────────────────────────────────────────────────
import { actualizar, crear, eliminar, listar } from '../data/db.js';
import { fechaISO } from '../utils/formato.js';
import { apiCatalogo, USAR_API } from './api.js';
import { sincronizarResenas } from './sincronizacion.js';

const COLECCION = 'resenas';

/** Todas las reseñas, de la más reciente a la más antigua. */
export function listarResenas() {
  return listar(COLECCION).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
}

export function resenaDeUsuario(usuarioId) {
  return listarResenas().find((r) => r.usuarioId === Number(usuarioId)) || null;
}

/** Promedio con un decimal (0 si no hay reseñas). */
export function promedioEstrellas(resenas = listarResenas()) {
  if (resenas.length === 0) return 0;
  const suma = resenas.reduce((total, r) => total + r.estrellas, 0);
  return Math.round((suma / resenas.length) * 10) / 10;
}

/** Cuántas reseñas hay de cada nota: { 5: 2, 4: 1, 3: 1, 2: 0, 1: 0 }. */
export function distribucionEstrellas(resenas = listarResenas()) {
  const conteo = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  resenas.forEach((r) => { conteo[r.estrellas] += 1; });
  return conteo;
}

/** Nombre corto que se publica: "Camila F." (nombre + inicial del apellido). */
export function nombrePublico(usuario) {
  const inicial = usuario.apellidos ? ` ${usuario.apellidos.trim()[0]}.` : '';
  return `${usuario.nombre}${inicial}`;
}

/** Crea la reseña del usuario o actualiza la que ya tenía. Devuelve la reseña guardada. */
export function guardarResena(usuario, { estrellas, comentario, imagen = '' }) {
  const datos = {
    usuarioId: usuario.id,
    nombre: nombrePublico(usuario),
    estrellas: Number(estrellas),
    comentario: String(comentario).trim(),
    imagen,
    fecha: fechaISO(),
  };
  const existente = resenaDeUsuario(usuario.id);
  return existente ? actualizar(COLECCION, existente.id, datos) : crear(COLECCION, datos);
}

export function eliminarResena(id) {
  return eliminar(COLECCION, id);
}

/** Publicar o actualizar la reseña propia (con backend va a ms-catalogo). */
export async function publicarResena(usuario, datos) {
  if (!USAR_API) return guardarResena(usuario, datos);
  const respuesta = await apiCatalogo.put('/resenas/mia', {
    nombre: nombrePublico(usuario),
    estrellas: Number(datos.estrellas),
    comentario: String(datos.comentario).trim(),
    imagen: datos.imagen || '',
  });
  await sincronizarResenas();
  return respuesta.data;
}

/** Eliminar una reseña (solo el administrador; con backend, DELETE /resenas/{id}). */
export async function quitarResena(id) {
  if (!USAR_API) return eliminarResena(id);
  await apiCatalogo.delete(`/resenas/${id}`);
  await sincronizarResenas();
  return true;
}
