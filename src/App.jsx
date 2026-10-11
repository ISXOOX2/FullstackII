import { HashRouter, Outlet, Route, Routes } from 'react-router-dom';
import { SesionProvider } from './context/SesionContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AvisosProvider } from './context/AvisosContext.jsx';
import BarraNavegacion from './components/tienda/BarraNavegacion.jsx';
import PieDePagina from './components/tienda/PieDePagina.jsx';
import RutaProtegida from './components/comunes/RutaProtegida.jsx';
import ScrollArriba from './components/comunes/ScrollArriba.jsx';
import LayoutAdmin from './components/admin/LayoutAdmin.jsx';

import Home from './pages/tienda/Home.jsx';
import Productos from './pages/tienda/Productos.jsx';
import DetalleProducto from './pages/tienda/DetalleProducto.jsx';
import Categorias from './pages/tienda/Categorias.jsx';
import DetalleCategoria from './pages/tienda/DetalleCategoria.jsx';
import Ofertas from './pages/tienda/Ofertas.jsx';
import Carrito from './pages/tienda/Carrito.jsx';
import Checkout from './pages/tienda/Checkout.jsx';
import CompraExitosa from './pages/tienda/CompraExitosa.jsx';
import PagoFallido from './pages/tienda/PagoFallido.jsx';
import Login from './pages/tienda/Login.jsx';
import Registro from './pages/tienda/Registro.jsx';
import Nosotros from './pages/tienda/Nosotros.jsx';
import Blogs from './pages/tienda/Blogs.jsx';
import DetalleBlog from './pages/tienda/DetalleBlog.jsx';
import Contacto from './pages/tienda/Contacto.jsx';
import Perfil from './pages/tienda/Perfil.jsx';
import NoEncontrado from './pages/tienda/NoEncontrado.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import Ordenes from './pages/admin/Ordenes.jsx';
import DetalleOrden from './pages/admin/DetalleOrden.jsx';
import ProductosAdmin from './pages/admin/Productos.jsx';
import DetalleProductoAdmin from './pages/admin/DetalleProductoAdmin.jsx';
import FormularioProductoPagina from './pages/admin/FormularioProductoPagina.jsx';
import CategoriasAdmin from './pages/admin/Categorias.jsx';
import Usuarios from './pages/admin/Usuarios.jsx';
import FormularioUsuarioPagina from './pages/admin/FormularioUsuarioPagina.jsx';
import HistorialUsuario from './pages/admin/HistorialUsuario.jsx';
import Reportes from './pages/admin/Reportes.jsx';

/** Estructura común de las páginas de la tienda: cabecera, contenido y pie. */
function LayoutTienda() {
  return (
    <>
      <a href="#contenido" className="visually-hidden-focusable saltar-contenido">Saltar al contenido</a>
      <BarraNavegacion />
      <main id="contenido">
        <Outlet />
      </main>
      <PieDePagina />
    </>
  );
}

const SOLO_ADMIN = ['Administrador'];
const PERSONAL = ['Administrador', 'Vendedor'];

/** Todas las rutas del sitio (se separan de <App> para poder probarlas con MemoryRouter). */
export function Rutas() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route element={<LayoutTienda />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<DetalleCategoria />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa/:id" element={<CompraExitosa />} />
          <Route path="/pago-fallido/:id" element={<PagoFallido />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>

        <Route path="/admin" element={<RutaProtegida roles={PERSONAL}><LayoutAdmin /></RutaProtegida>}>
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:id" element={<DetalleOrden />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="productos/:id" element={<DetalleProductoAdmin />} />
          {/* Lo siguiente solo lo puede usar el administrador */}
          <Route path="productos/nuevo" element={<RutaProtegida roles={SOLO_ADMIN}><FormularioProductoPagina /></RutaProtegida>} />
          <Route path="productos/:id/editar" element={<RutaProtegida roles={SOLO_ADMIN}><FormularioProductoPagina /></RutaProtegida>} />
          <Route path="categorias" element={<RutaProtegida roles={SOLO_ADMIN}><CategoriasAdmin /></RutaProtegida>} />
          <Route path="usuarios" element={<RutaProtegida roles={SOLO_ADMIN}><Usuarios /></RutaProtegida>} />
          <Route path="usuarios/nuevo" element={<RutaProtegida roles={SOLO_ADMIN}><FormularioUsuarioPagina /></RutaProtegida>} />
          <Route path="usuarios/:id/editar" element={<RutaProtegida roles={SOLO_ADMIN}><FormularioUsuarioPagina /></RutaProtegida>} />
          <Route path="usuarios/:id/historial" element={<RutaProtegida roles={SOLO_ADMIN}><HistorialUsuario /></RutaProtegida>} />
          <Route path="reportes" element={<RutaProtegida roles={SOLO_ADMIN}><Reportes /></RutaProtegida>} />
        </Route>
      </Routes>
    </>
  );
}

/** Raíz de la aplicación: proveedores de contexto + enrutador. */
export default function App() {
  return (
    <HashRouter>
      <AvisosProvider>
        <SesionProvider>
          <CarritoProvider>
            <Rutas />
          </CarritoProvider>
        </SesionProvider>
      </AvisosProvider>
    </HashRouter>
  );
}
