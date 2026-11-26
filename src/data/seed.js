// Datos iniciales ("semilla") de la base de datos simulada.
// La primera vez que se abre el sitio, db.js copia estos datos al localStorage del navegador.
// Después, todo el CRUD (crear, leer, actualizar, eliminar) trabaja sobre esa copia.

// ----------------------------------------------------------------------------
// CATEGORÍAS (estilos de tatuaje): 5 estilos
// ----------------------------------------------------------------------------
const CATEGORIAS = [
  {
    id: 1,
    nombre: 'Kawaii',
    descripcion: 'Personajes tiernos y adorables: animalitos, fantasmitas y mucha ternura.',
    imagen: 'panda-globo-corazon',
  },
  {
    id: 2,
    nombre: 'Anime',
    descripcion: 'Escenas y estética de series japonesas: personajes, máscaras hannya, kitsunes y katanas.',
    imagen: 'sukuna',
  },
  {
    id: 3,
    nombre: 'Tribal Y2K',
    descripcion: 'Diseños tribales gruesos y simétricos, cromo y estrellas, con el look de los 2000.',
    imagen: 'cruz-cromada',
  },
  {
    id: 4,
    nombre: 'Celestial',
    descripcion: 'Lunas, soles, estrellas, alas y ángeles de línea fina.',
    imagen: 'sol-y-luna-nubes',
  },
  {
    id: 5,
    nombre: 'Cybersigilism',
    descripcion: 'Líneas finas, afiladas y simétricas, con un aire más oscuro y futurista.',
    imagen: 'espada-telarana',
  },
];

