/** Servicio de categorías (estilos de tatuaje). */
import { listar, obtenerPorId, crear, actualizar, eliminar } from '../data/db.js';

const COLECCION = 'categorias';

export function listarCategorias() {
  return listar(COLECCION);
}

export function obtenerCategoria(id) {
  return obtenerPorId(COLECCION, id);
}

export function nombreCategoria(id) {
  const categoria = obtenerCategoria(id);
  return categoria ? categoria.nombre : 'Sin categoría';
}

export function contarProductosDeCategoria(id) {
  return listar('productos').filter((p) => p.categoriaId === Number(id)).length;
}

function nombreRepetido(nombre, idActual = null) {
  return listarCategorias().some(
    (c) => c.nombre.trim().toLowerCase() === String(nombre).trim().toLowerCase() && c.id !== Number(idActual),
  );
}

export function crearCategoria(datos) {
  if (nombreRepetido(datos.nombre)) return { ok: false, error: 'Ya existe una categoría con ese nombre.' };
  const categoria = crear(COLECCION, {
    nombre: datos.nombre.trim(),
    descripcion: (datos.descripcion || '').trim(),
    imagen: datos.imagen || 'img/disenos/mariposa-lineal.svg',
  });
  return { ok: true, categoria };
}

export function actualizarCategoria(id, datos) {
  if (nombreRepetido(datos.nombre, id)) return { ok: false, error: 'Ya existe otra categoría con ese nombre.' };
  const categoria = actualizar(COLECCION, id, {
    nombre: datos.nombre.trim(),
    descripcion: (datos.descripcion || '').trim(),
  });
  return categoria ? { ok: true, categoria } : { ok: false, error: 'La categoría no existe.' };
}

/** No se puede eliminar una categoría que todavía tiene productos asociados. */
export function eliminarCategoria(id) {
  const cantidad = contarProductosDeCategoria(id);
  if (cantidad > 0) {
    return { ok: false, error: `No se puede eliminar: tiene ${cantidad} producto(s) asociado(s).` };
  }
  return eliminar(COLECCION, id) ? { ok: true } : { ok: false, error: 'La categoría no existe.' };
}
