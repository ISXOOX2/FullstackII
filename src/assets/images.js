// Imágenes del proyecto (diapositiva "React III: importar imágenes correctamente").
//
// En React no se usan rutas directas como en HTML: cada imagen se importa desde src/assets
// y se usa como una variable. Para no repetir estos imports en cada componente, se juntan
// aquí en un solo objeto, igual que el archivo images.js de la diapositiva.
//
// Uso:  import images from '../../assets/images.js';
//       <img src={images.logo} alt="Logo" />
//       <img src={images['mariposa-lineal']} alt="Diseño Mariposa lineal" />

import anclaFina from './images/disenos/ancla-fina.svg';
import anclaFinaCuerpo from './images/disenos/ancla-fina-cuerpo.svg';
import constelacion from './images/disenos/constelacion.svg';
import constelacionCuerpo from './images/disenos/constelacion-cuerpo.svg';
import cuboIsometrico from './images/disenos/cubo-isometrico.svg';
import cuboIsometricoCuerpo from './images/disenos/cubo-isometrico-cuerpo.svg';
import cuidados from './images/blog/cuidados.svg';
import fasesLunares from './images/disenos/fases-lunares.svg';
import fasesLunaresCuerpo from './images/disenos/fases-lunares-cuerpo.svg';
import helechoSilvestre from './images/disenos/helecho-silvestre.svg';
import helechoSilvestreCuerpo from './images/disenos/helecho-silvestre-cuerpo.svg';
import logo from './images/marca/logo.svg';
import mandalaDePuntos from './images/disenos/mandala-de-puntos.svg';
import mandalaDePuntosCuerpo from './images/disenos/mandala-de-puntos-cuerpo.svg';
import mariposaLineal from './images/disenos/mariposa-lineal.svg';
import mariposaLinealCuerpo from './images/disenos/mariposa-lineal-cuerpo.svg';
import montanaGeometrica from './images/disenos/montana-geometrica.svg';
import montanaGeometricaCuerpo from './images/disenos/montana-geometrica-cuerpo.svg';
import olaMinimalista from './images/disenos/ola-minimalista.svg';
import olaMinimalistaCuerpo from './images/disenos/ola-minimalista-cuerpo.svg';
import portada1 from './images/portadas/portada-1.svg';
import portada2 from './images/portadas/portada-2.svg';
import portada3 from './images/portadas/portada-3.svg';
import primerTatuaje from './images/blog/primer-tatuaje.svg';
import ramaDeOlivo from './images/disenos/rama-de-olivo.svg';
import ramaDeOlivoCuerpo from './images/disenos/rama-de-olivo-cuerpo.svg';
import ramilleteDeLavanda from './images/disenos/ramillete-de-lavanda.svg';
import ramilleteDeLavandaCuerpo from './images/disenos/ramillete-de-lavanda-cuerpo.svg';
import solYRayos from './images/disenos/sol-y-rayos.svg';
import solYRayosCuerpo from './images/disenos/sol-y-rayos-cuerpo.svg';

// La key es el nombre del archivo sin extensión: así se guarda en la base de datos simulada.
const images = {
  'ancla-fina': anclaFina,
  'ancla-fina-cuerpo': anclaFinaCuerpo,
  'constelacion': constelacion,
  'constelacion-cuerpo': constelacionCuerpo,
  'cubo-isometrico': cuboIsometrico,
  'cubo-isometrico-cuerpo': cuboIsometricoCuerpo,
  'cuidados': cuidados,
  'fases-lunares': fasesLunares,
  'fases-lunares-cuerpo': fasesLunaresCuerpo,
  'helecho-silvestre': helechoSilvestre,
  'helecho-silvestre-cuerpo': helechoSilvestreCuerpo,
  'logo': logo,
  'mandala-de-puntos': mandalaDePuntos,
  'mandala-de-puntos-cuerpo': mandalaDePuntosCuerpo,
  'mariposa-lineal': mariposaLineal,
  'mariposa-lineal-cuerpo': mariposaLinealCuerpo,
  'montana-geometrica': montanaGeometrica,
  'montana-geometrica-cuerpo': montanaGeometricaCuerpo,
  'ola-minimalista': olaMinimalista,
  'ola-minimalista-cuerpo': olaMinimalistaCuerpo,
  'portada-1': portada1,
  'portada-2': portada2,
  'portada-3': portada3,
  'primer-tatuaje': primerTatuaje,
  'rama-de-olivo': ramaDeOlivo,
  'rama-de-olivo-cuerpo': ramaDeOlivoCuerpo,
  'ramillete-de-lavanda': ramilleteDeLavanda,
  'ramillete-de-lavanda-cuerpo': ramilleteDeLavandaCuerpo,
  'sol-y-rayos': solYRayos,
  'sol-y-rayos-cuerpo': solYRayosCuerpo,
};

export default images;
