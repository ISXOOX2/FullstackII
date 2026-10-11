/** Reportes del panel de administración (todo se calcula con las órdenes pagadas). */
import { listarOrdenes, ESTADOS } from './ordenesService.js';
import { listarProductos, productosCriticos } from './productosService.js';
import { listarUsuarios } from './usuariosService.js';
import { listarCategorias } from './categoriasService.js';

function ordenesPagadas() {
  return listarOrdenes().filter((o) => o.estado === ESTADOS.PAGADA);
}

/** Cifras para las tarjetas del dashboard. */
export function resumenGeneral() {
  const pagadas = ordenesPagadas();
  const ingresos = pagadas.reduce((suma, o) => suma + o.total, 0);
  return {
    ordenesPagadas: pagadas.length,
    ordenesTotales: listarOrdenes().length,
    ingresos,
    ticketPromedio: pagadas.length ? Math.round(ingresos / pagadas.length) : 0,
    productos: listarProductos().length,
    productosCriticos: productosCriticos().length,
    usuarios: listarUsuarios().length,
    clientes: listarUsuarios().filter((u) => u.tipo === 'Cliente').length,
  };
}

/** Ingresos y unidades por categoría (estilo de tatuaje). */
export function ventasPorCategoria() {
  const filas = listarCategorias().map((c) => ({ categoriaId: c.id, categoria: c.nombre, unidades: 0, monto: 0 }));
  ordenesPagadas().forEach((orden) => {
    orden.items.forEach((item) => {
      const fila = filas.find((f) => f.categoriaId === item.categoriaId);
      if (fila) {
        fila.unidades += item.cantidad;
        fila.monto += item.precio * item.cantidad;
      }
    });
  });
  return filas;
}

/** Diseños más reservados (ordenados por unidades). */
export function productosMasReservados(cantidad = 5) {
  const mapa = {};
  ordenesPagadas().forEach((orden) => {
    orden.items.forEach((item) => {
      if (!mapa[item.productoId]) mapa[item.productoId] = { nombre: item.nombre, unidades: 0, monto: 0 };
      mapa[item.productoId].unidades += item.cantidad;
      mapa[item.productoId].monto += item.precio * item.cantidad;
    });
  });
  return Object.values(mapa)
    .sort((a, b) => b.unidades - a.unidades || b.monto - a.monto)
    .slice(0, cantidad);
}

/** Cantidad de órdenes según su estado. */
export function ordenesPorEstado() {
  const conteo = { [ESTADOS.PAGADA]: 0, [ESTADOS.RECHAZADA]: 0, [ESTADOS.PENDIENTE]: 0 };
  listarOrdenes().forEach((o) => {
    conteo[o.estado] = (conteo[o.estado] || 0) + 1;
  });
  return conteo;
}

/** Ingresos por mes ("2026-09"), ordenados cronológicamente. */
export function ventasPorMes() {
  const mapa = {};
  ordenesPagadas().forEach((o) => {
    const mes = o.fecha.slice(0, 7);
    if (!mapa[mes]) mapa[mes] = { mes, ordenes: 0, monto: 0 };
    mapa[mes].ordenes += 1;
    mapa[mes].monto += o.total;
  });
  return Object.values(mapa).sort((a, b) => a.mes.localeCompare(b.mes));
}
