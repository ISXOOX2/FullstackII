// Funciones pequeñas para mostrar datos con formato (precios, fechas, nombres).

/** 15000 -> "$15.000" (separador de miles con punto, como se usa en Chile). */
export function formatoCLP(valor) {
  const numero = Math.round(Number(valor) || 0);
  const signo = numero < 0 ? '-' : '';
  return signo + '$' + String(Math.abs(numero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** "2026-10-23" (o una fecha ISO con hora) -> "23-10-2026". */
export function formatoFecha(iso) {
  if (!iso) return '';
  const [anio, mes, dia] = String(iso).slice(0, 10).split('-');
  return `${dia}-${mes}-${anio}`;
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** "2026-10-23" -> "viernes 23 de octubre de 2026". */
export function formatoFechaLarga(iso) {
  if (!iso) return '';
  const fecha = new Date(String(iso).slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(fecha.getTime())) return '';
  return `${DIAS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

/** Devuelve la fecha de hoy (hora local) como "AAAA-MM-DD". */
export function fechaISO(fecha = new Date()) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Suma (o resta) días a una fecha "AAAA-MM-DD". */
export function sumarDias(iso, dias) {
  const fecha = new Date(iso + 'T00:00:00');
  fecha.setDate(fecha.getDate() + dias);
  return fechaISO(fecha);
}

export function nombreCompleto(persona) {
  if (!persona) return '';
  return `${persona.nombre || ''} ${persona.apellidos || ''}`.trim();
}

export function inicial(persona) {
  const nombre = (persona && persona.nombre ? persona.nombre : '?').trim();
  return nombre.charAt(0).toUpperCase();
}

/** Quita tildes y pasa a minúsculas, para buscar sin importar acentos ("lunar" = "Lúnar"). */
export function normalizarTexto(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
