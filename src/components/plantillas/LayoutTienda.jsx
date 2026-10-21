import { Outlet } from 'react-router-dom';
import BarraNavegacion from '../organismos/BarraNavegacion.jsx';
import PieDePagina from '../organismos/PieDePagina.jsx';

/**
 * PLANTILLA · Estructura común de las páginas de la tienda (Atomic Design, nivel 4).
 *
 * Igual que en la clase "React II: React Router + Bootstrap": la cabecera y el pie quedan
 * fijos y solo cambia el contenido central. <Outlet /> es el lugar donde React Router dibuja
 * la página de la ruta actual (Home, Productos, Contacto…).
 */
export default function LayoutTienda() {
  return (
    <>
      <a href="#contenido" className="visually-hidden-focusable saltar-contenido d-print-none">Saltar al contenido</a>
      <BarraNavegacion />
      <main id="contenido">
        <Outlet />
      </main>
      <PieDePagina />
    </>
  );
}
