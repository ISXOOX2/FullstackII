// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Aquí viven las REGLAS DE NEGOCIO del carrito, en funciones normales (sin React).
// • Son "puras": reciben el carrito y devuelven uno NUEVO, sin modificar el original.
// • Por eso son fáciles de probar con Jasmine: entrada -> salida (prueba 2 de la defensa).
// ───────────────────────────────────────────────────────────────────────────
/**
 * Reglas del carrito de compras (reserva).
 *
 * Son funciones "puras": reciben el arreglo actual de items y devuelven uno NUEVO, sin
 * modificar el original. Así React detecta el cambio de estado y es fácil probarlas.
 *
 * Reglas de negocio definidas por el equipo:
 *   1. No se pueden reservar más unidades que los cupos (stock) disponibles del diseño.
 *   2. Máximo 5 unidades de un mismo diseño por reserva.
 *   3. La cantidad mínima de un ítem es 1 (para quitarlo se usa "Eliminar").
 *   4. El carrito se guarda en localStorage para no perderlo al recargar la página.
 */
import { precioFinal } from './productosService.js';

export const CLAVE_CARRITO = 'trazoFino_carrito';
export const MAXIMO_POR_ITEM = 5;

/** Cantidad máxima que se puede reservar de un producto. */
export function limiteDeCantidad(stock) {
  return Math.min(Number(stock), MAXIMO_POR_ITEM);
}

/**
 * Agrega un producto al carrito (o suma una unidad si ya estaba).
 * Devuelve { items, mensaje }. Si hay mensaje, la regla impidió el cambio.
 */
export function agregarItem(items, producto, cantidad = 1) {
  if (producto.stock <= 0) {
    return { items, mensaje: 'Este diseño no tiene cupos disponibles.' };
  }
  const existente = items.find((i) => i.productoId === producto.id);
  const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;
  const limite = limiteDeCantidad(producto.stock);

  if (nuevaCantidad > limite) {
    return { items, mensaje: `Solo puedes reservar hasta ${limite} unidad(es) de este diseño.` };
  }
  if (existente) {
    return {
      items: items.map((i) => (i.productoId === producto.id ? { ...i, cantidad: nuevaCantidad } : i)),
      mensaje: '',
    };
  }
  const nuevo = {
    productoId: producto.id,
    nombre: producto.nombre,
    imagen: producto.imagen,
    categoriaId: producto.categoriaId,
    precio: precioFinal(producto),
    stock: producto.stock,
    cantidad,
  };
  return { items: [...items, nuevo], mensaje: '' };
}

/** Cambia la cantidad de un ítem respetando el mínimo (1) y el límite por cupos. */
export function cambiarCantidad(items, productoId, cantidad) {
  return items.map((item) => {
    if (item.productoId !== productoId) return item;
    const limite = limiteDeCantidad(item.stock);
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
