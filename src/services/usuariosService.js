/** Servicio de usuarios: CRUD, autenticación e historial de compras. */
import { listar, obtenerPorId, crear, actualizar, eliminar } from '../data/db.js';

const COLECCION = 'usuarios';

export const TIPOS_USUARIO = ['Administrador', 'Vendedor', 'Cliente'];

/** Devuelve el usuario sin la contraseña (para guardarlo en la sesión). */
export function usuarioPublico(usuario) {
  if (!usuario) return null;
  const { password, ...resto } = usuario; // eslint-disable-line no-unused-vars
  return resto;
}

export function listarUsuarios() {
  return listar(COLECCION);
}

export function obtenerUsuario(id) {
  return obtenerPorId(COLECCION, id);
}

/** Inicio de sesión: busca el correo y la contraseña. Devuelve el usuario o null. */
export function autenticar(correo, password) {
  const buscado = String(correo || '').trim().toLowerCase();
  const usuario = listarUsuarios().find(
    (u) => u.correo.toLowerCase() === buscado && u.password === password,
  );
  return usuario ? usuarioPublico(usuario) : null;
}

/** Busca un usuario local por su correo (sin importar mayúsculas). */
export function buscarUsuarioPorCorreo(correo) {
  const buscado = String(correo || '').trim().toLowerCase();
  return listarUsuarios().find((u) => u.correo.toLowerCase() === buscado) || null;
}

/**
 * Datos que se envían a usuario-service al registrarse (POST /api/usuarios).
 * Se quitan los campos de confirmación y una fecha vacía se envía como null.
 */
export function datosParaRegistroRemoto(datos) {
  return {
    run: String(datos.run).trim().toUpperCase(),
    nombre: String(datos.nombre).trim(),
    apellidos: String(datos.apellidos).trim(),
    correo: String(datos.correo).trim().toLowerCase(),
    password: datos.password,
    telefono: String(datos.telefono || '').trim(),
    fechaNacimiento: datos.fechaNacimiento || null,
    region: datos.region,
    comuna: datos.comuna,
    direccion: String(datos.direccion).trim(),
  };
}

/** Deja solo los campos que se guardan (quita confirmarCorreo, confirmarPassword, etc.). */
function limpiarDatos(datos) {
  return {
    run: String(datos.run).trim().toUpperCase(),
    nombre: String(datos.nombre).trim(),
    apellidos: String(datos.apellidos).trim(),
    correo: String(datos.correo).trim().toLowerCase(),
    password: datos.password,
    telefono: String(datos.telefono || '').trim(),
    fechaNacimiento: datos.fechaNacimiento || '',
    tipo: TIPOS_USUARIO.includes(datos.tipo) ? datos.tipo : 'Cliente',
    region: datos.region,
    comuna: datos.comuna,
    direccion: String(datos.direccion).trim(),
  };
}

function duplicado(datos, idActual = null) {
  const otros = listarUsuarios().filter((u) => u.id !== Number(idActual));
  if (otros.some((u) => u.correo.toLowerCase() === datos.correo)) return 'Ya existe un usuario con ese correo.';
  if (otros.some((u) => u.run.toUpperCase() === datos.run)) return 'Ya existe un usuario con ese RUN.';
  return '';
}

export function crearUsuario(datos) {
  const limpio = limpiarDatos(datos);
  const error = duplicado(limpio);
  if (error) return { ok: false, error };
  return { ok: true, usuario: crear(COLECCION, limpio) };
}

/** Registro desde la tienda: siempre crea un usuario de tipo Cliente. */
export function registrarCliente(datos) {
  return crearUsuario({ ...datos, tipo: 'Cliente' });
}

/** Si la contraseña viene vacía se conserva la que ya tenía el usuario. */
export function actualizarUsuario(id, datos) {
  const existente = obtenerUsuario(id);
  if (!existente) return { ok: false, error: 'El usuario no existe.' };
  const limpio = limpiarDatos({ ...datos, password: datos.password || existente.password });
  const error = duplicado(limpio, id);
  if (error) return { ok: false, error };
  return { ok: true, usuario: actualizar(COLECCION, id, limpio) };
}

/** No se puede eliminar a uno mismo ni al último administrador. */
export function eliminarUsuario(id, idUsuarioActual = null) {
  if (Number(id) === Number(idUsuarioActual)) {
    return { ok: false, error: 'No puedes eliminar tu propia cuenta.' };
  }
  const usuario = obtenerUsuario(id);
  if (!usuario) return { ok: false, error: 'El usuario no existe.' };
  const administradores = listarUsuarios().filter((u) => u.tipo === 'Administrador');
  if (usuario.tipo === 'Administrador' && administradores.length <= 1) {
    return { ok: false, error: 'Debe existir al menos un administrador.' };
  }
  eliminar(COLECCION, id);
  return { ok: true };
}

/** Historial de compras: órdenes del usuario (más recientes primero). */
export function historialDeCompras(usuarioId) {
  return listar('ordenes')
    .filter((o) => o.usuarioId === Number(usuarioId))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}
