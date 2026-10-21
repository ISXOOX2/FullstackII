// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Como en la clase "React II": <BrowserRouter> envuelve a <App /> en main.jsx, y aquí se
//   declaran las rutas con <Routes> y <Route path=... element=... />.
// • App es el COMPONENTE PADRE que guarda el estado compartido (igual que en el Generador de
//   Memes, donde App tenía el state y lo pasaba a los hijos por props):
//     1) usuario  -> quién inició sesión (se guarda en sessionStorage)
//     2) items    -> el carrito (se guarda en localStorage con useEffect)
//     3) avisos   -> los mensajes emergentes (Toast)
//   Los hijos reciben esos datos por PROPS y avisan los cambios llamando a funciones que también
//   reciben por props (flujo de datos unidireccional).
// • Microservicios (axios, clase React V): el login va a usuario-service y el carrito se guarda
//   en carrito-service. Si no responden, la tienda sigue con los datos locales (db.js).
// • Las rutas de la tienda comparten la PLANTILLA LayoutTienda (cabecera + <Outlet/> + pie).
// • Las rutas del panel están protegidas con <RutaProtegida usuario=... roles=[...]>.
// • Las páginas del panel se cargan con React.lazy (guía 2.3.3); el <Suspense> está en LayoutAdmin.
// • <LimiteDeErrores> (Error Boundary, guía 2.3.5) evita la pantalla en blanco si algo falla.
// ───────────────────────────────────────────────────────────────────────────
import { lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutTienda from './components/plantillas/LayoutTienda.jsx';
import LayoutAdmin from './components/plantillas/LayoutAdmin.jsx';
import Avisos from './components/organismos/Avisos.jsx';
import RutaProtegida from './components/utilidades/RutaProtegida.jsx';
import ScrollArriba from './components/utilidades/ScrollArriba.jsx';
import LimiteDeErrores from './components/utilidades/LimiteDeErrores.jsx';
import { autenticar, buscarUsuarioPorCorreo, usuarioPublico } from './services/usuariosService.js';
import { obtenerProducto } from './services/productosService.js';
import { api, mensajeDeError, servicioNoDisponible } from './services/api.js';
import { borrarSesion, guardarSesion, leerSesion } from './services/sesionService.js';
import {
  agregarItem, cambiarCantidad as cambiarCantidadItem, cantidadTotal, claveCarrito, guardarCarrito, leerCarrito,
  quitarItem, totalCarrito, vaciarCarrito,
} from './services/carritoService.js';

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

export default function App() {
  // ─── ESTADO 1: sesión ──────────────────────────────────────────────────────
  // Se recupera de sessionStorage para no perder la sesión al recargar la página.
  const [usuario, setUsuario] = useState(() => leerSesion());

  /** Guarda la sesión en el estado y en sessionStorage. */
  const abrirSesion = (datos) => {
    guardarSesion(datos);
    setUsuario(datos);
    return { ok: true, usuario: datos };
  };

  /**
   * Inicio de sesión. Devuelve { ok, usuario } o { ok: false, error } para el formulario.
   *  1) Se envían las credenciales a usuario-service (POST /api/auth/login), que responde
   *     un token JWT. El token queda en la sesión para las siguientes peticiones.
   *  2) Si responde 401 (credenciales incorrectas), se muestra su mensaje.
   *  3) Si usuario-service está apagado, se valida con los usuarios locales (db.js).
   */
  const iniciarSesion = async (correo, password) => {
    try {
      const { token, usuario: remoto } = await api.login(correo, password);
      // El resto de la tienda (perfil, historial) usa la copia local del mismo usuario.
      const local = buscarUsuarioPorCorreo(remoto.correo);
      return abrirSesion({ ...(local ? usuarioPublico(local) : remoto), token });
    } catch (error) {
      if (!servicioNoDisponible(error)) return { ok: false, error: mensajeDeError(error) };
      const encontrado = autenticar(correo, password);
      if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };
      return abrirSesion(encontrado);
    }
  };

  const cerrarSesion = () => {
    borrarSesion();
    setUsuario(null);
  };

  /** Se usa al editar el perfil, para que la cabecera muestre los datos nuevos. */
  const actualizarSesion = (usuarioActualizado) => {
    guardarSesion(usuarioActualizado);
    setUsuario(usuarioActualizado);
  };

  // ─── ESTADO 2: carrito ─────────────────────────────────────────────────────
  const [items, setItems] = useState(() => leerCarrito());
  // true cuando ya se intentó leer el carrito guardado en carrito-service
  const [carritoCargado, setCarritoCargado] = useState(false);

  // Al abrir la tienda: se pide el carrito a carrito-service (GET). Si el navegador no tenía
  // nada guardado y el microservicio sí, se usa el del microservicio.
  useEffect(() => {
    api.obtenerCarrito(claveCarrito())
      .then((remoto) => {
        const desdeServicio = remoto.items.map((i) => ({
          productoId: i.productoId,
          nombre: i.nombre,
          imagen: i.imagen,
          categoriaId: obtenerProducto(i.productoId)?.categoriaId ?? null,
          precio: i.precio,
          stock: i.stock,
          cantidad: i.cantidad,
        }));
        setItems((actuales) => (actuales.length === 0 ? desdeServicio : actuales));
      })
      .catch(() => {}) // carrito-service apagado: se queda el carrito de localStorage
      .finally(() => setCarritoCargado(true));
  }, []);

  // Cada vez que cambian los items: se guardan en localStorage y en carrito-service (PUT).
  // carrito-service valida los cupos preguntándole a producto-service (Feign).
  useEffect(() => {
    guardarCarrito(items);
    if (!carritoCargado) return; // aún no se lee el carrito remoto: no se sobrescribe
    const resumen = items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad }));
    api.guardarCarrito(claveCarrito(), resumen).catch(() => {});
  }, [items, carritoCargado]);

  // ─── ESTADO 3: avisos emergentes ───────────────────────────────────────────
  const [avisos, setAvisos] = useState([]);

  const mostrarAviso = (mensaje, variante = 'dark') => {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, mensaje, variante }]);
  };

  const cerrarAviso = (id) => {
    setAvisos((actuales) => actuales.filter((a) => a.id !== id));
  };

  /** Agrega un diseño al carrito y avisa si se pudo o qué regla lo impidió (máx. 5, cupos). */
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const resultado = agregarItem(items, producto, cantidad);
    if (resultado.mensaje) {
      mostrarAviso(resultado.mensaje, 'danger');
      return false;
    }
    setItems(resultado.items);
    mostrarAviso(`«${producto.nombre}» se añadió a tu reserva.`);
    return true;
  };

  // Todo lo que las páginas necesitan del carrito, en un solo objeto que se pasa por props.
  const carrito = {
    items,
    total: totalCarrito(items),
    cantidad: cantidadTotal(items),
    cambiarCantidad: (productoId, cantidad) => setItems((actuales) => cambiarCantidadItem(actuales, productoId, cantidad)),
    quitar: (productoId) => setItems((actuales) => quitarItem(actuales, productoId)),
    vaciar: () => setItems(vaciarCarrito()),
  };

  /** Atajo: envuelve una página del panel en su protección por rol. */
  const soloAdmin = (pagina) => <RutaProtegida usuario={usuario} roles={SOLO_ADMIN}>{pagina}</RutaProtegida>;

  return (
    <LimiteDeErrores>
      <ScrollArriba />
      <Routes>
        <Route
          element={(
            <LayoutTienda
              usuario={usuario}
              onCerrarSesion={cerrarSesion}
              total={carrito.total}
              cantidad={carrito.cantidad}
              mostrarAviso={mostrarAviso}
            />
          )}
        >
          <Route path="/" element={<Home onAgregar={agregarAlCarrito} />} />
          <Route path="/productos" element={<Productos onAgregar={agregarAlCarrito} />} />
          <Route path="/productos/:id" element={<DetalleProducto onAgregar={agregarAlCarrito} />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:id" element={<DetalleCategoria onAgregar={agregarAlCarrito} />} />
          <Route path="/ofertas" element={<Ofertas onAgregar={agregarAlCarrito} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} mostrarAviso={mostrarAviso} />} />
          <Route path="/checkout" element={<Checkout carrito={carrito} usuario={usuario} />} />
          <Route path="/compra-exitosa/:id" element={<CompraExitosa />} />
          <Route path="/pago-fallido/:id" element={<PagoFallido />} />
          <Route path="/login" element={<Login iniciarSesion={iniciarSesion} mostrarAviso={mostrarAviso} />} />
          <Route path="/registro" element={<Registro iniciarSesion={iniciarSesion} mostrarAviso={mostrarAviso} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto mostrarAviso={mostrarAviso} />} />
          <Route
            path="/perfil"
            element={(
              <RutaProtegida usuario={usuario}>
                <Perfil usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />
              </RutaProtegida>
            )}
          />
          <Route path="*" element={<NoEncontrado />} />
        </Route>

        <Route
          path="/admin"
          element={(
            <RutaProtegida usuario={usuario} roles={PERSONAL}>
              <LayoutAdmin usuario={usuario} onCerrarSesion={cerrarSesion} />
            </RutaProtegida>
          )}
        >
          <Route index element={<Dashboard usuario={usuario} />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:id" element={<DetalleOrden />} />
          <Route path="productos" element={<ProductosAdmin usuario={usuario} mostrarAviso={mostrarAviso} />} />
          <Route path="productos/:id" element={<DetalleProductoAdmin usuario={usuario} />} />
          {/* Lo siguiente solo lo puede usar el administrador */}
          <Route path="productos/nuevo" element={soloAdmin(<FormularioProductoPagina mostrarAviso={mostrarAviso} />)} />
          <Route path="productos/:id/editar" element={soloAdmin(<FormularioProductoPagina mostrarAviso={mostrarAviso} />)} />
          <Route path="categorias" element={soloAdmin(<CategoriasAdmin mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios" element={soloAdmin(<Usuarios usuario={usuario} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/nuevo" element={soloAdmin(<FormularioUsuarioPagina usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/:id/editar" element={soloAdmin(<FormularioUsuarioPagina usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/:id/historial" element={soloAdmin(<HistorialUsuario />)} />
          <Route path="reportes" element={soloAdmin(<Reportes />)} />
        </Route>
      </Routes>
      <Avisos avisos={avisos} onCerrar={cerrarAviso} />
    </LimiteDeErrores>
  );
}
