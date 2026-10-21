// Imágenes del proyecto (diapositiva "React III: importar imágenes correctamente").
//
// En React no se usan rutas directas como en HTML: las imágenes se importan desde src/assets.
// Para no escribir un import por cada imagen (aquí hay 30), Vite las importa todas juntas.
// La diapositiva usa import.meta.globEager(...); en las versiones actuales de Vite esa función
// se reemplazó por import.meta.glob(..., { eager: true }), que hace exactamente lo mismo.
//
// Uso:  import images from '../../assets/images.js';
//       <img src={images.logo} alt="Logo" />
//       <img src={images['mariposa-lineal']} alt="Diseño Mariposa lineal" />
const imagenes = import.meta.glob('./images/*.{png,jpg,jpeg,svg}', { eager: true });

const formattedImages = {};
for (const path in imagenes) {
  // Extraemos el nombre sin carpeta ni extensión y lo usamos como key
  const key = path
    .replace('./images/', '') // quitar la carpeta
    .replace(/\.[^/.]+$/, ''); // quitar extensión
  formattedImages[key] = imagenes[path].default;
}

export default formattedImages;
