// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Escrituras en el microservicio ms-reservas (axios, instancia apiReservas).
// • El precio NO se envía: el backend lo toma de ms-catalogo, así nadie puede cambiarlo desde el navegador.
// ───────────────────────────────────────────────────────────────────────────
import { apiReservas } from './api.js';

/** Convierte los datos del checkout al formato de la API (OrdenRequest). */
export function ordenParaApi({ cliente, cita, items }) {
  return {
    nombre: cliente.nombre,
    apellidos: cliente.apellidos,
    correo: cliente.correo,
    telefono: cliente.telefono.replace(/\s+/g, ''),
    citaFecha: cita?.fecha ?? null,
    citaHora: cita?.hora ?? null,
    tatuadorId: cita ? Number(cita.tatuadorId) : null,
    zonaCuerpo: cita?.zonaCuerpo ?? null,
    indicaciones: cita?.indicaciones ?? null,
    items: items.map((i) => (i.tipo === 'articulo'
      ? { tipo: 'articulo', articuloId: i.articuloId, cantidad: i.cantidad }
      : { tipo: 'diseno', productoId: i.productoId, cantidad: i.cantidad, anchoCm: i.anchoCm, altoCm: i.altoCm })),
  };
}

/** POST /api/v1/reservas -> orden Pendiente. */
export async function crearOrdenApi(datos) {
  const respuesta = await apiReservas.post('', ordenParaApi(datos));
  return respuesta.data;
}

/** POST /api/v1/reservas/{id}/pago -> Pagada (ocupa la hora y descuenta stock) o Pago rechazado. */
export async function pagarOrdenApi(id, aprobado) {
  const respuesta = await apiReservas.post(`/${id}/pago`, { aprobado });
  return respuesta.data;
}

/** GET /api/v1/reservas/horas -> horas libres de un tatuador en una fecha. */
export async function horasDisponiblesApi(fecha, tatuadorId) {
  const respuesta = await apiReservas.get('/horas', { params: { fecha, tatuadorId } });
  return respuesta.data;
}

/** POST /{id}/solicitudes: reembolso o cambio de fecha y hora. */
export async function solicitarApi(id, { tipo, motivo, justificativo, fecha, hora }) {
  await apiReservas.post(`/${id}/solicitudes`, {
    tipo, motivo, justificativo, nuevaFecha: tipo === 'cambio' ? fecha : null, nuevaHora: tipo === 'cambio' ? hora : null,
  });
}

/** PUT /{id}/solicitudes/{solicitudId} (Administrador). */
export async function responderSolicitudApi(id, solicitudId, aprobada, respuesta) {
  await apiReservas.put(`/${id}/solicitudes/${solicitudId}`, { aprobada, respuesta });
}

/** PUT /{id}/estado (Administrador). */
export async function cambiarEstadoApi(id, estado, motivo) {
  await apiReservas.put(`/${id}/estado`, { estado, motivo });
}
