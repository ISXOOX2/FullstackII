// Datos iniciales ("semilla") de la base de datos simulada.
// La primera vez que se abre el sitio, db.js copia estos datos al localStorage del navegador.
// Después, todo el CRUD (crear, leer, actualizar, eliminar) trabaja sobre esa copia.

// ----------------------------------------------------------------------------
// CATEGORÍAS (estilos de tatuaje)
// ----------------------------------------------------------------------------
const CATEGORIAS = [
  {
    id: 1,
    nombre: 'Fineline',
    descripcion: 'Líneas delgadas y delicadas, ideales para un primer tatuaje.',
    imagen: 'img/disenos/mariposa-lineal.svg',
  },
  {
    id: 2,
    nombre: 'Botánico',
    descripcion: 'Ramas, hojas y flores dibujadas con trazo suave.',
    imagen: 'img/disenos/rama-de-olivo.svg',
  },
  {
    id: 3,
    nombre: 'Geométrico',
    descripcion: 'Formas simples, simetría y puntillismo (dotwork).',
    imagen: 'img/disenos/mandala-de-puntos.svg',
  },
  {
    id: 4,
    nombre: 'Celestial',
    descripcion: 'Luna, sol y constelaciones en versión minimalista.',
    imagen: 'img/disenos/fases-lunares.svg',
  },
];

