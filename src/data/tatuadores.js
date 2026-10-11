// Equipo de tatuadores del estudio. El cliente elige uno al agendar su cita.

export const TATUADORES = [
  {
    id: 1,
    nombre: 'Cami Reyes',
    especialidad: 'Fineline y celestial',
    descripcion:
      'Trabaja con agujas de una sola punta y trazos casi imperceptibles. Le encantan los diseños pequeños y delicados.',
    experiencia: '7 años',
  },
  {
    id: 2,
    nombre: 'Mati Soto',
    especialidad: 'Geométrico y dotwork',
    descripcion:
      'Especialista en simetría, puntillismo y composiciones con mucho orden. Ideal para piezas medianas y grandes.',
    experiencia: '9 años',
  },
  {
    id: 3,
    nombre: 'Fran Ortiz',
    especialidad: 'Botánico y minimalista',
    descripcion:
      'Convierte ramas, hojas y símbolos simples en tatuajes limpios que envejecen muy bien con el tiempo.',
    experiencia: '5 años',
  },
];

export function nombreTatuador(id) {
  const t = TATUADORES.find((x) => x.id === Number(id));
  return t ? t.nombre : 'Por asignar';
}
