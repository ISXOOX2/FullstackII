// Imágenes del proyecto (diapositiva "React III: importar imágenes correctamente").
//
// En React no se usan rutas directas como en HTML: cada imagen se importa desde src/assets
// y se usa como una variable. Para no repetir estos imports en cada componente, se juntan
// aquí en un solo objeto, igual que el archivo images.js de la diapositiva.
//
// Uso:  import images from '../../assets/images.js';
//       <img src={images.logo} alt="Logo" />
//       <img src={images['mariposa-lineal']} alt="Diseño Mariposa lineal" />

import anclaFina from './images/ancla-fina.svg';
import anclaFinaCuerpo from './images/ancla-fina-cuerpo.svg';
import constelacion from './images/constelacion.svg';
import constelacionCuerpo from './images/constelacion-cuerpo.svg';
import cuboIsometrico from './images/cubo-isometrico.svg';
import cuboIsometricoCuerpo from './images/cubo-isometrico-cuerpo.svg';
import cuidados from './images/cuidados.svg';
import fasesLunares from './images/fases-lunares.svg';
import fasesLunaresCuerpo from './images/fases-lunares-cuerpo.svg';
import helechoSilvestre from './images/helecho-silvestre.svg';
import helechoSilvestreCuerpo from './images/helecho-silvestre-cuerpo.svg';
import logo from './images/logo.svg';
import mandalaDePuntos from './images/mandala-de-puntos.svg';
import mandalaDePuntosCuerpo from './images/mandala-de-puntos-cuerpo.svg';
import mariposaLineal from './images/mariposa-lineal.svg';
import mariposaLinealCuerpo from './images/mariposa-lineal-cuerpo.svg';
import montanaGeometrica from './images/montana-geometrica.svg';
import montanaGeometricaCuerpo from './images/montana-geometrica-cuerpo.svg';
import olaMinimalista from './images/ola-minimalista.svg';
import olaMinimalistaCuerpo from './images/ola-minimalista-cuerpo.svg';
import portada1 from './images/portada-1.svg';
import portada2 from './images/portada-2.svg';
import portada3 from './images/portada-3.svg';
import primerTatuaje from './images/primer-tatuaje.svg';
import ramaDeOlivo from './images/rama-de-olivo.svg';
import ramaDeOlivoCuerpo from './images/rama-de-olivo-cuerpo.svg';
import ramilleteDeLavanda from './images/ramillete-de-lavanda.svg';
import ramilleteDeLavandaCuerpo from './images/ramillete-de-lavanda-cuerpo.svg';
import solYRayos from './images/sol-y-rayos.svg';
import solYRayosCuerpo from './images/sol-y-rayos-cuerpo.svg';

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
