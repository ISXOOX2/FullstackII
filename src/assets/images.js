// Imágenes del proyecto (diapositiva "React III: importar imágenes correctamente").
//
// En React no se usan rutas directas como en HTML: cada imagen se importa desde src/assets
// y se usa como una variable. Para no repetir estos imports en cada componente, se juntan
// aquí en un solo objeto, igual que el archivo images.js de la diapositiva.
//
// Uso:  import images from '../../assets/images.js';
//       <img src={images.logo} alt="Logo" />
//       <img src={images['neko-chibi']} alt="Diseño Neko chibi" />

import alasSigilo from './images/disenos/alas-sigilo.svg';
import alasSigiloCuerpo from './images/disenos/alas-sigilo-cuerpo.svg';
import bobaKawaii from './images/disenos/boba-kawaii.svg';
import bobaKawaiiCuerpo from './images/disenos/boba-kawaii-cuerpo.svg';
import brazaleteTribal from './images/disenos/brazalete-tribal.svg';
import brazaleteTribalCuerpo from './images/disenos/brazalete-tribal-cuerpo.svg';
import constelacion from './images/disenos/constelacion.svg';
import constelacionCuerpo from './images/disenos/constelacion-cuerpo.svg';
import corazonTribal from './images/disenos/corazon-tribal.svg';
import corazonTribalCuerpo from './images/disenos/corazon-tribal-cuerpo.svg';
import coronaAfilada from './images/disenos/corona-afilada.svg';
import coronaAfiladaCuerpo from './images/disenos/corona-afilada-cuerpo.svg';
import cuidados from './images/blog/cuidados.svg';
import dagaSigilo from './images/disenos/daga-sigilo.svg';
import dagaSigiloCuerpo from './images/disenos/daga-sigilo-cuerpo.svg';
import destellos from './images/disenos/destellos.svg';
import destellosCuerpo from './images/disenos/destellos-cuerpo.svg';
import estrellaTribal from './images/disenos/estrella-tribal.svg';
import estrellaTribalCuerpo from './images/disenos/estrella-tribal-cuerpo.svg';
import fasesLunares from './images/disenos/fases-lunares.svg';
import fasesLunaresCuerpo from './images/disenos/fases-lunares-cuerpo.svg';
import florTribal from './images/disenos/flor-tribal.svg';
import florTribalCuerpo from './images/disenos/flor-tribal-cuerpo.svg';
import fresitaKawaii from './images/disenos/fresita-kawaii.svg';
import fresitaKawaiiCuerpo from './images/disenos/fresita-kawaii-cuerpo.svg';
import haloRoto from './images/disenos/halo-roto.svg';
import haloRotoCuerpo from './images/disenos/halo-roto-cuerpo.svg';
import katanaSakura from './images/disenos/katana-sakura.svg';
import katanaSakuraCuerpo from './images/disenos/katana-sakura-cuerpo.svg';
import logo from './images/marca/logo.svg';
import lunaYEstrellas from './images/disenos/luna-y-estrellas.svg';
import lunaYEstrellasCuerpo from './images/disenos/luna-y-estrellas-cuerpo.svg';
import mariposaTribal from './images/disenos/mariposa-tribal.svg';
import mariposaTribalCuerpo from './images/disenos/mariposa-tribal-cuerpo.svg';
import mascaraKitsune from './images/disenos/mascara-kitsune.svg';
import mascaraKitsuneCuerpo from './images/disenos/mascara-kitsune-cuerpo.svg';
import nekoChibi from './images/disenos/neko-chibi.svg';
import nekoChibiCuerpo from './images/disenos/neko-chibi-cuerpo.svg';
import nubecitaDormilona from './images/disenos/nubecita-dormilona.svg';
import nubecitaDormilonaCuerpo from './images/disenos/nubecita-dormilona-cuerpo.svg';
import ojosAnime from './images/disenos/ojos-anime.svg';
import ojosAnimeCuerpo from './images/disenos/ojos-anime-cuerpo.svg';
import olaYSol from './images/disenos/ola-y-sol.svg';
import olaYSolCuerpo from './images/disenos/ola-y-sol-cuerpo.svg';
import onigiriFeliz from './images/disenos/onigiri-feliz.svg';
import onigiriFelizCuerpo from './images/disenos/onigiri-feliz-cuerpo.svg';
import portada1 from './images/portadas/portada-1.svg';
import portada2 from './images/portadas/portada-2.svg';
import portada3 from './images/portadas/portada-3.svg';
import primerTatuaje from './images/blog/primer-tatuaje.svg';
import sigiloEspina from './images/disenos/sigilo-espina.svg';
import sigiloEspinaCuerpo from './images/disenos/sigilo-espina-cuerpo.svg';
import solYRayos from './images/disenos/sol-y-rayos.svg';
import solYRayosCuerpo from './images/disenos/sol-y-rayos-cuerpo.svg';
import toriiLuna from './images/disenos/torii-luna.svg';
import toriiLunaCuerpo from './images/disenos/torii-luna-cuerpo.svg';