// ----------------------------------------------------------------------------
// PRODUCTOS (diseños de tatuaje que se pueden reservar)
//  - stock          = cupos disponibles este mes para ese diseño
//  - stockCritico   = si los cupos bajan a este número (o menos) se muestra una alerta
//  - precioOferta   = precio rebajado (null si no está en oferta)
// Cada diseño tiene características propias: tamaño, duración, zonas, dolor, tatuador, etc.
// ----------------------------------------------------------------------------
const PRODUCTOS = [
  {
    id: 1, codigo: 'TF-001', nombre: 'Mariposa lineal', categoriaId: 1,
    descripcion: 'Mariposa de alas simétricas dibujada con una sola línea continua. Delicada y muy versátil.',
    precio: 65000, precioOferta: null, stock: 8, stockCritico: 3,
    tamano: '7 x 6 cm', duracionHoras: 1.5, zonas: 'Antebrazo, hombro, tobillo', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: true,
    imagen: 'img/disenos/mariposa-lineal.svg',
    imagenes: ['img/disenos/mariposa-lineal.svg', 'img/disenos/mariposa-lineal-cuerpo.svg'],
  },
  {
    id: 2, codigo: 'TF-002', nombre: 'Ola minimalista', categoriaId: 1,
    descripcion: 'Tres olas suaves en trazo muy fino. Perfecta para muñeca, tobillo o costillas.',
    precio: 45000, precioOferta: 38000, stock: 10, stockCritico: 3,
    tamano: '8 x 3 cm', duracionHoras: 1, zonas: 'Muñeca, tobillo, costillas', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'img/disenos/ola-minimalista.svg',
    imagenes: ['img/disenos/ola-minimalista.svg', 'img/disenos/ola-minimalista-cuerpo.svg'],
  },
  {
    id: 3, codigo: 'TF-003', nombre: 'Ancla fina', categoriaId: 1,
    descripcion: 'Ancla de líneas delgadas con una cuerda simple. Un clásico reinterpretado en versión fineline.',
    precio: 52000, precioOferta: null, stock: 2, stockCritico: 3,
    tamano: '5 x 7 cm', duracionHoras: 1.5, zonas: 'Antebrazo, pantorrilla', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'img/disenos/ancla-fina.svg',
    imagenes: ['img/disenos/ancla-fina.svg', 'img/disenos/ancla-fina-cuerpo.svg'],
  },
  {
    id: 4, codigo: 'TF-004', nombre: 'Rama de olivo', categoriaId: 2,
    descripcion: 'Rama larga con hojas alternadas. Se adapta a la curva del antebrazo o la clavícula.',
    precio: 58000, precioOferta: null, stock: 9, stockCritico: 3,
    tamano: '12 x 4 cm', duracionHoras: 2, zonas: 'Antebrazo, clavícula, costillas', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: true,
    imagen: 'img/disenos/rama-de-olivo.svg',
    imagenes: ['img/disenos/rama-de-olivo.svg', 'img/disenos/rama-de-olivo-cuerpo.svg'],
  },
  {
    id: 5, codigo: 'TF-005', nombre: 'Helecho silvestre', categoriaId: 2,
    descripcion: 'Hoja de helecho con nervadura central y foliolos simétricos, pensada para zonas alargadas.',
    precio: 72000, precioOferta: 64000, stock: 6, stockCritico: 2,
    tamano: '15 x 5 cm', duracionHoras: 2.5, zonas: 'Costillas, espalda, pantorrilla', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'img/disenos/helecho-silvestre.svg',
    imagenes: ['img/disenos/helecho-silvestre.svg', 'img/disenos/helecho-silvestre-cuerpo.svg'],
  },
  {
    id: 6, codigo: 'TF-006', nombre: 'Ramillete de lavanda', categoriaId: 2,
    descripcion: 'Tres tallos de lavanda unidos por un lazo mínimo. Pequeño, sutil y con mucho carácter.',
    precio: 48000, precioOferta: null, stock: 7, stockCritico: 2,
    tamano: '9 x 3 cm', duracionHoras: 1.5, zonas: 'Muñeca, antebrazo, tobillo', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'img/disenos/ramillete-de-lavanda.svg',
    imagenes: ['img/disenos/ramillete-de-lavanda.svg', 'img/disenos/ramillete-de-lavanda-cuerpo.svg'],
  },
  {
    id: 7, codigo: 'TF-007', nombre: 'Cubo isométrico', categoriaId: 3,
    descripcion: 'Cubo en perspectiva isométrica con aristas limpias. Un diseño geométrico simple y elegante.',
    precio: 60000, precioOferta: null, stock: 6, stockCritico: 2,
    tamano: '6 x 6 cm', duracionHoras: 1.5, zonas: 'Antebrazo, hombro, pantorrilla', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'img/disenos/cubo-isometrico.svg',
    imagenes: ['img/disenos/cubo-isometrico.svg', 'img/disenos/cubo-isometrico-cuerpo.svg'],
  },
  {
    id: 8, codigo: 'TF-008', nombre: 'Mandala de puntos', categoriaId: 3,
    descripcion: 'Mandala construido con círculos concéntricos y miles de puntos (dotwork). Pieza de sesión larga.',
    precio: 95000, precioOferta: null, stock: 4, stockCritico: 2,
    tamano: '10 x 10 cm', duracionHoras: 3.5, zonas: 'Espalda, muslo, hombro', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 2, destacado: true,
    imagen: 'img/disenos/mandala-de-puntos.svg',
    imagenes: ['img/disenos/mandala-de-puntos.svg', 'img/disenos/mandala-de-puntos-cuerpo.svg'],
  },
  {
    id: 9, codigo: 'TF-009', nombre: 'Montaña geométrica', categoriaId: 3,
    descripcion: 'Cadena de montañas hecha con triángulos y un sol mínimo. Ideal para quienes aman el trekking.',
    precio: 55000, precioOferta: 49000, stock: 8, stockCritico: 3,
    tamano: '8 x 5 cm', duracionHoras: 1.5, zonas: 'Antebrazo, tobillo, costillas', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'img/disenos/montana-geometrica.svg',
    imagenes: ['img/disenos/montana-geometrica.svg', 'img/disenos/montana-geometrica-cuerpo.svg'],
  },
  {
    id: 10, codigo: 'TF-010', nombre: 'Fases lunares', categoriaId: 4,
    descripcion: 'Las cinco fases de la luna en una hilera horizontal. Se ve muy bien a lo largo del antebrazo.',
    precio: 68000, precioOferta: null, stock: 5, stockCritico: 2,
    tamano: '14 x 3 cm', duracionHoras: 2, zonas: 'Antebrazo, columna, pantorrilla', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 1, destacado: true,
    imagen: 'img/disenos/fases-lunares.svg',
    imagenes: ['img/disenos/fases-lunares.svg', 'img/disenos/fases-lunares-cuerpo.svg'],
  },
  {
    id: 11, codigo: 'TF-011', nombre: 'Sol y rayos', categoriaId: 4,
    descripcion: 'Un sol minimalista con rayos de distinto largo. Simple, luminoso y fácil de combinar.',
    precio: 50000, precioOferta: null, stock: 1, stockCritico: 2,
    tamano: '6 x 6 cm', duracionHoras: 1.5, zonas: 'Muñeca, hombro, tobillo', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'img/disenos/sol-y-rayos.svg',
    imagenes: ['img/disenos/sol-y-rayos.svg', 'img/disenos/sol-y-rayos-cuerpo.svg'],
  },
  {
    id: 12, codigo: 'TF-012', nombre: 'Constelación', categoriaId: 4,
    descripcion: 'Puntos unidos por líneas muy finas, inspirados en el cielo del hemisferio sur.',
    precio: 62000, precioOferta: 55000, stock: 7, stockCritico: 3,
    tamano: '12 x 8 cm', duracionHoras: 2, zonas: 'Hombro, clavícula, espalda', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'img/disenos/constelacion.svg',
    imagenes: ['img/disenos/constelacion.svg', 'img/disenos/constelacion-cuerpo.svg'],
  },
];

