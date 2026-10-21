// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Como en la clase "React II": <BrowserRouter> envuelve a <App /> en main.jsx, y aquí se
//   declaran las rutas con <Routes> y <Route path=... element=... />.
// • Las rutas de la tienda comparten la PLANTILLA LayoutTienda (cabecera + <Outlet/> + pie).
// • Las rutas del panel están protegidas con <RutaProtegida roles=[...]> según el tipo de usuario.
// • Las páginas del panel se cargan con React.lazy (guía 2.3.3, componente optimizado); el
//   <Suspense> está en la plantilla LayoutAdmin. Un cliente que no entra al panel no descarga ese código.
// • <LimiteDeErrores> (Error Boundary) evita la pantalla en blanco si algo falla al dibujar.
// ───────────────────────────────────────────────────────────────────────────
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SesionProvider } from './context/SesionContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AvisosProvider } from './context/AvisosContext.jsx';
import LayoutTienda from './components/plantillas/LayoutTienda.jsx';
import LayoutAdmin from './components/plantillas/LayoutAdmin.jsx';
import RutaProtegida from './components/utilidades/RutaProtegida.jsx';
import ScrollArriba from './components/utilidades/ScrollArriba.jsx';
import LimiteDeErrores from './components/utilidades/LimiteDeErrores.jsx';

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

// Panel de administración: carga diferida (lazy). Cada página se descarga recién al visitarla.
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Ordenes = lazy(() => import('./pages/admin/Ordenes.jsx'));
const DetalleOrden = lazy(() => import('./pages/admin/DetalleOrden.jsx'));
const ProductosAdmin = lazy(() => import('./pages/admin/Productos.jsx'));
const DetalleProductoAdmin = lazy(() => import('./pages/admin/DetalleProductoAdmin.jsx'));
const FormularioProductoPagina = lazy(() => import('./pages/admin/FormularioProductoPagina.jsx'));
const CategoriasAdmin = lazy(() => import('./pages/admin/Categorias.jsx'));
const Usuarios = lazy(() => import('./pages/admin/Usuarios.jsx'));
const FormularioUsuarioPagina = lazy(() => import('./pages/admin/FormularioUsuarioPagina.jsx'));
const HistorialUsuario = lazy(() => import('./pages/admin/HistorialUsuario.jsx'));
const Reportes = lazy(() => import('./pages/admin/Reportes.jsx'));

const SOLO_ADMIN = ['Administrador'];
const PERSONAL = ['Administrador', 'Vendedor'];

/** Raíz de la aplicación: contextos (sesión, carrito, avisos) + rutas del sitio. */
export default function App() {
  return (
    <LimiteDeErrores>
      <AvisosProvider>
        <SesionProvider>
          <CarritoProvider>
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
          </CarritoProvider>
        </SesionProvider>
      </AvisosProvider>
    </LimiteDeErrores>
  );
}
