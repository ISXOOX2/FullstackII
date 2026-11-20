// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Aquí viven las REGLAS DE NEGOCIO del carrito, en funciones normales (sin React).
// • Son "puras": reciben el carrito y devuelven uno NUEVO, sin modificar el original.
// • Por eso son fáciles de probar con Vitest: entrada -> salida (las usan las pruebas 8 y 12).
// ───────────────────────────────────────────────────────────────────────────
/**
 * Reglas del carrito de compras (reserva).
 *
 * Son funciones "puras": reciben el arreglo actual de items y devuelven uno NUEVO, sin
 * modificar el original. Así React detecta el cambio de estado y es fácil probarlas.
 *
 * Reglas de negocio definidas por el equipo:
 *   1. Los diseños no tienen stock (se pueden tatuar las veces que se quiera); lo que se limita
 *      es la agenda: cada reserva ocupa una hora de un tatuador (ver ordenesService).
 *   2. Máximo 5 unidades de un mismo diseño por reserva.
 *   3. La cantidad mínima de un ítem es 1 (para quitarlo se usa "Eliminar").
 *   4. El carrito se guarda en localStorage para no perderlo al recargar la página.
 *   5. Cada ítem guarda el tamaño que pidió el cliente (ancho y alto en cm). Si no elige uno,
 *      se usa el tamaño original del diseño. Si vuelve a agregar el mismo diseño, queda el último tamaño.
 */
import { precioFinal } from './productosService.js';

export const CLAVE_CARRITO = 'foreverInk_carrito_v2';
export const MAXIMO_POR_ITEM = 5;

/** Cantidad máxima que se puede reservar de un mismo diseño en una reserva. */
export function limiteDeCantidad() {
  return MAXIMO_POR_ITEM;
}

/**
 * Agrega un producto al carrito (o suma una unidad si ya estaba).
 * medidas = { anchoCm, altoCm } que pidió el cliente; si no llega, se usa el tamaño del diseño.
 * Devuelve { items, mensaje }. Si hay mensaje, la regla impidió el cambio.
 */
export function agregarItem(items, producto, cantidad = 1, medidas = null) {
  const tamano = {
    anchoCm: Number(medidas?.anchoCm ?? producto.anchoCm) || null,
    altoCm: Number(medidas?.altoCm ?? producto.altoCm) || null,
  };
  const existente = items.find((i) => i.productoId === producto.id);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  const limite = limiteDeCantidad();

  if (nuevaCantidad > limite) {
    return { items, mensaje: `Solo puedes reservar hasta ${limite} unidad(es) de este diseño.` };
  }
  if (existente) {
    return {
      items: items.map((i) => (i.productoId === producto.id ? { ...i, ...tamano, cantidad: nuevaCantidad } : i)),
      mensaje: '',
    };
  }
  const nuevo = {
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

/** Cambia la cantidad de un ítem respetando el mínimo (1) y el máximo por diseño. */
export function cambiarCantidad(items, productoId, cantidad) {
  return items.map((item) => {
    if (item.productoId !== productoId) return item;
    const limite = limiteDeCantidad();
    const valida = Math.min(Math.max(1, Number(cantidad) || 1), limite);
    return { ...item, cantidad: valida };
  });
}

export function quitarItem(items, productoId) {
  return items.filter((item) => item.productoId !== productoId);
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
