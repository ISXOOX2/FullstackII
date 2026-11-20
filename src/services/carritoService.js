// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Aquí viven las REGLAS DE NEGOCIO del carrito, en funciones normales (sin React).
// • Son "puras": reciben el carrito y devuelven uno NUEVO, sin modificar el original.
// • Por eso son fáciles de probar con Vitest: entrada -> salida (las usan las pruebas 8 y 12).
// ───────────────────────────────────────────────────────────────────────────
/**
 * Reglas del carrito: en el mismo carrito conviven dos tipos de ítem.
 *   • tipo 'diseno'   -> una RESERVA: el diseño elegido para tatuarse (no tiene stock; lo que se
 *                        limita es la agenda, cada reserva ocupa una hora de un tatuador).
 *   • tipo 'articulo' -> un artículo de la TIENDA (cuidado del tatuaje o gift card), que sí tiene stock.
 * Cada ítem tiene una "clave" única ('d-3' para el diseño 3, 'a-9' para el artículo 9), porque un
 * diseño y un artículo pueden tener el mismo id.
 *
 * Son funciones "puras": reciben el arreglo actual de items y devuelven uno NUEVO, sin
 * modificar el original. Así React detecta el cambio de estado y es fácil probarlas.
 *
 * Reglas de negocio definidas por el equipo:
 *   1. Máximo 5 unidades de un mismo diseño por reserva.
 *   2. De un artículo no se puede llevar más de lo que hay en stock (máximo 10).
 *   3. La cantidad mínima de un ítem es 1 (para quitarlo se usa "Eliminar").
 *   4. El carrito se guarda en localStorage para no perderlo al recargar la página.
 *   5. Cada diseño guarda el tamaño que pidió el cliente (ancho y alto en cm). Si no elige uno,
 *      se usa el tamaño original del diseño. Si vuelve a agregar el mismo diseño, queda el último tamaño.
 *   6. Si hay al menos un diseño, al pagar se pide la cita (tatuador, fecha y hora). Si solo hay
 *      artículos, es una compra normal que se retira en el estudio.
 */
import { precioFinal, textoTamano } from './productosService.js';

export const CLAVE_CARRITO = 'foreverInk_carrito_v3';
export const MAXIMO_POR_ITEM = 5;
export const MAXIMO_POR_ARTICULO = 10;

/** Clave del ítem; los carritos antiguos (sin clave ni tipo) solo tenían diseños. */
export const claveDe = (item) => item.clave ?? `d-${item.productoId}`;
export const esDiseno = (item) => (item.tipo ?? 'diseno') === 'diseno';

/**
 * Cantidad máxima de un ítem. Sin argumento (o con un diseño) es el máximo por reserva;
 * con un artículo, lo que quede en stock (nunca más de 10).
 */
export function limiteDeCantidad(item = null) {
  if (item && !esDiseno(item)) return Math.max(0, Math.min(MAXIMO_POR_ARTICULO, Number(item.stock) || 0));
  return MAXIMO_POR_ITEM;
}

/** Texto corto bajo el nombre: el tamaño de un diseño o el tipo de artículo. */
export function detalleItem(item) {
  return esDiseno(item) ? `Tamaño: ${textoTamano(item)}` : 'Artículo de la tienda';
}

/** true si el carrito tiene al menos un diseño (entonces hay que agendar una cita). */
export function tieneReservas(items) {
  return items.some(esDiseno);
}

/**
 * Agrega un diseño al carrito (o suma una unidad si ya estaba).
 * medidas = { anchoCm, altoCm } que pidió el cliente; si no llega, se usa el tamaño del diseño.
 * Devuelve { items, mensaje }. Si hay mensaje, la regla impidió el cambio.
 */
export function agregarItem(items, producto, cantidad = 1, medidas = null) {
  const clave = `d-${producto.id}`;
  const tamano = {
    anchoCm: Number(medidas?.anchoCm ?? producto.anchoCm) || null,
    altoCm: Number(medidas?.altoCm ?? producto.altoCm) || null,
  };
  const existente = items.find((i) => claveDe(i) === clave);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  const limite = limiteDeCantidad();

  if (nuevaCantidad > limite) {
    return { items, mensaje: `Solo puedes reservar hasta ${limite} unidad(es) de este diseño.` };
  }
  if (existente) {
    return {
      items: items.map((i) => (claveDe(i) === clave ? { ...i, ...tamano, cantidad: nuevaCantidad } : i)),
      mensaje: '',
    };
  }
  const nuevo = {
    clave,
    tipo: 'diseno',
    productoId: producto.id,
    nombre: producto.nombre,
    imagen: producto.imagen,
    categoriaId: producto.categoriaId,
    precio: precioFinal(producto),
    ...tamano,
    cantidad,
  };
  return { items: [...items, nuevo], mensaje: '' };
}

/** Agrega un artículo de la Tienda respetando su stock. Devuelve { items, mensaje }. */
export function agregarArticulo(items, articulo, cantidad = 1) {
  const clave = `a-${articulo.id}`;
  const existente = items.find((i) => claveDe(i) === clave);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  const limite = limiteDeCantidad({ tipo: 'articulo', stock: articulo.stock });

  if (limite === 0) return { items, mensaje: `«${articulo.nombre}» está agotado.` };
  if (nuevaCantidad > limite) {
    return { items, mensaje: `Solo puedes llevar hasta ${limite} unidad(es) de «${articulo.nombre}».` };
  }
  if (existente) {
    return { items: items.map((i) => (claveDe(i) === clave ? { ...i, cantidad: nuevaCantidad, stock: articulo.stock } : i)), mensaje: '' };
  }
  const nuevo = {
    clave,
    tipo: 'articulo',
    articuloId: articulo.id,
    nombre: articulo.nombre,
    imagen: articulo.imagen,
    precio: articulo.precio,
    stock: articulo.stock,
    cantidad,
  };
  return { items: [...items, nuevo], mensaje: '' };
}

/** Cambia la cantidad de un ítem respetando el mínimo (1) y el máximo de su tipo. */
export function cambiarCantidad(items, clave, cantidad) {
  return items.map((item) => {
    if (claveDe(item) !== clave) return item;
    const limite = Math.max(1, limiteDeCantidad(item));
    const valida = Math.min(Math.max(1, Number(cantidad) || 1), limite);
    return { ...item, cantidad: valida };
  });
}

export function quitarItem(items, clave) {
  return items.filter((item) => claveDe(item) !== clave);
}

export function vaciarCarrito() {
  return [];
}

export function totalCarrito(items) {
  return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

export function cantidadTotal(items) {
  return items.reduce((suma, item) => suma + item.cantidad, 0);
}

// ---------------------------------------------------------------------------
// Persistencia en localStorage
// ---------------------------------------------------------------------------
export function leerCarrito() {
  try {
    const texto = localStorage.getItem(CLAVE_CARRITO);
    const datos = texto ? JSON.parse(texto) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  } catch {
    /* sin almacenamiento disponible */
  }
}