// La key es el nombre del archivo sin extensión: así se guarda en la base de datos simulada.
const images = {
  'alas-sigilo': alasSigilo,
  'alas-sigilo-cuerpo': alasSigiloCuerpo,
  'boba-kawaii': bobaKawaii,
  'boba-kawaii-cuerpo': bobaKawaiiCuerpo,
  'brazalete-tribal': brazaleteTribal,
  'brazalete-tribal-cuerpo': brazaleteTribalCuerpo,
  'constelacion': constelacion,
  'constelacion-cuerpo': constelacionCuerpo,
  'corazon-tribal': corazonTribal,
  'corazon-tribal-cuerpo': corazonTribalCuerpo,
  'corona-afilada': coronaAfilada,
  'corona-afilada-cuerpo': coronaAfiladaCuerpo,
  'cuidados': cuidados,
  'daga-sigilo': dagaSigilo,
  'daga-sigilo-cuerpo': dagaSigiloCuerpo,
  'destellos': destellos,
  'destellos-cuerpo': destellosCuerpo,
  'estrella-tribal': estrellaTribal,
  'estrella-tribal-cuerpo': estrellaTribalCuerpo,
  'fases-lunares': fasesLunares,
  'fases-lunares-cuerpo': fasesLunaresCuerpo,
  'flor-tribal': florTribal,
  'flor-tribal-cuerpo': florTribalCuerpo,
  'fresita-kawaii': fresitaKawaii,
  'fresita-kawaii-cuerpo': fresitaKawaiiCuerpo,
  'halo-roto': haloRoto,
  'halo-roto-cuerpo': haloRotoCuerpo,
  'katana-sakura': katanaSakura,
  'katana-sakura-cuerpo': katanaSakuraCuerpo,
  'logo': logo,
  'luna-y-estrellas': lunaYEstrellas,
  'luna-y-estrellas-cuerpo': lunaYEstrellasCuerpo,
  'mariposa-tribal': mariposaTribal,
  'mariposa-tribal-cuerpo': mariposaTribalCuerpo,
  'mascara-kitsune': mascaraKitsune,
  'mascara-kitsune-cuerpo': mascaraKitsuneCuerpo,
  'neko-chibi': nekoChibi,
  'neko-chibi-cuerpo': nekoChibiCuerpo,
  'nubecita-dormilona': nubecitaDormilona,
  'nubecita-dormilona-cuerpo': nubecitaDormilonaCuerpo,
  'ojos-anime': ojosAnime,
  'ojos-anime-cuerpo': ojosAnimeCuerpo,
  'ola-y-sol': olaYSol,
  'ola-y-sol-cuerpo': olaYSolCuerpo,
  'onigiri-feliz': onigiriFeliz,
  'onigiri-feliz-cuerpo': onigiriFelizCuerpo,
  'portada-1': portada1,
  'portada-2': portada2,
  'portada-3': portada3,
  'primer-tatuaje': primerTatuaje,
  'sigilo-espina': sigiloEspina,
  'sigilo-espina-cuerpo': sigiloEspinaCuerpo,
  'sol-y-rayos': solYRayos,
  'sol-y-rayos-cuerpo': solYRayosCuerpo,
  'torii-luna': toriiLuna,
  'torii-luna-cuerpo': toriiLunaCuerpo,
};

export default images;
