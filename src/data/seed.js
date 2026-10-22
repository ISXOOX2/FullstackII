// Datos iniciales ("semilla") de la base de datos simulada.
// La primera vez que se abre el sitio, db.js copia estos datos al localStorage del navegador.
// Después, todo el CRUD (crear, leer, actualizar, eliminar) trabaja sobre esa copia.

// ----------------------------------------------------------------------------
// CATEGORÍAS (estilos de tatuaje): 5 estilos con 5 diseños cada uno
// ----------------------------------------------------------------------------
const CATEGORIAS = [
  {
    id: 1,
    nombre: 'Kawaii',
    descripcion: 'Personajes tiernos y adorables: animalitos, comida con carita y mucha ternura.',
    imagen: 'neko-chibi',
  },
  {
    id: 2,
    nombre: 'Anime',
    descripcion: 'Escenas y estética de series japonesas: miradas expresivas, katanas, máscaras y paisajes.',
    imagen: 'katana-sakura',
  },
  {
    id: 3,
    nombre: 'Tribal Y2K',
    descripcion: 'Corazones, flores y diseños tribales gruesos, con el look de los 2000.',
    imagen: 'corazon-tribal',
  },
  {
    id: 4,
    nombre: 'Celestial',
    descripcion: 'Estrellas, lunas, soles y destellos.',
    imagen: 'fases-lunares',
  },
  {
    id: 5,
    nombre: 'Cybersigilism',
    descripcion: 'Líneas finas, afiladas y simétricas, con un aire más oscuro y futurista.',
    imagen: 'sigilo-espina',
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
    id: 1, codigo: 'FI-001', nombre: 'Neko chibi', categoriaId: 1,
    descripcion: 'Gatito de cabeza grande y ojos brillantes, en trazo limpio. Ideal para un primer tatuaje.',
    precio: 55000, precioOferta: null, stock: 8, stockCritico: 3,
    tamano: '7 x 6 cm', duracionHoras: 1.5, zonas: 'Antebrazo, tobillo, hombro', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: true,
    imagen: 'neko-chibi',
    imagenes: ['neko-chibi', 'neko-chibi-cuerpo'],
  },
  {
    id: 2, codigo: 'FI-002', nombre: 'Onigiri feliz', categoriaId: 1,
    descripcion: 'Bolita de arroz con alga y carita sonriente. Pequeño, divertido y rápido de hacer.',
    precio: 35000, precioOferta: 29000, stock: 10, stockCritico: 3,
    tamano: '5 x 5 cm', duracionHoras: 1, zonas: 'Muñeca, tobillo, detrás de la oreja', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'onigiri-feliz',
    imagenes: ['onigiri-feliz', 'onigiri-feliz-cuerpo'],
  },
  {
    id: 3, codigo: 'FI-003', nombre: 'Fresita kawaii', categoriaId: 1,
    descripcion: 'Frutilla con hojitas, semillas y una carita tierna.',
    precio: 38000, precioOferta: null, stock: 7, stockCritico: 2,
    tamano: '6 x 7 cm', duracionHoras: 1, zonas: 'Tobillo, pantorrilla, antebrazo', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'fresita-kawaii',
    imagenes: ['fresita-kawaii', 'fresita-kawaii-cuerpo'],
  },
  {
    id: 4, codigo: 'FI-004', nombre: 'Nubecita dormilona', categoriaId: 1,
    descripcion: 'Nube con ojitos cerrados y unas zetas de sueño. Suave y relajada.',
    precio: 42000, precioOferta: null, stock: 2, stockCritico: 3,
    tamano: '8 x 6 cm', duracionHoras: 1.5, zonas: 'Antebrazo, clavícula, costillas', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'nubecita-dormilona',
    imagenes: ['nubecita-dormilona', 'nubecita-dormilona-cuerpo'],
  },
  {
    id: 5, codigo: 'FI-005', nombre: 'Boba kawaii', categoriaId: 1,
    descripcion: 'Vaso de bubble tea con perlas y carita feliz.',
    precio: 40000, precioOferta: null, stock: 6, stockCritico: 2,
    tamano: '7 x 9 cm', duracionHoras: 1.5, zonas: 'Pantorrilla, antebrazo, muslo', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'boba-kawaii',
    imagenes: ['boba-kawaii', 'boba-kawaii-cuerpo'],
  },
  {
    id: 6, codigo: 'FI-006', nombre: 'Máscara kitsune', categoriaId: 2,
    descripcion: 'Máscara de zorro del folclore japonés, con marcas en la frente y mirada serena.',
    precio: 62000, precioOferta: null, stock: 6, stockCritico: 2,
    tamano: '9 x 9 cm', duracionHoras: 2, zonas: 'Antebrazo, hombro, muslo', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'mascara-kitsune',
    imagenes: ['mascara-kitsune', 'mascara-kitsune-cuerpo'],
  },
  {
    id: 7, codigo: 'FI-007', nombre: 'Ojos de anime', categoriaId: 2,
    descripcion: 'Mirada intensa al estilo anime, con pestañas marcadas y brillo en las pupilas.',
    precio: 58000, precioOferta: null, stock: 5, stockCritico: 2,
    tamano: '12 x 5 cm', duracionHoras: 2, zonas: 'Antebrazo, clavícula, espalda alta', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 1, destacado: false,
    imagen: 'ojos-anime',
    imagenes: ['ojos-anime', 'ojos-anime-cuerpo'],
  },
  {
    id: 8, codigo: 'FI-008', nombre: 'Katana y sakura', categoriaId: 2,
    descripcion: 'Katana en diagonal rodeada de flores y pétalos de cerezo que caen.',
    precio: 89000, precioOferta: null, stock: 4, stockCritico: 2,
    tamano: '18 x 14 cm', duracionHoras: 3.5, zonas: 'Espalda, muslo, costillas', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 1, destacado: true,
    imagen: 'katana-sakura',
    imagenes: ['katana-sakura', 'katana-sakura-cuerpo'],
  },
  {
    id: 9, codigo: 'FI-009', nombre: 'Ola y sol', categoriaId: 2,
    descripcion: 'Ola que se enrosca bajo un sol radiante, inspirada en los grabados japoneses.',
    precio: 68000, precioOferta: 59000, stock: 6, stockCritico: 2,
    tamano: '10 x 9 cm', duracionHoras: 2.5, zonas: 'Antebrazo, pantorrilla, hombro', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'ola-y-sol',
    imagenes: ['ola-y-sol', 'ola-y-sol-cuerpo'],
  },
  {
    id: 10, codigo: 'FI-010', nombre: 'Torii bajo la luna', categoriaId: 2,
    descripcion: 'Portal torii frente a la luna llena, con pétalos de cerezo al viento.',
    precio: 79000, precioOferta: null, stock: 3, stockCritico: 2,
    tamano: '14 x 13 cm', duracionHoras: 3, zonas: 'Espalda, muslo, costillas', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'torii-luna',
    imagenes: ['torii-luna', 'torii-luna-cuerpo'],
  },
  {
    id: 11, codigo: 'FI-011', nombre: 'Corazón tribal', categoriaId: 3,
    descripcion: 'Corazón grueso con espinas y llamas tribales, puro estilo 2000.',
    precio: 60000, precioOferta: null, stock: 7, stockCritico: 3,
    tamano: '9 x 9 cm', duracionHoras: 2, zonas: 'Espalda baja, antebrazo, hombro', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 2, destacado: true,
    imagen: 'corazon-tribal',
    imagenes: ['corazon-tribal', 'corazon-tribal-cuerpo'],
  },
  {
    id: 12, codigo: 'FI-012', nombre: 'Mariposa tribal', categoriaId: 3,
    descripcion: 'Mariposa de alas afiladas en negro sólido, simétrica y llamativa.',
    precio: 95000, precioOferta: null, stock: 4, stockCritico: 2,
    tamano: '20 x 14 cm', duracionHoras: 4, zonas: 'Espalda baja, espalda, pecho', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'mariposa-tribal',
    imagenes: ['mariposa-tribal', 'mariposa-tribal-cuerpo'],
  },
  {
    id: 13, codigo: 'FI-013', nombre: 'Flor tribal', categoriaId: 3,
    descripcion: 'Flor de pétalos puntiagudos que giran alrededor de un centro marcado.',
    precio: 52000, precioOferta: null, stock: 1, stockCritico: 2,
    tamano: '9 x 9 cm', duracionHoras: 2, zonas: 'Pantorrilla, tobillo, hombro', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'flor-tribal',
    imagenes: ['flor-tribal', 'flor-tribal-cuerpo'],
  },
  {
    id: 14, codigo: 'FI-014', nombre: 'Brazalete tribal', categoriaId: 3,
    descripcion: 'Banda de puntas que rodea el brazo, como los brazaletes de los 2000.',
    precio: 85000, precioOferta: 74000, stock: 5, stockCritico: 2,
    tamano: '15 x 4 cm', duracionHoras: 3, zonas: 'Brazo, antebrazo, pantorrilla', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'brazalete-tribal',
    imagenes: ['brazalete-tribal', 'brazalete-tribal-cuerpo'],
  },
  {
    id: 15, codigo: 'FI-015', nombre: 'Estrella tribal', categoriaId: 3,
    descripcion: 'Estrella de cuatro puntas con brazos curvos y gruesos.',
    precio: 48000, precioOferta: null, stock: 6, stockCritico: 2,
    tamano: '8 x 8 cm', duracionHoras: 1.5, zonas: 'Pantorrilla, tobillo, nuca', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'estrella-tribal',
    imagenes: ['estrella-tribal', 'estrella-tribal-cuerpo'],
  },
  {
    id: 16, codigo: 'FI-016', nombre: 'Fases lunares', categoriaId: 4,
    descripcion: 'Las fases de la luna en línea fina sobre una línea de horizonte.',
    precio: 68000, precioOferta: null, stock: 5, stockCritico: 2,
    tamano: '14 x 3 cm', duracionHoras: 2, zonas: 'Antebrazo, columna, clavícula', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'fases-lunares',
    imagenes: ['fases-lunares', 'fases-lunares-cuerpo'],
  },
  {
    id: 17, codigo: 'FI-017', nombre: 'Sol y rayos', categoriaId: 4,
    descripcion: 'Sol de rayos finos y regulares, sencillo y luminoso.',
    precio: 50000, precioOferta: null, stock: 2, stockCritico: 2,
    tamano: '6 x 6 cm', duracionHoras: 1.5, zonas: 'Antebrazo, tobillo, nuca', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'sol-y-rayos',
    imagenes: ['sol-y-rayos', 'sol-y-rayos-cuerpo'],
  },
  {
    id: 18, codigo: 'FI-018', nombre: 'Constelación', categoriaId: 4,
    descripcion: 'Puntos unidos por líneas muy finas, inspirados en el cielo del hemisferio sur.',
    precio: 62000, precioOferta: 55000, stock: 7, stockCritico: 3,
    tamano: '12 x 8 cm', duracionHoras: 2, zonas: 'Hombro, clavícula, espalda', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'constelacion',
    imagenes: ['constelacion', 'constelacion-cuerpo'],
  },
  {
    id: 19, codigo: 'FI-019', nombre: 'Destellos', categoriaId: 4,
    descripcion: 'Grupo de estrellas de cuatro puntas de distintos tamaños, como un brillo.',
    precio: 39000, precioOferta: null, stock: 8, stockCritico: 3,
    tamano: '7 x 7 cm', duracionHoras: 1, zonas: 'Muñeca, detrás de la oreja, clavícula', nivelDolor: 2,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'destellos',
    imagenes: ['destellos', 'destellos-cuerpo'],
  },
  {
    id: 20, codigo: 'FI-020', nombre: 'Luna y estrellas colgantes', categoriaId: 4,
    descripcion: 'Luna creciente con tres estrellas que cuelgan de hilos finos.',
    precio: 64000, precioOferta: null, stock: 5, stockCritico: 2,
    tamano: '12 x 14 cm', duracionHoras: 2.5, zonas: 'Espalda, costillas, muslo', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 3, destacado: false,
    imagen: 'luna-y-estrellas',
    imagenes: ['luna-y-estrellas', 'luna-y-estrellas-cuerpo'],
  },
  {
    id: 21, codigo: 'FI-021', nombre: 'Sigilo espina', categoriaId: 5,
    descripcion: 'Columna central con ramas afiladas y simétricas. Ideal a lo largo de la espalda.',
    precio: 98000, precioOferta: null, stock: 4, stockCritico: 2,
    tamano: '22 x 26 cm', duracionHoras: 4.5, zonas: 'Columna, espalda, esternón', nivelDolor: 5,
    colorTinta: 'Negro', tatuadorId: 2, destacado: true,
    imagen: 'sigilo-espina',
    imagenes: ['sigilo-espina', 'sigilo-espina-cuerpo'],
  },
  {
    id: 22, codigo: 'FI-022', nombre: 'Corona afilada', categoriaId: 5,
    descripcion: 'Puntas finas que se abren como una corona oscura.',
    precio: 58000, precioOferta: null, stock: 6, stockCritico: 2,
    tamano: '10 x 9 cm', duracionHoras: 2, zonas: 'Pantorrilla, nuca, esternón', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'corona-afilada',
    imagenes: ['corona-afilada', 'corona-afilada-cuerpo'],
  },
  {
    id: 23, codigo: 'FI-023', nombre: 'Alas sigilo', categoriaId: 5,
    descripcion: 'Alas de líneas cortantes que nacen de un eje central.',
    precio: 110000, precioOferta: 96000, stock: 3, stockCritico: 2,
    tamano: '22 x 20 cm', duracionHoras: 5, zonas: 'Espalda, pecho, esternón', nivelDolor: 5,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'alas-sigilo',
    imagenes: ['alas-sigilo', 'alas-sigilo-cuerpo'],
  },
  {
    id: 24, codigo: 'FI-024', nombre: 'Halo roto', categoriaId: 5,
    descripcion: 'Círculos interrumpidos y líneas que lo atraviesan, con un aire futurista.',
    precio: 72000, precioOferta: null, stock: 5, stockCritico: 2,
    tamano: '11 x 12 cm', duracionHoras: 2.5, zonas: 'Pantorrilla, antebrazo, muslo', nivelDolor: 4,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'halo-roto',
    imagenes: ['halo-roto', 'halo-roto-cuerpo'],
  },
  {
    id: 25, codigo: 'FI-025', nombre: 'Daga sigilo', categoriaId: 5,
    descripcion: 'Daga vertical de hoja fina con ganchos simétricos.',
    precio: 45000, precioOferta: null, stock: 7, stockCritico: 2,
    tamano: '6 x 12 cm', duracionHoras: 1.5, zonas: 'Antebrazo, dedos, tobillo', nivelDolor: 3,
    colorTinta: 'Negro', tatuadorId: 2, destacado: false,
    imagen: 'daga-sigilo',
    imagenes: ['daga-sigilo', 'daga-sigilo-cuerpo'],
  },
];

// ----------------------------------------------------------------------------
// USUARIOS (los RUN están escritos sin puntos ni guion y con dígito verificador válido)
// ----------------------------------------------------------------------------
const USUARIOS = [
  {
    id: 1, run: '123456785', nombre: 'Administrador', apellidos: 'Forever Ink',
    correo: 'admin.foreverink@gmail.com', password: 'Admin#123', telefono: '+56912345678',
    fechaNacimiento: '1990-05-12', tipo: 'Administrador',
    region: 'Metropolitana de Santiago', comuna: 'Providencia', direccion: 'Av. Providencia 1234',
  },
  {
    id: 2, run: '111111111', nombre: 'Vendedor', apellidos: 'Recepción',
    correo: 'vendedor.foreverink@gmail.com', password: 'Venta#123', telefono: '',
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
