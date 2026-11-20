// Datos generales del estudio. Si el grupo quiere cambiar el nombre, el eslogan o los
// datos de contacto, basta con editar ESTE archivo: todo el sitio se actualiza solo.

export const ESTUDIO = {
  nombre: 'Forever Ink',
  eslogan: 'Tatuajes kawaii, anime, tribal Y2K, celestial y cybersigilism',
  direccion: 'Av. Providencia 1234, Providencia, Santiago',
  telefono: '+56 9 1234 5678',
  correo: 'hola@foreverink.cl',
  horario: 'Martes a sábado · 11:00 a 19:00 hrs',
  instagram: '@foreverink.studio',
};

// Bloques horarios en los que se puede reservar una sesión.
export const HORAS_CITA = ['11:00', '12:30', '14:00', '15:30', '17:00'];

// El estudio atiende de martes (2) a sábado (6). getDay(): domingo = 0, lunes = 1.
export const DIAS_ATENCION = [2, 3, 4, 5, 6];

// Máximo de días hacia adelante en que se puede agendar.
export const DIAS_MAXIMOS_AGENDA = 180;

// Tamaño de un tatuaje: ancho y alto SIEMPRE en centímetros (no se aceptan metros).
// El estudio trabaja piezas de hasta 20 cm por lado; más grande se cotiza aparte.
export const TAMANO_MIN_CM = 1;
export const TAMANO_MAX_CM = 20;

// Solicitudes sobre una reserva ya pagada (las revisa el administrador):
// • Reembolso: hasta 48 horas antes de la cita.
// • Cambio de fecha y hora: hasta 24 horas antes de la cita, con un justificativo.
export const HORAS_ANTICIPACION_REEMBOLSO = 48;
export const HORAS_ANTICIPACION_CAMBIO = 24;
export const MOTIVOS_SOLICITUD = [
  'Problema de salud',
  'Tuve un imprevisto (trabajo, estudios o viaje)',
  'Me equivoqué al hacer la reserva',
  'Quiero cambiar de diseño o de tatuador',
  'Otro motivo',
];

// Credenciales de demostración (también están en el README).
export const CUENTAS_DEMO = [
  { rol: 'Administrador', correo: 'admin.foreverink@gmail.com', password: 'Admin#123' },
  { rol: 'Vendedor', correo: 'vendedor.foreverink@gmail.com', password: 'Venta#123' },
  { rol: 'Cliente', correo: 'cliente.demo@gmail.com', password: 'Cliente#1' },
];
