/** Mensajes del formulario de contacto (se guardan en la base simulada, no se envían por correo). */
import { listar, crear } from '../data/db.js';

export function guardarMensaje({ nombre, correo, comentario }, ahora = new Date()) {
  return crear('mensajes', {
    nombre: nombre.trim(),
    correo: correo.trim(),
    comentario: comentario.trim(),
    fecha: ahora.toISOString(),
  });
}

export function listarMensajes() {
  return listar('mensajes');
}
