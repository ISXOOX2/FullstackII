import { Outlet } from 'react-router-dom';
import BarraNavegacion from '../organismos/BarraNavegacion.jsx';
import PieDePagina from '../organismos/PieDePagina.jsx';

/**
 * PLANTILLA · Estructura común de las páginas de la tienda (Atomic Design, nivel 4).
 *
 * Igual que en la clase "React II: React Router + Bootstrap": la cabecera y el pie quedan
 * fijos y solo cambia el contenido central. <Outlet /> es el lugar donde React Router dibuja
 * la página de la ruta actual (rutas anidadas, material 2.2.1).
 *
 * Props (vienen de App.jsx y se reparten a la cabecera y al pie):
 *  - usuario, onCerrarSesion : sesión actual.
 *  - total, cantidad         : resumen del carrito para la barra.
 *  - mostrarAviso            : para el formulario del boletín en el pie.
 */
export default function LayoutTienda({ usuario, onCerrarSesion, total, cantidad, mostrarAviso }) {
  return (
    <>
      <a href="#contenido" className="visually-hidden-focusable saltar-contenido d-print-none">Saltar al contenido</a>
      <BarraNavegacion usuario={usuario} onCerrarSesion={onCerrarSesion} total={total} cantidad={cantidad} />
      <main id="contenido">
        <Outlet />
      </main>
      <PieDePagina mostrarAviso={mostrarAviso} />
    </>
  );
}
