// Arma el enlace "mailto:" para enviar la boleta por correo (sin servidor de correo).
import { formatoCLP, formatoFechaLarga } from './formato.js';
import { nombreTatuador } from '../data/tatuadores.js';
import { ESTUDIO } from '../data/estudio.js';
import { detalleItem } from '../services/carritoService.js';

export function construirMailtoBoleta(orden) {
  const lineas = orden.items.map(
    (i) => `- ${i.nombre} (${detalleItem(i)}) x${i.cantidad}: ${formatoCLP(i.precio * i.cantidad)}`,
  );
  const cuerpo = [
    `Hola ${orden.cliente.nombre}, gracias por reservar en ${ESTUDIO.nombre}.`,
    '',
    `Boleta N° ${orden.numero} (${orden.codigo})`,
    ...(orden.cita
      ? [
        `Cita: ${formatoFechaLarga(orden.cita.fecha)} a las ${orden.cita.hora} con ${nombreTatuador(orden.cita.tatuadorId)}`,
        `Zona del cuerpo: ${orden.cita.zonaCuerpo}`,
      ]
      : ['Retiro en el estudio, de martes a sábado.']),
    '',
    ...lineas,
    '',
    `Total pagado: ${formatoCLP(orden.total)}`,
    '',
    `${ESTUDIO.direccion}`,
  ].join('\n');

  const asunto = `Tu boleta ${orden.numero} - ${ESTUDIO.nombre}`;
  return `mailto:${encodeURIComponent(orden.cliente.correo)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
}