// ----------------------------------------------------------------------------
// USUARIOS (los RUN están escritos sin puntos ni guion y con dígito verificador válido)
// ----------------------------------------------------------------------------
const USUARIOS = [
  {
    id: 1, run: '123456785', nombre: 'Administrador', apellidos: 'Trazo Fino',
    correo: 'admin.trazofino@gmail.com', password: 'Admin#123', telefono: '+56912345678',
    fechaNacimiento: '1990-05-12', tipo: 'Administrador',
    region: 'Metropolitana de Santiago', comuna: 'Providencia', direccion: 'Av. Providencia 1234',
  },
  {
    id: 2, run: '111111111', nombre: 'Vendedor', apellidos: 'Recepción',
    correo: 'vendedor.trazofino@gmail.com', password: 'Venta#123', telefono: '',
    fechaNacimiento: '1995-03-02', tipo: 'Vendedor',
    region: 'Metropolitana de Santiago', comuna: 'Providencia', direccion: 'Av. Providencia 1234',
  },
  {
    id: 3, run: '190110222', nombre: 'Cliente', apellidos: 'Demo',
    correo: 'cliente.demo@gmail.com', password: 'Cliente#1', telefono: '+56911112222',
    fechaNacimiento: '2000-08-21', tipo: 'Cliente',
    region: 'Metropolitana de Santiago', comuna: 'Ñuñoa', direccion: 'Calle Los Olmos 456, depto 12',
  },
  {
    id: 4, run: '176543213', nombre: 'Camila', apellidos: 'Fuentes Rojas',
    correo: 'camila.fuentes@gmail.com', password: 'Cliente#1', telefono: '+56922223333',
    fechaNacimiento: '1998-11-03', tipo: 'Cliente',
    region: 'Valparaíso', comuna: 'Viña del Mar', direccion: 'Calle 5 Norte 789',
  },
  {
    id: 5, run: '201234565', nombre: 'Joaquín', apellidos: 'Araya Soto',
    correo: 'joaquin.araya@gmail.com', password: 'Cliente#1', telefono: '',
    fechaNacimiento: '2001-02-17', tipo: 'Cliente',
    region: 'Metropolitana de Santiago', comuna: 'Maipú', direccion: 'Pasaje Las Rosas 321',
  },
  {
    id: 6, run: '182223336', nombre: 'Antonia', apellidos: 'Muñoz Paredes',
    correo: 'antonia.munoz@gmail.com', password: 'Cliente#1', telefono: '+56933334444',
    fechaNacimiento: '1996-07-29', tipo: 'Cliente',
    region: 'Biobío', comuna: 'Concepción', direccion: 'Barros Arana 1020',
  },
  {
    id: 7, run: '167890121', nombre: 'Tomás', apellidos: 'Rojas Vera',
    correo: 'tomas.rojas@gmail.com', password: 'Cliente#1', telefono: '+56944445555',
    fechaNacimiento: '1994-12-09', tipo: 'Cliente',
    region: 'Metropolitana de Santiago', comuna: 'La Florida', direccion: 'Av. Vicuña Mackenna 5500',
  },
];

