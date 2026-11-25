import { useEffect, useState } from 'react';
import { BLOGS } from '../data/blogs.js';
import { USAR_API, mensajeDeError } from '../services/api.js';
import { REFRESCO_BLOG_MS, listarArticulos } from '../services/blogService.js';

/**
 * Hook personalizado: lista de artículos del blog que se ACTUALIZA SOLA.
 *  - Pide los artículos a la API al montar la página (useEffect).
 *  - Los vuelve a pedir cada `intervalo` ms (setInterval) y cuando la persona vuelve a la pestaña.
 *  - Si la API no responde, mantiene lo último que tenía (o los artículos guardados) y avisa.
 *  - Al salir de la página limpia el intervalo para no dejar procesos corriendo.
 */
export default function useArticulos(intervalo = REFRESCO_BLOG_MS) {
  const [articulos, setArticulos] = useState(USAR_API ? [] : BLOGS);
  const [cargando, setCargando] = useState(USAR_API);
  const [error, setError] = useState('');
  const [actualizado, setActualizado] = useState(null);

  useEffect(() => {
    if (!USAR_API) return undefined; // sin backend no hay nada que refrescar
    let activo = true;

    const cargar = async () => {
      try {
        const datos = await listarArticulos();
        if (!activo) return;
        setArticulos(datos);
        setError('');
        setActualizado(new Date());
      } catch (e) {
        if (!activo) return;
        setError(mensajeDeError(e));
        setArticulos((anteriores) => (anteriores.length > 0 ? anteriores : BLOGS));
      } finally {
        if (activo) setCargando(false);
      }
    };

    const alVolverALaPestana = () => {
      if (document.visibilityState === 'visible') cargar();
    };

    cargar();
    const temporizador = setInterval(cargar, intervalo);
    document.addEventListener('visibilitychange', alVolverALaPestana);
    return () => {
      activo = false;
      clearInterval(temporizador);
      document.removeEventListener('visibilitychange', alVolverALaPestana);
    };
  }, [intervalo]);

  return { articulos, cargando, error, actualizado };
}
