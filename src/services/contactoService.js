// Mensajes del formulario de contacto.
// • Sin backend se guardan en la base simulada (db.js).
// • Con backend van a ms-reservas (POST /mensajes) y el personal los lee en el panel (GET /mensajes).
import { listar, crear } from '../data/db.js';
import { apiReservas, USAR_API } from './api.js';

export function guardarMensaje({ nombre, correo, comentario }, ahora = new Date()) {
  return crear('mensajes', {
    nombre: nombre.trim(),
    correo: correo.trim(),
    comentario: comentario.trim(),
    fecha: ahora.toISOString(),
  });
}

/** Enviar un mensaje (con backend va a ms-reservas). */
export async function enviarMensaje(valores) {
  if (!USAR_API) return guardarMensaje(valores);
  const respuesta = await apiReservas.post('/mensajes', {
    nombre: valores.nombre.trim(),
    correo: valores.correo.trim(),
    comentario: valores.comentario.trim(),
  });
  return respuesta.data;
}

/** Del más reciente al más antiguo. */
export function listarMensajes() {
  return listar('mensajes').sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}