// ----------------------------------------------------------------------------
// ÓRDENES de ejemplo (reservas pagadas) para que el dashboard y los reportes tengan datos
// ----------------------------------------------------------------------------
function linea(productoId, cantidad = 1) {
  const p = PRODUCTOS.find((x) => x.id === productoId);
  const precio = p.precioOferta !== null ? p.precioOferta : p.precio;
  return { productoId, nombre: p.nombre, imagen: p.imagen, categoriaId: p.categoriaId, precio, cantidad };
}

function orden(id, usuarioId, fechaCompra, estado, lineas, cita) {
  const u = USUARIOS.find((x) => x.id === usuarioId);
  const total = lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0);
  return {
    id,
    // Número visible: fecha de compra (AAAAMMDD) + correlativo de 2 dígitos
    numero: fechaCompra.slice(0, 10).replace(/-/g, '') + String(id).padStart(2, '0'),
    codigo: 'ORDER' + (1000 + id),
    usuarioId,
    fecha: fechaCompra,
    cliente: { nombre: u.nombre, apellidos: u.apellidos, correo: u.correo, telefono: u.telefono },
    cita,
    items: lineas,
    total,
    estado,
    metodoPago: 'Tarjeta (simulado)',
  };
}

const ORDENES = [
  orden(1, 4, '2026-08-14T11:20:00', 'Pagada', [linea(1)],
    { fecha: '2026-08-21', hora: '14:00', tatuadorId: 1, zonaCuerpo: 'Antebrazo izquierdo', indicaciones: '' }),
  orden(2, 5, '2026-08-29T16:05:00', 'Pagada', [linea(4)],
    { fecha: '2026-09-04', hora: '11:00', tatuadorId: 1, zonaCuerpo: 'Clavícula', indicaciones: 'Primera vez tatuándome' }),
  orden(3, 6, '2026-09-03T10:40:00', 'Pagada', [linea(8)],
    { fecha: '2026-09-18', hora: '12:30', tatuadorId: 2, zonaCuerpo: 'Espalda alta', indicaciones: '' }),
  orden(4, 4, '2026-09-12T19:15:00', 'Pagada', [linea(2), linea(6)],
    { fecha: '2026-09-25', hora: '15:30', tatuadorId: 3, zonaCuerpo: 'Tobillo y muñeca', indicaciones: 'Dos diseños en la misma sesión' }),
  orden(5, 7, '2026-09-20T13:30:00', 'Pagada', [linea(10)],
    { fecha: '2026-10-02', hora: '17:00', tatuadorId: 1, zonaCuerpo: 'Antebrazo derecho', indicaciones: '' }),
  orden(6, 5, '2026-09-27T09:10:00', 'Pagada', [linea(9), linea(12)],
    { fecha: '2026-10-16', hora: '14:00', tatuadorId: 2, zonaCuerpo: 'Hombro', indicaciones: '' }),
  orden(7, 6, '2026-10-02T21:00:00', 'Pago rechazado', [linea(5)],
    { fecha: '2026-10-23', hora: '11:00', tatuadorId: 2, zonaCuerpo: 'Costillas', indicaciones: '' }),
  orden(8, 7, '2026-10-06T12:45:00', 'Pagada', [linea(1), linea(3)],
    { fecha: '2026-10-23', hora: '15:30', tatuadorId: 1, zonaCuerpo: 'Antebrazo y tobillo', indicaciones: '' }),
  orden(9, 3, '2026-10-08T18:20:00', 'Pagada', [linea(11)],
    { fecha: '2026-10-30', hora: '12:30', tatuadorId: 3, zonaCuerpo: 'Muñeca', indicaciones: '' }),
];

export const SEMILLA = {
  categorias: CATEGORIAS,
  productos: PRODUCTOS,
  usuarios: USUARIOS,
  ordenes: ORDENES,
  mensajes: [],
};
