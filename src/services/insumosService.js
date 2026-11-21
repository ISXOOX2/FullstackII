// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Los INSUMOS (tintas, agujas, guantes…) son lo que realmente se acaba en un estudio de tatuajes.
//   Los diseños no tienen stock: un mismo diseño se puede tatuar infinitas veces.
// • Regla de stock crítico: se alerta cuando el stock es IGUAL O INFERIOR al stock crítico.
// • Algunos insumos se VENDEN en la Tienda (aLaVenta = true): cuidado del tatuaje y gift cards.
//   Al pagar una compra se descuenta su stock; nunca se vende más de lo que hay en bodega.
// • Usa el CRUD genérico de db.js, igual que los demás servicios.
// ───────────────────────────────────────────────────────────────────────────
import { listar, obtenerPorId, crear, actualizar, eliminar } from '../data/db.js';

const COLECCION = 'insumos';
export const PREFIJO_CODIGO_INSUMO = 'IN-';
export const TIPOS_INSUMO = ['Tinta', 'Agujas', 'Higiene', 'Cuidado posterior', 'Gift card', 'Otro'];
// Imágenes disponibles para los artículos de la Tienda (keys de src/assets/images.js).
export const IMAGENES_TIENDA = [
  'tienda-crema', 'tienda-jabon', 'tienda-film', 'tienda-balsamo', 'tienda-protector', 'tienda-kit', 'tienda-giftcard',
];

export function listarInsumos() {
  return listar(COLECCION).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

export function obtenerInsumo(id) {
  return obtenerPorId(COLECCION, id);
}

/** Regla de stock crítico: stock igual o menor al nivel crítico. */
export function esInsumoCritico(insumo) {
  return Number(insumo.stock) <= Number(insumo.stockCritico);
}

export function insumosCriticos() {
  return listarInsumos().filter(esInsumoCritico);
}

/** Código del próximo insumo (IN-009 si el último es IN-008). */
export function siguienteCodigoInsumo() {
  const mayor = listarInsumos().reduce((max, i) => {
    const numero = Number(String(i.codigo).replace(PREFIJO_CODIGO_INSUMO, ''));
    return Number.isInteger(numero) ? Math.max(max, numero) : max;
  }, 0);
  return PREFIJO_CODIGO_INSUMO + String(mayor + 1).padStart(3, '0');
}

/** Convierte lo que viene del formulario (texto) a los tipos correctos. */
function normalizarInsumo(datos) {
  return {
    nombre: String(datos.nombre).trim(),
    tipo: String(datos.tipo).trim(),
    unidad: String(datos.unidad).trim(),
    stock: Number(datos.stock),
    stockCritico: Number(datos.stockCritico),
    aLaVenta: datos.aLaVenta === true || datos.aLaVenta === 'true',
    precio: Number(datos.precio) || 0,
    descripcion: String(datos.descripcion ?? '').trim(),
    imagen: String(datos.imagen ?? ''),
  };
}

export function crearInsumo(datos) {
  return crear(COLECCION, { ...normalizarInsumo(datos), codigo: siguienteCodigoInsumo() });
}

/** Actualiza un insumo (el código no cambia). */
export function actualizarInsumo(id, datos) {
  return actualizar(COLECCION, id, normalizarInsumo(datos));
}

export function eliminarInsumo(id) {
  return eliminar(COLECCION, id);
}

// ---------------------------------------------------------------------------
// Tienda: insumos que se venden a los clientes
// ---------------------------------------------------------------------------

/** Artículos a la venta (opcionalmente de un tipo: 'Cuidado posterior' o 'Gift card'). */
export function listarArticulosEnVenta(tipo = '') {
  return listarInsumos().filter((i) => i.aLaVenta && (!tipo || i.tipo === tipo));
}

export function estaAgotado(insumo) {
  return Number(insumo.stock) <= 0;
}

/**
 * Revisa que haya stock para todos los artículos del carrito.
 * Devuelve '' si alcanza, o el mensaje del primer artículo que no alcanza.
 */
export function revisarStockArticulos(items) {
  for (const item of items.filter((i) => i.tipo === 'articulo')) {
    const insumo = obtenerInsumo(item.articuloId);
    if (!insumo || !insumo.aLaVenta) return `«${item.nombre}» ya no está a la venta. Quítalo del carrito.`;
    if (item.cantidad > insumo.stock) {
      return insumo.stock > 0
        ? `Solo quedan ${insumo.stock} de «${item.nombre}». Ajusta la cantidad.`
        : `«${item.nombre}» se agotó. Quítalo del carrito.`;
    }
  }
  return '';
}

/** Devuelve al stock lo que se reembolsó (el cliente devolvió el producto sin abrir). */
export function reponerStockArticulos(items) {
  items.filter((i) => i.tipo === 'articulo').forEach((item) => {
    const insumo = obtenerInsumo(item.articuloId);
    if (insumo) actualizar(COLECCION, insumo.id, { stock: insumo.stock + item.cantidad });
  });
}

/** Descuenta del stock lo que se vendió (se llama cuando el pago fue aprobado). */
export function descontarStockArticulos(items) {
  items.filter((i) => i.tipo === 'articulo').forEach((item) => {
    const insumo = obtenerInsumo(item.articuloId);
    if (insumo) actualizar(COLECCION, insumo.id, { stock: Math.max(0, insumo.stock - item.cantidad) });
  });
}
