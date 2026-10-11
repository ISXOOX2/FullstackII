// Imágenes de diseños disponibles para elegir en el mantenedor de productos.
export const IMAGENES_DISENO = [
  ['ancla-fina', 'Ancla fina'],
  ['constelacion', 'Constelación'],
  ['cubo-isometrico', 'Cubo isométrico'],
  ['fases-lunares', 'Fases lunares'],
  ['helecho-silvestre', 'Helecho silvestre'],
  ['mandala-de-puntos', 'Mandala de puntos'],
  ['mariposa-lineal', 'Mariposa lineal'],
  ['montana-geometrica', 'Montaña geométrica'],
  ['ola-minimalista', 'Ola minimalista'],
  ['rama-de-olivo', 'Rama de olivo'],
  ['ramillete-de-lavanda', 'Ramillete de lavanda'],
  ['sol-y-rayos', 'Sol y rayos'],
].map(([archivo, etiqueta]) => ({ valor: `img/disenos/${archivo}.svg`, etiqueta }));
