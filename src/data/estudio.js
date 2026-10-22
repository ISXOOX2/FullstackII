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

// Personas que desarrollan el proyecto (se muestran en la página "Nosotros").
// Si se suman integrantes al equipo, basta con agregarlos a esta lista.
export const EQUIPO_DESARROLLO = [
  { nombre: 'Isabel Cántaro', rol: 'Tienda y compra: catálogo, carrito, checkout con agenda, pago simulado y boleta' },
  { nombre: 'Eduardo Caro', rol: 'Usuarios y panel: inicio de sesión, registro, roles y mantenedores del administrador' },
  { nombre: 'Yeremi Vásquez', rol: 'Diseño y base: componentes (Atomic Design), estilos responsivos, datos simulados y pruebas' },
];

// Credenciales de demostración (también están en el README).
export const CUENTAS_DEMO = [
  { rol: 'Administrador', correo: 'admin.foreverink@gmail.com', password: 'Admin#123' },
  { rol: 'Vendedor', correo: 'vendedor.foreverink@gmail.com', password: 'Venta#123' },
  { rol: 'Cliente', correo: 'cliente.demo@gmail.com', password: 'Cliente#1' },
];
