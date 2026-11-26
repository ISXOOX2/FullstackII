// Imágenes del proyecto (diapositiva "React III: importar imágenes correctamente").
//
// En React no se usan rutas directas como en HTML: cada imagen se importa desde src/assets
// y se usa como una variable. Para no repetir estos imports en cada componente, se juntan
// aquí en un solo objeto, igual que el archivo images.js de la diapositiva.
//
// Uso:  import images from '../../assets/images.js';
//       <img src={images.logo} alt="Logo" />
//       <img src={images['panda-globo-corazon']} alt="Diseño Panda con globo" />

import cuidados from './images/blog/cuidados.jpg';
import logo from './images/marca/logo.svg';
import portada1 from './images/portadas/portada-1.svg';
import portada2 from './images/portadas/portada-2.svg';
import portada3 from './images/portadas/portada-3.svg';
import primerTatuaje from './images/blog/primer-tatuaje.jpg';
import pandaGloboCorazon from './images/disenos/panda-globo-corazon.jpg';
import gatoHada from './images/disenos/gato-hada.jpg';
import trioFantasma from './images/disenos/trio-fantasma.jpg';
import sukuna from './images/disenos/sukuna.jpg';
import choso from './images/disenos/choso.jpg';
import zorroKitsune from './images/disenos/zorro-kitsune.jpg';
import manoHannya from './images/disenos/mano-hannya.jpg';
import hannyaKatana from './images/disenos/hannya-katana.jpg';
import aceLettering from './images/disenos/ace-lettering.jpg';
import cruzCromada from './images/disenos/cruz-cromada.jpg';
import tribalCruzLumbar from './images/disenos/tribal-cruz-lumbar.jpg';
import estrellasTribales from './images/disenos/estrellas-tribales.jpg';
import alasTribales from './images/disenos/alas-tribales.jpg';
import aranaTribal from './images/disenos/arana-tribal.jpg';
import gatosLuna from './images/disenos/gatos-luna.jpg';
import solYLunaNubes from './images/disenos/sol-y-luna-nubes.jpg';
import alasLunaEspada from './images/disenos/alas-luna-espada.jpg';
import angelEstrellas from './images/disenos/angel-estrellas.jpg';
import alasEspada from './images/disenos/alas-espada.jpg';
import espadaTelarana from './images/disenos/espada-telarana.jpg';
import manosFluidas from './images/disenos/manos-fluidas.jpg';
import murcielagosEspinosos from './images/disenos/murcielagos-espinosos.jpg';
import alasOjo from './images/disenos/alas-ojo.jpg';
import guerreraLanza from './images/disenos/guerrera-lanza.jpg';
import ojosEspinosos from './images/disenos/ojos-espinosos.jpg';
import gatoEsqueleto from './images/disenos/gato-esqueleto.jpg';
import lunaChorreante from './images/disenos/luna-chorreante.jpg';
import espadaAlasAfiladas from './images/disenos/espada-alas-afiladas.jpg';
import corazonEspinas from './images/disenos/corazon-espinas.jpg';
import muerteConGatito from './images/disenos/muerte-con-gatito.jpg';
// Artículos de la tienda (cuidado del tatuaje y gift cards)
import tiendaBalsamo from './images/tienda/balsamo.svg';
import tiendaCrema from './images/tienda/crema.svg';
import tiendaFilm from './images/tienda/film.svg';
import tiendaGiftcard from './images/tienda/giftcard.svg';
import tiendaJabon from './images/tienda/jabon.svg';
import tiendaKit from './images/tienda/kit.svg';
import tiendaProtector from './images/tienda/protector.svg';

// La key es el nombre del archivo sin extensión: así se guarda en la base de datos simulada.
const images = {
  'panda-globo-corazon': pandaGloboCorazon,
  'gato-hada': gatoHada,
  'trio-fantasma': trioFantasma,
  'sukuna': sukuna,
  'choso': choso,
  'zorro-kitsune': zorroKitsune,
  'mano-hannya': manoHannya,
  'hannya-katana': hannyaKatana,
  'ace-lettering': aceLettering,
  'cruz-cromada': cruzCromada,
  'tribal-cruz-lumbar': tribalCruzLumbar,
  'estrellas-tribales': estrellasTribales,
  'alas-tribales': alasTribales,
  'arana-tribal': aranaTribal,
  'gatos-luna': gatosLuna,
  'sol-y-luna-nubes': solYLunaNubes,
  'alas-luna-espada': alasLunaEspada,
  'angel-estrellas': angelEstrellas,
  'alas-espada': alasEspada,
  'espada-telarana': espadaTelarana,
  'manos-fluidas': manosFluidas,
  'murcielagos-espinosos': murcielagosEspinosos,
  'alas-ojo': alasOjo,
  'guerrera-lanza': guerreraLanza,
  'ojos-espinosos': ojosEspinosos,
  'gato-esqueleto': gatoEsqueleto,
  'luna-chorreante': lunaChorreante,
  'espada-alas-afiladas': espadaAlasAfiladas,
  'corazon-espinas': corazonEspinas,
  'muerte-con-gatito': muerteConGatito,
  'cuidados': cuidados,
  'logo': logo,
  'portada-1': portada1,
  'portada-2': portada2,
  'portada-3': portada3,
  'primer-tatuaje': primerTatuaje,
  'tienda-balsamo': tiendaBalsamo,
  'tienda-crema': tiendaCrema,
  'tienda-film': tiendaFilm,
  'tienda-giftcard': tiendaGiftcard,
  'tienda-jabon': tiendaJabon,
  'tienda-kit': tiendaKit,
  'tienda-protector': tiendaProtector,
};

export default images;