// ----------------------------------------------------------------------------
// PRODUCTOS (diseños de tatuaje que se pueden reservar)
//  Los diseños NO tienen stock: un mismo diseño se puede tatuar las veces que se quiera.
//  Lo que sí se agota son las horas de cada tatuador (agenda) y los insumos (más abajo).
//  - precioOferta   = precio rebajado (null si no está en oferta)
// Cada diseño tiene características propias: tamaño, duración, zonas, dolor, tatuador, etc.
// ----------------------------------------------------------------------------
const PRODUCTOS = [
  {
    id: 1, codigo: 'FI-001', nombre: 'Panda con globo', categoriaId: 1,
    descripcion: 'Pandita sentado que sostiene un globo en forma de corazón. Tierno, simple y perfecto para un primer tatuaje.',
    precio: 12000, precioOferta: null,
    anchoCm: 6, altoCm: 9, duracionHoras: 1.5, zonas: 'Antebrazo, tobillo, hombro', nivelDolor: 2,
    colorTinta: 'Negro', destacado: true,
    imagen: 'panda-globo-corazon',
    imagenes: ['panda-globo-corazon'],
  },
  {
    id: 2, codigo: 'FI-002', nombre: 'Gato hada', categoriaId: 1,
    descripcion: 'Gatito sentado con alas de hada y destellos a su alrededor, en trazo punteado.',
    precio: 15000, precioOferta: 12000,
    anchoCm: 9, altoCm: 9, duracionHoras: 2, zonas: 'Antebrazo, muslo, costillas', nivelDolor: 2,
    colorTinta: 'Negro', destacado: false,
    imagen: 'gato-hada',
    imagenes: ['gato-hada'],
  },
  {
    id: 3, codigo: 'FI-003', nombre: 'Trío fantasma', categoriaId: 1,
    descripcion: 'Tres fantasmitas apilados con sonrisa traviesa, en sombreado suave. Va muy bien en vertical.',
    precio: 15000, precioOferta: null,
    anchoCm: 5, altoCm: 10, duracionHoras: 1.5, zonas: 'Pantorrilla, antebrazo, muslo', nivelDolor: 2,
    colorTinta: 'Negro', destacado: false,
    imagen: 'trio-fantasma',
    imagenes: ['trio-fantasma'],
  },
  {
    id: 4, codigo: 'FI-004', nombre: 'Sukuna', categoriaId: 2,
    descripcion: 'Retrato de Sukuna (Jujutsu Kaisen) con sonrisa amplia, garras y llamas, en línea gruesa.',
    precio: 32000, precioOferta: null,
    anchoCm: 16, altoCm: 20, duracionHoras: 4, zonas: 'Espalda, muslo, costillas', nivelDolor: 4,
    colorTinta: 'Negro', destacado: true,
    imagen: 'sukuna',
    imagenes: ['sukuna'],
  },
  {
    id: 5, codigo: 'FI-005', nombre: 'Choso', categoriaId: 2,
    descripcion: 'Retrato de Choso (Jujutsu Kaisen) con capucha, marcas en el rostro y pose serena, en línea fina.',
    precio: 22000, precioOferta: null,
    anchoCm: 12, altoCm: 14, duracionHoras: 3, zonas: 'Antebrazo, muslo, hombro', nivelDolor: 3,
    colorTinta: 'Negro', destacado: false,
    imagen: 'choso',
    imagenes: ['choso'],
  },
  {
    id: 6, codigo: 'FI-006', nombre: 'Zorro kitsune', categoriaId: 2,
    descripcion: 'Mano en forma de zorro con ojos en espiral y colmillos, en negros sólidos de alto contraste.',
    precio: 20000, precioOferta: 18000,
    anchoCm: 12, altoCm: 10, duracionHoras: 2.5, zonas: 'Antebrazo, hombro, muslo', nivelDolor: 3,
    colorTinta: 'Negro', destacado: false,
    imagen: 'zorro-kitsune',
    imagenes: ['zorro-kitsune'],
  },
  {
    id: 7, codigo: 'FI-007', nombre: 'Mano hannya', categoriaId: 2,
    descripcion: 'Máscara hannya con katana entre los dientes sobre una mano con tribales gruesos.',
    precio: 25000, precioOferta: null,
    anchoCm: 10, altoCm: 17, duracionHoras: 3.5, zonas: 'Antebrazo, mano, pantorrilla', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'mano-hannya',
    imagenes: ['mano-hannya'],
  },
  {
    id: 8, codigo: 'FI-008', nombre: 'Hannya con katana', categoriaId: 2,
    descripcion: 'Boceto de demonio hannya con cuernos, katana entre los dientes y rosario entre las manos.',
    precio: 28000, precioOferta: null,
    anchoCm: 12, altoCm: 22, duracionHoras: 4, zonas: 'Espalda, muslo, antebrazo', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'hannya-katana',
    imagenes: ['hannya-katana'],
  },
  {
    id: 9, codigo: 'FI-009', nombre: 'Ace (One Piece)', categoriaId: 2,
    descripcion: 'Lettering vertical «ASCE» inspirado en el tatuaje de Ace, de One Piece.',
    precio: 12000, precioOferta: null,
    anchoCm: 4, altoCm: 12, duracionHoras: 1, zonas: 'Antebrazo, costillas, pierna', nivelDolor: 3,
    colorTinta: 'Negro', destacado: false,
    imagen: 'ace-lettering',
    imagenes: ['ace-lettering'],
  },
  {
    id: 10, codigo: 'FI-010', nombre: 'Cruz cromada', categoriaId: 3,
    descripcion: 'Cruz rodeada de tribal cromado con brillo metálico, muy del estilo 2000.',
    precio: 22000, precioOferta: null,
    anchoCm: 8, altoCm: 16, duracionHoras: 3, zonas: 'Espalda baja, antebrazo, pantorrilla', nivelDolor: 3,
    colorTinta: 'Negro', destacado: true,
    imagen: 'cruz-cromada',
    imagenes: ['cruz-cromada'],
  },
  {
    id: 11, codigo: 'FI-011', nombre: 'Tribal con cruz', categoriaId: 3,
    descripcion: 'Tribal simétrico con una cruz al centro. Pensado para espalda baja.',
    precio: 25000, precioOferta: 21000,
    anchoCm: 16, altoCm: 10, duracionHoras: 3, zonas: 'Espalda baja, esternón, nuca', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'tribal-cruz-lumbar',
    imagenes: ['tribal-cruz-lumbar'],
  },
  {
    id: 12, codigo: 'FI-012', nombre: 'Estrellas tribales', categoriaId: 3,
    descripcion: 'Cascada de estrellas dentro de tribal grueso y líquido. Negros sólidos.',
    precio: 24000, precioOferta: null,
    anchoCm: 12, altoCm: 16, duracionHoras: 3, zonas: 'Hombro, antebrazo, muslo', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'estrellas-tribales',
    imagenes: ['estrellas-tribales'],
  },
  {
    id: 13, codigo: 'FI-013', nombre: 'Alas tribales', categoriaId: 3,
    descripcion: 'Alas tribales finas y simétricas con una estrella de destello al costado. Clásico lumbar.',
    precio: 28000, precioOferta: null,
    anchoCm: 20, altoCm: 10, duracionHoras: 3.5, zonas: 'Espalda baja, esternón, nuca', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'alas-tribales',
    imagenes: ['alas-tribales'],
  },
  {
    id: 14, codigo: 'FI-014', nombre: 'Araña tribal', categoriaId: 3,
    descripcion: 'Araña viuda negra sobre una telaraña de líneas tribales afiladas.',
    precio: 24000, precioOferta: null,
    anchoCm: 12, altoCm: 18, duracionHoras: 3, zonas: 'Espalda, pantorrilla, muslo', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'arana-tribal',
    imagenes: ['arana-tribal'],
  },
  {
    id: 15, codigo: 'FI-015', nombre: 'Gatos y luna', categoriaId: 4,
    descripcion: 'Dos gatos, uno negro y uno claro, entre estrellas y arabescos que forman una luna.',
    precio: 30000, precioOferta: null,
    anchoCm: 10, altoCm: 28, duracionHoras: 4, zonas: 'Espalda, columna, muslo', nivelDolor: 3,
    colorTinta: 'Negro', destacado: false,
    imagen: 'gatos-luna',
    imagenes: ['gatos-luna'],
  },
  {
    id: 16, codigo: 'FI-016', nombre: 'Sol y luna entre nubes', categoriaId: 4,
    descripcion: 'Luna creciente con un sol en el centro, rodeados de nubes ondulantes y estrellas.',
    precio: 28000, precioOferta: null,
    anchoCm: 14, altoCm: 26, duracionHoras: 4, zonas: 'Espalda, costillas, muslo', nivelDolor: 3,
    colorTinta: 'Negro', destacado: true,
    imagen: 'sol-y-luna-nubes',
    imagenes: ['sol-y-luna-nubes'],
  },
  {
    id: 17, codigo: 'FI-017', nombre: 'Alas, luna y espada', categoriaId: 4,
    descripcion: 'Alas con ojos, una espada vertical y una luna creciente arriba, en línea fina.',
    precio: 30000, precioOferta: 25000,
    anchoCm: 16, altoCm: 22, duracionHoras: 4, zonas: 'Espalda, esternón, columna', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'alas-luna-espada',
    imagenes: ['alas-luna-espada'],
  },
  {
    id: 18, codigo: 'FI-018', nombre: 'Ángel de estrellas', categoriaId: 4,
    descripcion: 'Ángel con alas y halo de estrellas rodeado de ornamentos puntiagudos.',
    precio: 32000, precioOferta: null,
    anchoCm: 14, altoCm: 22, duracionHoras: 4, zonas: 'Espalda, muslo, antebrazo', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'angel-estrellas',
    imagenes: ['angel-estrellas'],
  },
  {
    id: 19, codigo: 'FI-019', nombre: 'Alas y espada', categoriaId: 4,
    descripcion: 'Alas de pluma delicadas con una espada al centro, en trazo fino y degradado.',
    precio: 26000, precioOferta: null,
    anchoCm: 18, altoCm: 12, duracionHoras: 3, zonas: 'Espalda alta, esternón, nuca', nivelDolor: 3,
    colorTinta: 'Negro', destacado: false,
    imagen: 'alas-espada',
    imagenes: ['alas-espada'],
  },
  {
    id: 20, codigo: 'FI-020', nombre: 'Espada telaraña', categoriaId: 5,
    descripcion: 'Espada con telaraña de espinas que se abre como un abanico. Muy vertical.',
    precio: 30000, precioOferta: null,
    anchoCm: 12, altoCm: 26, duracionHoras: 4, zonas: 'Columna, espalda, antebrazo', nivelDolor: 5,
    colorTinta: 'Negro', destacado: true,
    imagen: 'espada-telarana',
    imagenes: ['espada-telarana'],
  },
  {
    id: 21, codigo: 'FI-021', nombre: 'Manos fluidas', categoriaId: 5,
    descripcion: 'Dos manos de líneas líquidas y retorcidas con un punto de polvo en el centro.',
    precio: 26000, precioOferta: null,
    anchoCm: 10, altoCm: 20, duracionHoras: 3, zonas: 'Antebrazo, muslo, costillas', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'manos-fluidas',
    imagenes: ['manos-fluidas'],
  },
  {
    id: 22, codigo: 'FI-022', nombre: 'Murciélagos espinosos', categoriaId: 5,
    descripcion: 'Tres murciélagos entre ramas afiladas que forman un corazón.',
    precio: 26000, precioOferta: null,
    anchoCm: 14, altoCm: 18, duracionHoras: 3, zonas: 'Espalda, muslo, antebrazo', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'murcielagos-espinosos',
    imagenes: ['murcielagos-espinosos'],
  },
  {
    id: 23, codigo: 'FI-023', nombre: 'Alas y ojo', categoriaId: 5,
    descripcion: 'Cruz alada que baja por una columna de ornamentos hasta un ojo con alas de murciélago.',
    precio: 35000, precioOferta: 30000,
    anchoCm: 14, altoCm: 30, duracionHoras: 4.5, zonas: 'Columna, esternón, espalda', nivelDolor: 5,
    colorTinta: 'Negro', destacado: false,
    imagen: 'alas-ojo',
    imagenes: ['alas-ojo'],
  },
  {
    id: 24, codigo: 'FI-024', nombre: 'Guerrera con lanza', categoriaId: 5,
    descripcion: 'Figura entre redes de espinas, con alas y una lanza vertical. Muy alargada.',
    precio: 24000, precioOferta: null,
    anchoCm: 6, altoCm: 20, duracionHoras: 3, zonas: 'Antebrazo, pantorrilla, costillas', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'guerrera-lanza',
    imagenes: ['guerrera-lanza'],
  },
  {
    id: 25, codigo: 'FI-025', nombre: 'Ojos espinosos', categoriaId: 5,
    descripcion: 'Dos ojos realistas encerrados en una malla de espinas negras.',
    precio: 28000, precioOferta: null,
    anchoCm: 12, altoCm: 20, duracionHoras: 3.5, zonas: 'Antebrazo, muslo, espalda', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'ojos-espinosos',
    imagenes: ['ojos-espinosos'],
  },  {
    id: 26, codigo: 'FI-026', nombre: 'Gato esqueleto', categoriaId: 1,
    descripcion: 'Gatito negro que salta con la mitad del cuerpo convertida en esqueleto, en sombreado suave. Tierno y un poco oscuro.',
    precio: 15000, precioOferta: null,
    anchoCm: 7, altoCm: 12, duracionHoras: 2, zonas: 'Antebrazo, pantorrilla, costillas', nivelDolor: 2,
    colorTinta: 'Negro', destacado: false,
    imagen: 'gato-esqueleto',
    imagenes: ['gato-esqueleto'],
  },
  {
    id: 27, codigo: 'FI-027', nombre: 'Luna chorreante', categoriaId: 4,
    descripcion: 'Luna creciente en negro sólido que gotea hilos de tinta. Minimalista y muy vertical.',
    precio: 20000, precioOferta: null,
    anchoCm: 8, altoCm: 20, duracionHoras: 2.5, zonas: 'Antebrazo, columna, pantorrilla', nivelDolor: 3,
    colorTinta: 'Negro', destacado: false,
    imagen: 'luna-chorreante',
    imagenes: ['luna-chorreante'],
  },
  {
    id: 28, codigo: 'FI-028', nombre: 'Espada y alas afiladas', categoriaId: 5,
    descripcion: 'Espada central con alas de línea fina y puntas afiladas. Ideal para espalda alta o esternón.',
    precio: 28000, precioOferta: null,
    anchoCm: 18, altoCm: 12, duracionHoras: 3, zonas: 'Espalda alta, esternón, nuca', nivelDolor: 4,
    colorTinta: 'Negro', destacado: false,
    imagen: 'espada-alas-afiladas',
    imagenes: ['espada-alas-afiladas'],
  },
  {
    id: 29, codigo: 'FI-029', nombre: 'Corazón de espinas', categoriaId: 3,
    descripcion: 'Corazón rodeado de espinas y ornamentos simétricos, con el look gótico de los 2000.',
    precio: 26000, precioOferta: null,
    anchoCm: 10, altoCm: 18, duracionHoras: 3.5, zonas: 'Espalda baja, esternón, muslo', nivelDolor: 4,
    colorTinta: 'Negro', destacado: true,
    imagen: 'corazon-espinas',
    imagenes: ['corazon-espinas'],
  },  {
    id: 30, codigo: 'FI-030', nombre: 'Muerte con gatito', categoriaId: 1,
    descripcion: 'Pequeña Parca con guadaña que abraza a un gatito blanco, con un corazón al lado. Tierno y un poco oscuro.',
    precio: 16000, precioOferta: null,
    anchoCm: 8, altoCm: 10, duracionHoras: 2, zonas: 'Antebrazo, pantorrilla, muslo', nivelDolor: 2,
    colorTinta: 'Negro', destacado: false,
    imagen: 'muerte-con-gatito',
    imagenes: ['muerte-con-gatito'],
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
    correo: 'vendedor.foreverink@gmail.com', password: 'Venta#123', telefono: '+56955556666',
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
    correo: 'joaquin.araya@gmail.com', password: 'Cliente#1', telefono: '+56966667777',
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
  return {
    productoId, nombre: p.nombre, imagen: p.imagen, categoriaId: p.categoriaId, precio, cantidad,
    anchoCm: p.anchoCm, altoCm: p.altoCm,
  };
}

// Fechas relativas a HOY, para que siempre existan reservas futuras con las que probar
// el reembolso y el cambio de fecha (si fueran fijas, con el tiempo quedarían en el pasado).
function fechaLocal(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Primer día de atención (martes a sábado) a partir de "dentro de N días". */
function diaDeAtencionEn(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  while (fecha.getDay() === 0 || fecha.getDay() === 1) fecha.setDate(fecha.getDate() + 1);
  return fechaLocal(fecha);
}

function compraHace(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return `${fechaLocal(fecha)}T10:30:00`;
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
  // Reservas futuras del cliente demo: sirven para probar el reembolso y el cambio de fecha.
  orden(10, 3, compraHace(2), 'Pagada', [linea(3)],
    { fecha: diaDeAtencionEn(14), hora: '14:00', tatuadorId: 2, zonaCuerpo: 'Antebrazo derecho', indicaciones: '' }),
  orden(11, 3, compraHace(1), 'Pagada', [linea(7)],
    { fecha: diaDeAtencionEn(21), hora: '11:00', tatuadorId: 1, zonaCuerpo: 'Tobillo', indicaciones: 'Lo quiero un poco más chico' }),
];

// ----------------------------------------------------------------------------
// INSUMOS: todo lo que el estudio tiene en bodega. ESTOS sí se acaban, por eso tienen stock.
//  - stock        = cantidad que queda en bodega
//  - stockCritico = si el stock baja a este número (o menos), el panel muestra una alerta
//  - aLaVenta     = true si el cliente lo puede comprar en la Tienda (cuidado del tatuaje y gift cards);
//                   en ese caso también tiene precio, descripción e imagen. Las tintas y agujas no se venden.
// ----------------------------------------------------------------------------
const interno = (id, nombre, tipo, unidad, stock, stockCritico) => ({
  id, codigo: `IN-${String(id).padStart(3, '0')}`, nombre, tipo, unidad, stock, stockCritico,
  aLaVenta: false, precio: 0, descripcion: '', imagen: '',
});
const venta = (id, nombre, tipo, unidad, stock, stockCritico, precio, imagen, descripcion) => ({
  ...interno(id, nombre, tipo, unidad, stock, stockCritico), aLaVenta: true, precio, imagen, descripcion,
});

const INSUMOS = [
  interno(1, 'Tinta negra (30 ml)', 'Tinta', 'frascos', 8, 3),
  interno(2, 'Tinta gris (30 ml)', 'Tinta', 'frascos', 2, 2),
  interno(3, 'Tinta roja (30 ml)', 'Tinta', 'frascos', 4, 2),
  interno(4, 'Agujas de línea 3RL', 'Agujas', 'cajas', 1, 2),
  interno(5, 'Agujas de relleno 7M1', 'Agujas', 'cajas', 5, 2),
  interno(6, 'Guantes de nitrilo', 'Higiene', 'cajas', 6, 3),
  interno(7, 'Film protector (uso del estudio)', 'Higiene', 'rollos', 3, 2),
  venta(8, 'Crema cicatrizante 50 ml', 'Cuidado posterior', 'unidades', 12, 5, 8990, 'tienda-crema',
    'Hidrata y ayuda a cicatrizar. Aplica una capa delgada 2 a 3 veces al día durante dos semanas.'),
  venta(9, 'Jabón neutro para tatuajes', 'Cuidado posterior', 'unidades', 10, 4, 5990, 'tienda-jabon',
    'Sin perfume ni alcohol. Lava el tatuaje con agua tibia y sécalo con toques suaves.'),
  venta(10, 'Film de segunda piel (5 parches)', 'Cuidado posterior', 'cajas', 3, 3, 6990, 'tienda-film',
    'Parches transparentes y respirables para proteger el tatuaje los primeros días.'),
  venta(11, 'Bálsamo humectante 30 g', 'Cuidado posterior', 'unidades', 7, 3, 7490, 'tienda-balsamo',
    'Mantiene la piel suave una vez que el tatuaje terminó de cicatrizar.'),
  venta(12, 'Protector solar para tatuajes SPF 50', 'Cuidado posterior', 'unidades', 6, 2, 12990, 'tienda-protector',
    'El sol es lo que más destiñe un tatuaje. Úsalo cuando ya esté cicatrizado.'),
  venta(13, 'Kit de cuidado completo', 'Cuidado posterior', 'kits', 4, 2, 24990, 'tienda-kit',
    'Jabón, crema cicatrizante, bálsamo y film: todo lo necesario para el primer mes.'),
  venta(14, 'Gift card $20.000', 'Gift card', 'tarjetas', 30, 5, 20000, 'tienda-giftcard',
    'Regala un tatuaje o productos de cuidado. Vale para cualquier reserva o compra en el estudio.'),
  venta(15, 'Gift card $50.000', 'Gift card', 'tarjetas', 20, 5, 50000, 'tienda-giftcard',
    'Regala un tatuaje o productos de cuidado. Vale para cualquier reserva o compra en el estudio.'),
  venta(16, 'Gift card $100.000', 'Gift card', 'tarjetas', 10, 3, 100000, 'tienda-giftcard',
    'Ideal para una pieza grande. Vale para cualquier reserva o compra en el estudio.'),
];

// ----------------------------------------------------------------------------
// RESEÑAS de clientes: estrellas de 1 (la peor) a 5 (la mejor), comentario y foto opcional.
// La foto puede ser una key de images.js (datos de ejemplo) o una imagen subida por el cliente.
// ----------------------------------------------------------------------------
const RESENAS = [
  { id: 1, usuarioId: 4, nombre: 'Camila F.', estrellas: 5, fecha: '2026-08-23',
    comentario: 'Me tatué el panda con globo y quedó idéntico al diseño. El estudio es súper limpio y me explicaron todos los cuidados.',
    imagen: '', disenoId: 1 },
  { id: 2, usuarioId: 5, nombre: 'Joaquín A.', estrellas: 4, fecha: '2026-09-06',
    comentario: 'Era mi primer tatuaje y estaba nervioso, pero me trataron muy bien. Solo tuve que esperar unos 15 minutos.',
    imagen: '', disenoId: null },
  { id: 3, usuarioId: 6, nombre: 'Antonia M.', estrellas: 5, fecha: '2026-09-20',
    comentario: 'El sol y la luna entre nubes en la espalda quedaron preciosos. Volvería sin pensarlo.',
    imagen: '', disenoId: null },
  { id: 4, usuarioId: 7, nombre: 'Tomás R.', estrellas: 3, fecha: '2026-10-04',
    comentario: 'El tatuaje quedó bien, pero me hubiera gustado que me avisaran antes de un cambio de horario.',
    imagen: '', disenoId: null },
];

// ----------------------------------------------------------------------------
// MI PROYECTO: ideas propias que envían los clientes. El estudio responde en 3 días hábiles.
// ----------------------------------------------------------------------------
const PROYECTOS = [
  { id: 1, nombre: 'Fernanda Rojas', correo: 'fernanda.rojas@gmail.com', zonaCuerpo: 'Muñeca', lado: 'Izquierdo',
    idea: 'Quiero el nombre de mi perrita con una huellita al lado, en letra fina.', imagen: '',
    fecha: '2026-11-16', contactarAntesDe: '2026-11-19', estado: 'Contactado', usuarioId: null },
];

export const SEMILLA = {
  categorias: CATEGORIAS,
  productos: PRODUCTOS,
  insumos: INSUMOS,
  resenas: RESENAS,
  proyectos: PROYECTOS,
  usuarios: USUARIOS,
  ordenes: ORDENES,
  mensajes: [],
};
