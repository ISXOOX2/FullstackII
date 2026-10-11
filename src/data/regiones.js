// Arreglo de regiones y comunas de Chile (complemento del formulario de registro).
// Al cambiar la región en el formulario, la lista de comunas se actualiza con este arreglo.

export const REGIONES = [
  { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { nombre: 'Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'] },
  { nombre: 'Antofagasta', comunas: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones'] },
  { nombre: 'Atacama', comunas: ['Copiapó', 'Vallenar', 'Chañaral', 'Caldera'] },
  { nombre: 'Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'] },
  { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'San Antonio'] },
  {
    nombre: 'Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'Puente Alto', 'La Florida', 'Ñuñoa'],
  },
  {
    nombre: "Libertador General Bernardo O'Higgins",
    comunas: ['Rancagua', 'San Fernando', 'Rengo', 'Machalí'],
  },
  { nombre: 'Maule', comunas: ['Talca', 'Curicó', 'Linares', 'Constitución'] },
  { nombre: 'Ñuble', comunas: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes'] },
  { nombre: 'Biobío', comunas: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chiguayante'] },
  { nombre: 'La Araucanía', comunas: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol'] },
  { nombre: 'Los Ríos', comunas: ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'] },
  { nombre: 'Los Lagos', comunas: ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas'] },
  {
    nombre: 'Aysén del General Carlos Ibáñez del Campo',
    comunas: ['Coyhaique', 'Aysén', 'Chile Chico', 'Cochrane'],
  },
  {
    nombre: 'Magallanes y de la Antártica Chilena',
    comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos'],
  },
];

/** Devuelve las comunas de una región (por nombre). Si no existe, devuelve un arreglo vacío. */
export function comunasDeRegion(nombreRegion) {
  const region = REGIONES.find((r) => r.nombre === nombreRegion);
  return region ? region.comunas : [];
}
