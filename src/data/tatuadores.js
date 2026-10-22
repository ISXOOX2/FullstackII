// Equipo del estudio. Todos tatúan los cinco estilos del catálogo; el cliente elige con quién
// agendar su cita en el checkout.

export const TATUADORES = [
  {
    id: 1,
    nombre: 'Isabel Cántaro',
    especialidad: 'Todos los estilos',
    descripcion: 'Te ayuda a elegir el diseño, el tamaño y la zona ideal para tu tatuaje.',
  },
  {
    id: 2,
    nombre: 'Eduardo Caro',
    especialidad: 'Todos los estilos',
    descripcion: 'Cuida que cada línea quede limpia y que tu tatuaje se vea bien por muchos años.',
  },
  {
    id: 3,
    nombre: 'Yeremi Vásquez',
    especialidad: 'Todos los estilos',
    descripcion: 'Adapta los diseños del catálogo a tu cuerpo y a tu estilo personal.',
  },
];

export function nombreTatuador(id) {
  const t = TATUADORES.find((x) => x.id === Number(id));
  return t ? t.nombre : 'Por asignar';
}
