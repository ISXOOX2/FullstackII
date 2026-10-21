// Contenido del blog (noticias y datos curiosos). Son contenidos fijos, por eso no
// están en la "base de datos" sino en este arreglo.

export const BLOGS = [
  {
    id: 1,
    titulo: 'Cuidados después de tatuarte: guía de las primeras cuatro semanas',
    resumen:
      'Lo que haces los primeros días decide cómo queda el tatuaje para siempre. Te contamos paso a paso cómo cuidarlo.',
    imagen: 'cuidados',
    fecha: '2026-09-18',
    autor: 'Equipo Forever Ink',
    etiqueta: 'Cuidados',
    contenido: [
      { tipo: 'p', texto: 'Un tatuaje es una herida controlada: la piel necesita entre dos y cuatro semanas para cerrar por completo. Seguir una rutina simple de cuidado marca la diferencia entre una línea nítida y un trazo borroso.' },
      { tipo: 'h', texto: 'Las primeras horas' },
      { tipo: 'p', texto: 'Tu tatuador cubrirá la zona con un film o apósito. Déjalo puesto el tiempo que él te indique (normalmente entre dos y cuatro horas). Cuando lo retires, lava con agua tibia y jabón neutro sin perfume, con las manos limpias, y seca con toques suaves usando una toalla de papel.' },
      { tipo: 'h', texto: 'Los primeros días' },
      { tipo: 'p', texto: 'Aplica una capa muy fina de crema hidratante sin perfume, dos o tres veces al día. Menos es más: una capa gruesa impide que la piel respire. Usa ropa holgada y evita que el roce irrite la zona.' },
      { tipo: 'h', texto: 'Qué evitar durante tres semanas' },
      { tipo: 'p', texto: 'No expongas el tatuaje al sol directo, la piscina, el mar ni las saunas. Tampoco te rasques ni arranques las costritas: aunque piquen, deben caerse solas. Si el picor molesta, un golpecito suave sobre la zona ayuda.' },
      { tipo: 'h', texto: 'Cuándo consultar' },
      { tipo: 'p', texto: 'Si notas enrojecimiento que se extiende, calor intenso, pus o fiebre, consulta con un profesional de salud. Y recuerda: estas recomendaciones son generales; siempre prevalecen las indicaciones de tu tatuador.' },
    ],
  },
  {
    id: 2,
    titulo: 'Cómo elegir tu primer tatuaje sin arrepentirte',
    resumen:
      'Estilo, tamaño, ubicación y presupuesto: cinco preguntas que conviene responder antes de sentarte en la camilla.',
    imagen: 'primer-tatuaje',
    fecha: '2026-09-30',
    autor: 'Equipo Forever Ink',
    etiqueta: 'Guía',
    contenido: [
      { tipo: 'p', texto: 'Elegir el primer tatuaje da vértigo, y es normal. La buena noticia es que casi todas las decisiones se pueden ordenar con unas pocas preguntas.' },
      { tipo: 'h', texto: '1. ¿Qué significa para ti?' },
      { tipo: 'p', texto: 'No hace falta que tenga una gran historia, pero sí que te represente hoy y dentro de diez años. Haz una lista corta de tres ideas y déjala reposar una semana: si sigues pensando en la misma, es una buena señal.' },
      { tipo: 'h', texto: '2. ¿Qué estilo va con la idea?' },
      { tipo: 'p', texto: 'El fineline es delicado y muy popular en piezas pequeñas; el geométrico y el dotwork piden simetría y orden; el botánico funciona en casi cualquier zona. Revisa el portafolio del tatuador antes de reservar.' },
      { tipo: 'h', texto: '3. Tamaño y ubicación' },
      { tipo: 'p', texto: 'Los detalles muy finos pierden definición si el tatuaje es demasiado pequeño. Además, el dolor cambia según la zona: antebrazo y hombro suelen ser más llevaderos que costillas o pies.' },
      { tipo: 'h', texto: '4. Higiene y seguridad' },
      { tipo: 'p', texto: 'Exige agujas nuevas y selladas, guantes, superficies protegidas y un estudio que te explique los cuidados posteriores. Si algo te hace dudar, puedes irte: nunca es tarde para cambiar de opinión.' },
      { tipo: 'h', texto: '5. Presupuesto' },
      { tipo: 'p', texto: 'Un buen tatuaje no es barato, y uno barato rara vez es bueno. Reserva con tiempo, pregunta qué incluye el precio y deja un margen para eventuales retoques.' },
    ],
  },
];

export function obtenerBlog(id) {
  return BLOGS.find((b) => b.id === Number(id)) || null;
}
