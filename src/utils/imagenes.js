// Lee una imagen del dispositivo del cliente y la convierte en texto (data URL) para poder
// guardarla en localStorage junto a la reseña o al proyecto. Antes se valida tipo y peso.
import { validarArchivoImagen } from './validaciones.js';

/** Devuelve una promesa con { dataUrl, error }. Nunca lanza: si algo falla viene el error. */
export function leerImagen(archivo) {
  const error = validarArchivoImagen(archivo);
  if (error || !archivo) return Promise.resolve({ dataUrl: '', error });
  return new Promise((resolver) => {
    const lector = new FileReader();
    lector.onload = () => resolver({ dataUrl: String(lector.result), error: '' });
    lector.onerror = () => resolver({ dataUrl: '', error: 'No se pudo leer la imagen. Prueba con otra.' });
    lector.readAsDataURL(archivo);
  });
}

/** Una imagen guardada puede ser una key de images.js (datos de ejemplo) o un data URL subido. */
export function fuenteImagen(imagen, images) {
  if (!imagen) return '';
  return imagen.startsWith('data:') ? imagen : images[imagen] || '';
}
