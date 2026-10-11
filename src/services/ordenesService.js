/**
 * Servicio de órdenes (reservas de citas) y agenda.
 * Una orden guarda: datos del cliente, datos de la cita, los diseños elegidos y su estado.
 */
import { listar, obtenerPorId, crear, actualizar } from '../data/db.js';
import { HORAS_CITA } from '../config/estudio.js';

const COLECCION = 'ordenes';

export const ESTADOS = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  RECHAZADA: 'Pago rechazado',
};

export function totalDeItems(items) {
  return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

/** Número visible de la orden: fecha (AAAAMMDD) + correlativo de 2 dígitos. */
export function generarNumeroOrden(fechaISOCompleta, id) {
  return fechaISOCompleta.slice(0, 10).replace(/-/g, '') + String(id).padStart(2, '0');
}

export function listarOrdenes() {
  return listar(COLECCION).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function obtenerOrden(id) {
  return obtenerPorId(COLECCION, id);
}

export function ordenesDeUsuario(usuarioId) {
  return listarOrdenes().filter((o) => o.usuarioId === Number(usuarioId));
}

/** Crea una orden en estado Pendiente (antes de intentar el pago). */
export function crearOrden({ usuarioId = null, cliente, cita, items }, ahora = new Date()) {
  const fecha = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
  const base = crear(COLECCION, {
    usuarioId,
    fecha,
    cliente,
    cita: { ...cita, tatuadorId: Number(cita.tatuadorId) },
    items,
    total: totalDeItems(items),
    estado: ESTADOS.PENDIENTE,
    metodoPago: '',
    numero: '',
    codigo: '',
  });
  // El número y el código dependen del id que asignó la base, por eso se completan después.
  return actualizar(COLECCION, base.id, {
    numero: generarNumeroOrden(fecha, base.id),
    codigo: 'ORDER' + (1000 + base.id),
  });
}

/** Reintento de pago: se actualizan los datos de la misma orden en vez de crear otra. */
export function actualizarDatosOrden(id, { cliente, cita, items }) {
  return actualizar(COLECCION, id, {
    cliente,
    cita: { ...cita, tatuadorId: Number(cita.tatuadorId) },
    items,
    total: totalDeItems(items),
    estado: ESTADOS.PENDIENTE,
  });
}

export function marcarPagada(id, metodoPago = 'Tarjeta (simulado)') {
  return actualizar(COLECCION, id, { estado: ESTADOS.PAGADA, metodoPago });
}

export function marcarRechazada(id) {
  return actualizar(COLECCION, id, { estado: ESTADOS.RECHAZADA });
}

// ---------------------------------------------------------------------------
// Agenda: horarios ocupados y disponibles
// ---------------------------------------------------------------------------

/** Horas ya tomadas por un tatuador en una fecha (solo cuentan las órdenes pagadas). */
export function horasOcupadas(fecha, tatuadorId, ignorarOrdenId = null) {
  return listarOrdenes()
    .filter(
      (o) =>
        o.estado === ESTADOS.PAGADA &&
        o.id !== Number(ignorarOrdenId) &&
        o.cita.fecha === fecha &&
        o.cita.tatuadorId === Number(tatuadorId),
    )
    .map((o) => o.cita.hora);
}

export function horasDisponibles(fecha, tatuadorId, ignorarOrdenId = null) {
  if (!fecha || !tatuadorId) return [...HORAS_CITA];
  const ocupadas = horasOcupadas(fecha, tatuadorId, ignorarOrdenId);
  return HORAS_CITA.filter((hora) => !ocupadas.includes(hora));
}
