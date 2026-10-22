/**
 * "Base de datos" simulada del proyecto (requisito de la Evaluación 2).
 *
 * No existe backend: los datos viven en un archivo JavaScript (seed.js) y se copian al
 * localStorage del navegador para que los cambios se mantengan al recargar la página.
 *
 * Este archivo ofrece las 4 operaciones CRUD de forma genérica para cualquier colección:
 *    crear(coleccion, datos)           -> Create
 *    listar(coleccion)                 -> Read (todos)
 *    obtenerPorId(coleccion, id)       -> Read (uno)
 *    actualizar(coleccion, id, cambios)-> Update
 *    eliminar(coleccion, id)           -> Delete
 *
 * Los "servicios" (productosService, usuariosService, etc.) usan estas funciones y agregan
 * las reglas de negocio de cada módulo.
 */
import { SEMILLA } from './seed.js';

// Si algún día cambia la estructura de los datos, basta con subir el número de versión.
// v2: las imágenes se guardan como la key de src/assets/images.js (antes era una ruta de /public).
// v3: catálogo nuevo (Kawaii, Anime, Tribal Y2K, Celestial y Cybersigilism, 5 diseños cada uno).
// v4: precios según tamaño (máximo 20 cm) y sin tatuador asignado por diseño.
export const CLAVE_BD = 'foreverInk_bd_v4';

function clonar(objeto) {
  return JSON.parse(JSON.stringify(objeto));
}

function leerAlmacenamiento() {
  try {
    const texto = localStorage.getItem(CLAVE_BD);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null; // JSON dañado o localStorage bloqueado
  }
}

function escribirAlmacenamiento(bd) {
  try {
    localStorage.setItem(CLAVE_BD, JSON.stringify(bd));
  } catch {
    // Sin espacio o navegación privada: la app sigue funcionando sin persistir.
  }
}

/** Lee toda la base. Si es la primera vez, la crea a partir de la semilla. */
function leerBD() {
  const guardada = leerAlmacenamiento();
  if (guardada) return guardada;
  const nueva = clonar(SEMILLA);
  escribirAlmacenamiento(nueva);
  return nueva;
}

// ---------------------------------------------------------------------------
// CRUD genérico
// ---------------------------------------------------------------------------

/** READ: devuelve todos los registros de una colección. */
export function listar(coleccion) {
  const bd = leerBD();
  return bd[coleccion] ? clonar(bd[coleccion]) : [];
}

/** READ: devuelve un registro por su id (o null si no existe). */
export function obtenerPorId(coleccion, id) {
  const encontrado = listar(coleccion).find((item) => item.id === Number(id));
  return encontrado || null;
}

/** CREATE: agrega un registro nuevo y le asigna el siguiente id disponible. */
export function crear(coleccion, datos) {
  const bd = leerBD();
  if (!bd[coleccion]) bd[coleccion] = [];
  const idNuevo = bd[coleccion].reduce((mayor, item) => Math.max(mayor, item.id), 0) + 1;
  const registro = { ...clonar(datos), id: idNuevo };
  bd[coleccion].push(registro);
  escribirAlmacenamiento(bd);
  return clonar(registro);
}

/** UPDATE: modifica los campos indicados de un registro. Devuelve el registro o null. */
export function actualizar(coleccion, id, cambios) {
  const bd = leerBD();
  const lista = bd[coleccion] || [];
  const posicion = lista.findIndex((item) => item.id === Number(id));
  if (posicion === -1) return null;
  lista[posicion] = { ...lista[posicion], ...clonar(cambios), id: lista[posicion].id };
  escribirAlmacenamiento(bd);
  return clonar(lista[posicion]);
}

/** DELETE: elimina un registro. Devuelve true si existía. */
export function eliminar(coleccion, id) {
  const bd = leerBD();
  const lista = bd[coleccion] || [];
  const restantes = lista.filter((item) => item.id !== Number(id));
  if (restantes.length === lista.length) return false;
  bd[coleccion] = restantes;
  escribirAlmacenamiento(bd);
  return true;
}

/** Vuelve a dejar la base tal como viene en seed.js (útil para demostraciones y pruebas). */
export function reiniciarBD() {
  escribirAlmacenamiento(clonar(SEMILLA));
}

/** Borra la base del navegador; en el próximo acceso se vuelve a sembrar. */
export function borrarBD() {
  try {
    localStorage.removeItem(CLAVE_BD);
  } catch {
    /* nada que hacer */
  }
}
