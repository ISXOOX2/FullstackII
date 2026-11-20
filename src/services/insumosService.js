// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Los INSUMOS (tintas, agujas, guantes…) son lo que realmente se acaba en un estudio de tatuajes.
//   Los diseños no tienen stock: un mismo diseño se puede tatuar infinitas veces.
// • Regla de stock crítico: se alerta cuando el stock es IGUAL O INFERIOR al stock crítico.
// • Usa el CRUD genérico de db.js, igual que los demás servicios.
// ───────────────────────────────────────────────────────────────────────────
import { listar, obtenerPorId, crear, actualizar, eliminar } from '../data/db.js';

const COLECCION = 'insumos';
export const PREFIJO_CODIGO_INSUMO = 'IN-';
export const TIPOS_INSUMO = ['Tinta', 'Agujas', 'Higiene', 'Cuidado posterior', 'Otro'];

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
