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

// Edad mínima para tener cuenta y tatuarse en el estudio. Decisión del equipo: los menores de 18
// se rechazan (no se aceptan con permiso de los padres).
export const EDAD_MINIMA = 18;

// Alerta de agenda: si a un tatuador le quedan HORAS_LIBRES_CRITICAS horas libres o menos en los
// próximos DIAS_ALERTA_AGENDA días de atención, se avisa en el panel y al cliente cuando reserva.
export const DIAS_ALERTA_AGENDA = 6;
export const HORAS_LIBRES_CRITICAS = 6;

// Tamaño de un tatuaje: ancho y alto SIEMPRE en centímetros (no se aceptan metros).
// El estudio trabaja piezas de hasta 20 cm por lado; más grande se cotiza aparte.
export const TAMANO_MIN_CM = 1;
export const TAMANO_MAX_CM = 20;

// Solicitudes sobre una reserva ya pagada (las revisa el administrador):
// • Reembolso: hasta 48 horas antes de la cita.
// • Cambio de fecha y hora: hasta 24 horas antes de la cita, con un justificativo.
export const HORAS_ANTICIPACION_REEMBOLSO = 48;
export const HORAS_ANTICIPACION_CAMBIO = 24;
// Compras de la tienda (sin cita): el cliente puede arrepentirse y pedir reembolso hasta 10 días
// después de la compra (derecho a retracto de las compras a distancia), con el producto sin abrir.
export const DIAS_RETRACTO_TIENDA = 10;
export const MOTIVOS_SOLICITUD = [
  'Problema de salud',
  'Tuve un imprevisto (trabajo, estudios o viaje)',
  'Me equivoqué al hacer la reserva',
  'Quiero cambiar de diseño o de tatuador',
  'Me arrepentí de la compra',
  'El producto llegó dañado o no es lo que pedí',
  'Otro motivo',
];

// Credenciales de demostración (también están en el README).
export const CUENTAS_DEMO = [
  { rol: 'Administrador', correo: 'admin.foreverink@gmail.com', password: 'Admin#123' },
  { rol: 'Vendedor', correo: 'vendedor.foreverink@gmail.com', password: 'Venta#123' },
  { rol: 'Cliente', correo: 'cliente.demo@gmail.com', password: 'Cliente#1' },
];

// Zonas del cuerpo que el cliente puede elegir (lista desplegable, no se escribe a mano).
export const ZONAS_CUERPO = [
  'Antebrazo', 'Brazo (bíceps o tríceps)', 'Hombro', 'Muñeca', 'Mano', 'Dedos',
  'Clavícula', 'Pecho', 'Costillas', 'Abdomen', 'Espalda alta', 'Espalda baja',
  'Nuca', 'Detrás de la oreja', 'Cadera', 'Muslo', 'Rodilla', 'Pantorrilla', 'Tobillo', 'Pie',
];
export const LADOS_CUERPO = ['Izquierdo', 'Derecho', 'Centro'];

// "Mi proyecto": el estudio responde a una idea propia en un máximo de 3 días hábiles (lunes a viernes).
export const DIAS_HABILES_CONTACTO = 3;

// Imágenes que suben los clientes (reseñas y Mi proyecto). Se guardan en localStorage,
// por eso se limita el peso: 1 MB como máximo y solo JPG, PNG o WEBP.
export const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGEN_BYTES = 1024 * 1024;
