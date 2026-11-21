/**
 * Servicio de órdenes (reservas de citas) y agenda.
 * Una orden guarda: datos del cliente, datos de la cita, los diseños elegidos y su estado.
 */
import { listar, obtenerPorId, crear, actualizar } from '../data/db.js';
import {
  DIAS_ALERTA_AGENDA, DIAS_ATENCION, HORAS_ANTICIPACION_CAMBIO, HORAS_ANTICIPACION_REEMBOLSO, HORAS_CITA,
  HORAS_LIBRES_CRITICAS,
  DIAS_RETRACTO_TIENDA,
} from '../data/estudio.js';
import { TATUADORES } from '../data/tatuadores.js';
import { reponerStockArticulos } from './insumosService.js';
import { fechaISO, sumarDias } from '../utils/formato.js';
import { validarCambioEstado, validarFormularioSolicitud } from '../utils/validaciones.js';

const COLECCION = 'ordenes';

export const ESTADOS = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  RECHAZADA: 'Pago rechazado',
  REEMBOLSADA: 'Reembolsada',
};

// Solicitudes que el cliente puede hacer sobre una reserva pagada.
export const TIPOS_SOLICITUD = { REEMBOLSO: 'reembolso', CAMBIO: 'cambio' };
export const NOMBRE_SOLICITUD = { reembolso: 'Reembolso', cambio: 'Cambio de fecha y hora' };
export const ESTADOS_SOLICITUD = { PENDIENTE: 'Pendiente', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada' };

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
    cita: cita ? { ...cita, tatuadorId: Number(cita.tatuadorId) } : null, // null = solo artículos
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
    cita: cita ? { ...cita, tatuadorId: Number(cita.tatuadorId) } : null,
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
        o.cita &&
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

/** Los próximos N días de atención (martes a sábado) desde mañana, en formato AAAA-MM-DD. */
export function proximosDiasDeAtencion(cantidad = DIAS_ALERTA_AGENDA, ahora = new Date()) {
  const dias = [];
  let fecha = sumarDias(fechaISO(ahora), 1);
  while (dias.length < cantidad) {
    if (DIAS_ATENCION.includes(new Date(fecha + 'T00:00:00').getDay())) dias.push(fecha);
    fecha = sumarDias(fecha, 1);
  }
  return dias;
}

/** Horas libres que le quedan a un tatuador en los próximos días de atención. */
export function horasLibresProximas(tatuadorId, ahora = new Date()) {
  return proximosDiasDeAtencion(DIAS_ALERTA_AGENDA, ahora)
    .reduce((suma, fecha) => suma + horasDisponibles(fecha, tatuadorId).length, 0);
}

/**
 * Resumen de agenda por tatuador para la alerta de "pocas horas disponibles".
 * Lo que se agota en el estudio son las HORAS de cada tatuador, no los diseños.
 */
export function agendaPorTatuador(ahora = new Date()) {
  const total = DIAS_ALERTA_AGENDA * HORAS_CITA.length;
  return TATUADORES.map((t) => {
    const libres = horasLibresProximas(t.id, ahora);
    return { tatuadorId: t.id, nombre: t.nombre, libres, total, pocas: libres <= HORAS_LIBRES_CRITICAS };
  });
}

// ---------------------------------------------------------------------------
// Solicitudes del cliente sobre una reserva pagada: reembolso o cambio de fecha y hora
// ---------------------------------------------------------------------------
// Reglas de negocio:
//   1. Solo se puede pedir sobre una reserva PAGADA y que no tenga otra solicitud pendiente.
//   2. Reembolso: hasta HORAS_ANTICIPACION_REEMBOLSO (48) horas antes de la cita.
//   3. Cambio de fecha y hora: hasta HORAS_ANTICIPACION_CAMBIO (24) horas antes, y la nueva
//      hora tiene que estar libre para el mismo tatuador.
//   4. Siempre con motivo y justificativo. El administrador aprueba o rechaza.
//   5. Reembolso aprobado: la orden pasa a "Reembolsada" y la hora queda libre para otros.
//      Cambio aprobado: la cita se mueve a la nueva fecha y hora.

/** Fecha y hora de la cita como objeto Date (hora local del estudio). */
export function fechaHoraCita(orden) {
  return new Date(`${orden.cita.fecha}T${orden.cita.hora}:00`);
}

/** Horas que faltan para la cita (negativo si ya pasó). */
export function horasHastaCita(orden, ahora = new Date()) {
  return (fechaHoraCita(orden).getTime() - ahora.getTime()) / 3600000;
}

export function tieneSolicitudPendiente(orden) {
  return orden?.solicitud?.estado === ESTADOS_SOLICITUD.PENDIENTE;
}

/** '' si el cliente puede hacer esa solicitud; si no, el motivo por el que no puede. */
export function puedeSolicitar(orden, tipo, ahora = new Date()) {
  if (!orden) return 'La reserva no existe.';
  if (!orden.cita) return puedeReembolsarCompraTienda(orden, tipo, ahora);
  if (orden.estado !== ESTADOS.PAGADA) return 'Solo se pueden modificar reservas pagadas.';
  if (tieneSolicitudPendiente(orden)) return 'Esta reserva ya tiene una solicitud en revisión.';
  const horas = horasHastaCita(orden, ahora);
  if (horas <= 0) return 'La cita ya pasó.';
  const minimo = tipo === TIPOS_SOLICITUD.REEMBOLSO ? HORAS_ANTICIPACION_REEMBOLSO : HORAS_ANTICIPACION_CAMBIO;
  if (horas < minimo) {
    return tipo === TIPOS_SOLICITUD.REEMBOLSO
      ? `El reembolso se puede pedir hasta ${minimo} horas antes de la cita.`
      : `El cambio de fecha se puede pedir hasta ${minimo} horas antes de la cita.`;
  }
  return '';
}

/** Días que pasaron desde que se hizo la orden. */
export function diasDesdeCompra(orden, ahora = new Date()) {
  return (ahora.getTime() - new Date(orden.fecha).getTime()) / 86400000;
}

/**
 * Compra solo de la tienda (sin cita): no hay hora que cambiar, pero el cliente se puede
 * arrepentir y pedir el reembolso hasta DIAS_RETRACTO_TIENDA días después de comprar.
 */
function puedeReembolsarCompraTienda(orden, tipo, ahora) {
  if (tipo === TIPOS_SOLICITUD.CAMBIO) return 'Una compra de la tienda no tiene cita que cambiar.';
  if (orden.estado !== ESTADOS.PAGADA) return 'Solo se pueden reembolsar compras pagadas.';
  if (tieneSolicitudPendiente(orden)) return 'Esta compra ya tiene una solicitud en revisión.';
  if (diasDesdeCompra(orden, ahora) > DIAS_RETRACTO_TIENDA) {
    return `El reembolso de productos se puede pedir hasta ${DIAS_RETRACTO_TIENDA} días después de la compra.`;
  }
  return '';
}

/**
 * El cliente envía una solicitud. datos = { tipo, motivo, justificativo, fecha?, hora? }.
 * Devuelve { ok, error, orden }.
 */
export function crearSolicitud(ordenId, datos, ahora = new Date()) {
  const orden = obtenerOrden(ordenId);
  const noPuede = puedeSolicitar(orden, datos.tipo, ahora);
  if (noPuede) return { ok: false, error: noPuede };

  const errores = validarFormularioSolicitud(datos, ahora);
  if (Object.keys(errores).length > 0) return { ok: false, error: Object.values(errores)[0] };

  const esCambio = datos.tipo === TIPOS_SOLICITUD.CAMBIO;
  if (esCambio) {
    if (datos.fecha === orden.cita.fecha && datos.hora === orden.cita.hora) {
      return { ok: false, error: 'Elige una fecha u hora distinta a la actual.' };
    }
    if (!horasDisponibles(datos.fecha, orden.cita.tatuadorId, orden.id).includes(datos.hora)) {
      return { ok: false, error: 'Esa hora ya está ocupada para tu tatuador/a. Elige otra.' };
    }
  }

  const solicitud = {
    tipo: datos.tipo,
    motivo: datos.motivo,
    justificativo: String(datos.justificativo).trim(),
    nuevaFecha: esCambio ? datos.fecha : null,
    nuevaHora: esCambio ? datos.hora : null,
    estado: ESTADOS_SOLICITUD.PENDIENTE,
    fechaSolicitud: ahora.toISOString(),
    respuesta: '',
  };
  return { ok: true, error: '', orden: actualizar(COLECCION, orden.id, { solicitud }) };
}

/** Órdenes con una solicitud esperando respuesta (para el panel del administrador). */
export function ordenesConSolicitudPendiente() {
  return listarOrdenes().filter(tieneSolicitudPendiente);
}

/**
 * El administrador responde la solicitud. aprobar = true o false; respuesta = comentario opcional.
 * Devuelve { ok, error, orden }.
 */
export function responderSolicitud(ordenId, aprobar, respuesta = '', ahora = new Date()) {
  const orden = obtenerOrden(ordenId);
  if (!tieneSolicitudPendiente(orden)) return { ok: false, error: 'No hay una solicitud pendiente.' };
  const { solicitud } = orden;
  const respondida = {
    ...solicitud,
    estado: aprobar ? ESTADOS_SOLICITUD.APROBADA : ESTADOS_SOLICITUD.RECHAZADA,
    respuesta: String(respuesta).trim(),
    fechaRespuesta: ahora.toISOString(),
  };

  if (!aprobar) return { ok: true, error: '', orden: actualizar(COLECCION, orden.id, { solicitud: respondida }) };

  if (solicitud.tipo === TIPOS_SOLICITUD.REEMBOLSO) {
    reponerStockArticulos(orden.items); // los productos de la tienda vuelven a bodega
    return {
      ok: true, error: '',
      orden: actualizar(COLECCION, orden.id, { estado: ESTADOS.REEMBOLSADA, solicitud: respondida }),
    };
  }
  // Cambio: se revisa otra vez que la hora siga libre (alguien pudo tomarla mientras tanto).
  if (!horasDisponibles(solicitud.nuevaFecha, orden.cita.tatuadorId, orden.id).includes(solicitud.nuevaHora)) {
    return { ok: false, error: 'La nueva hora ya fue tomada por otra reserva. Recházala o pide otra hora al cliente.' };
  }
  const cita = {
    ...orden.cita,
    fechaAnterior: orden.cita.fecha,
    horaAnterior: orden.cita.hora,
    fecha: solicitud.nuevaFecha,
    hora: solicitud.nuevaHora,
  };
  return { ok: true, error: '', orden: actualizar(COLECCION, orden.id, { cita, solicitud: respondida }) };
}

// ---------------------------------------------------------------------------
// Cambio manual del estado de una orden (solo el administrador)
// ---------------------------------------------------------------------------
// Reglas de negocio:
//   1. Solo se permiten los cambios de la tabla TRANSICIONES (por ejemplo, una orden reembolsada
//      ya no puede volver a pagada porque el dinero se devolvió).
//   2. Siempre con un motivo (10 a 300 caracteres) y queda en el historial: quién, cuándo y por qué.
//   3. Si la orden tiene una solicitud del cliente pendiente, primero hay que responderla.
//   4. Pasar a "Pagada" ocupa la hora en la agenda: solo se permite si esa hora sigue libre.
//      Pasar a "Pago rechazado" o "Reembolsada" libera la hora para otros clientes.

export const TRANSICIONES = {
  [ESTADOS.PENDIENTE]: [ESTADOS.PAGADA, ESTADOS.RECHAZADA],
  [ESTADOS.PAGADA]: [ESTADOS.RECHAZADA, ESTADOS.REEMBOLSADA],
  [ESTADOS.RECHAZADA]: [ESTADOS.PAGADA, ESTADOS.PENDIENTE],
  [ESTADOS.REEMBOLSADA]: [],
};

/** Estados a los que puede pasar una orden desde su estado actual. */
export function estadosPermitidos(orden) {
  return TRANSICIONES[orden?.estado] || [];
}

/**
 * Cambia el estado de una orden. responsable = nombre de quien hizo el cambio (para el historial).
 * Devuelve { ok, error, orden }.
 */
export function cambiarEstadoOrden(ordenId, nuevoEstado, motivo, responsable = '', ahora = new Date()) {
  const orden = obtenerOrden(ordenId);
  if (!orden) return { ok: false, error: 'La orden no existe.' };
  if (tieneSolicitudPendiente(orden)) {
    return { ok: false, error: 'La orden tiene una solicitud del cliente pendiente: respóndela primero.' };
  }
  const errores = validarCambioEstado({ estado: nuevoEstado, motivo });
  if (Object.keys(errores).length > 0) return { ok: false, error: Object.values(errores)[0] };
  if (!estadosPermitidos(orden).includes(nuevoEstado)) {
    return { ok: false, error: `No se puede pasar de "${orden.estado}" a "${nuevoEstado}".` };
  }
  if (nuevoEstado === ESTADOS.PAGADA && orden.cita &&
      !horasDisponibles(orden.cita.fecha, orden.cita.tatuadorId, orden.id).includes(orden.cita.hora)) {
    return { ok: false, error: 'La hora de esta cita ya está ocupada por otra reserva pagada.' };
  }

  if (nuevoEstado === ESTADOS.REEMBOLSADA) reponerStockArticulos(orden.items);

  const registro = {
    de: orden.estado,
    a: nuevoEstado,
    motivo: String(motivo).trim(),
    responsable,
    fecha: ahora.toISOString(),
  };
  return {
    ok: true,
    error: '',
    orden: actualizar(COLECCION, orden.id, {
      estado: nuevoEstado,
      historialEstados: [...(orden.historialEstados || []), registro],
    }),
  };
}
