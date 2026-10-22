// Equipo de tatuadores del estudio. El cliente elige uno al agendar su cita.

export const TATUADORES = [
  {
    id: 1,
    nombre: 'Cami Reyes',
    especialidad: 'Kawaii y anime',
    descripcion:
      'Fan del manga desde siempre. Dibuja personajes tiernos y escenas con mucha expresión, en trazo limpio y negro.',
    experiencia: '7 años',
  },
  {
    id: 2,
    nombre: 'Mati Soto',
    especialidad: 'Tribal Y2K y cybersigilism',
    descripcion:
      'Domina el negro sólido de los tribales y las líneas afiladas y simétricas del cybersigilism. Ideal para piezas medianas y grandes.',
    experiencia: '9 años',
  },
  {
    id: 3,
    nombre: 'Fran Ortiz',
    especialidad: 'Celestial y japonés',
    descripcion:
      'Lunas, estrellas, olas y portales torii: diseños delicados que envejecen muy bien con el tiempo.',
    experiencia: '5 años',
  },
];

export function nombreTatuador(id) {
  const t = TATUADORES.find((x) => x.id === Number(id));
  return t ? t.nombre : 'Por asignar';
}
