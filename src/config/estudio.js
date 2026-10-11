// Datos generales del estudio. Si el grupo quiere cambiar el nombre, el eslogan o los
// datos de contacto, basta con editar ESTE archivo: todo el sitio se actualiza solo.

export const ESTUDIO = {
  nombre: 'Trazo Fino',
  eslogan: 'Tatuajes de línea fina y diseño minimalista',
  direccion: 'Av. Providencia 1234, Providencia, Santiago',
  telefono: '+56 9 1234 5678',
  correo: 'hola@trazofino.cl',
  horario: 'Martes a sábado · 11:00 a 19:00 hrs',
  instagram: '@trazofino.studio',
};

// Bloques horarios en los que se puede reservar una sesión.
export const HORAS_CITA = ['11:00', '12:30', '14:00', '15:30', '17:00'];

// El estudio atiende de martes (2) a sábado (6). getDay(): domingo = 0, lunes = 1.
export const DIAS_ATENCION = [2, 3, 4, 5, 6];

// Máximo de días hacia adelante en que se puede agendar.
export const DIAS_MAXIMOS_AGENDA = 180;

// Personas que desarrollan el proyecto (se muestran en la página "Nosotros").
export const EQUIPO_DESARROLLO = [
  { nombre: 'Isabel Cántaro', rol: 'Tienda, carrito y agendamiento de citas' },
  { nombre: 'Valentine Gaete', rol: 'Administración, usuarios y diseño visual' },
];

// Credenciales de demostración (también están en el README).
export const CUENTAS_DEMO = [
  { rol: 'Administrador', correo: 'admin.trazofino@gmail.com', password: 'Admin#123' },
  { rol: 'Vendedor', correo: 'vendedor.trazofino@gmail.com', password: 'Venta#123' },
  { rol: 'Cliente', correo: 'cliente.demo@gmail.com', password: 'Cliente#1' },
];
