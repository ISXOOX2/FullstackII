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
import { autenticar } from './services/usuariosService.js';
import { borrarSesion, guardarSesion, leerSesion } from './services/sesionService.js';
import { apiUsuarios, mensajeDeError, tokenVencido, USAR_API } from './services/api.js';
import { sincronizarTodo } from './services/sincronizacion.js';
import {
  agregarArticulo, agregarItem, cambiarCantidad as cambiarCantidadItem, cantidadTotal, guardarCarrito, leerCarrito,
  quitarItem, totalCarrito, vaciarCarrito,
} from './services/carritoService.js';

import Home from './pages/tienda/Home.jsx';
import Productos from './pages/tienda/Productos.jsx';
import DetalleProducto from './pages/tienda/DetalleProducto.jsx';
import Tienda from './pages/tienda/Tienda.jsx';
import Resenas from './pages/tienda/Resenas.jsx';
import MiProyecto from './pages/tienda/MiProyecto.jsx';
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
const Insumos = lazy(() => import('./pages/admin/Insumos.jsx'));
const Proyectos = lazy(() => import('./pages/admin/Proyectos.jsx'));

const SOLO_ADMIN = ['Administrador'];
const PERSONAL = ['Administrador', 'Vendedor'];

export default function App() {
  // ─── ESTADO 1: sesión ──────────────────────────────────────────────────────
  // Se recupera de sessionStorage para no perder la sesión al recargar la página.
  // La sesión sobrevive a una recarga (sessionStorage). Si el token ya venció, se descarta.
  // OJO: lo guardado en el navegador se puede editar (F12). Por eso, con backend, el rol NO se toma
  // de ahí: al abrir la app se le pregunta al servidor (ver "verificandoSesion" más abajo).
  const [usuario, setUsuario] = useState(() => {
    const sesion = leerSesion();
    if (USAR_API && sesion?.token && tokenVencido(sesion.token)) {
      borrarSesion();
      return null;
    }
    return sesion;
  });

  // ─── Seguridad: el servidor confirma quién es el usuario ────────────────────
  // Con backend, al abrir la app se llama a GET /usuarios/yo con el token (que va firmado y no se
  // puede falsificar). Se usan los datos y el ROL que responde el servidor, no los del navegador.
  // Si alguien editó su rol en Session Storage, aquí se corrige; si alteró el token, el servidor
  // responde 401 y el interceptor de api.js cierra la sesión.
  const [verificandoSesion, setVerificandoSesion] = useState(() => USAR_API && Boolean(leerSesion()?.token));
  useEffect(() => {
    if (!verificandoSesion) return;
    apiUsuarios.get('/yo')
      .then((respuesta) => {
        const sesion = { ...respuesta.data, token: leerSesion()?.token };
        guardarSesion(sesion);
        setUsuario(sesion);
      })
      .catch(() => {}) // 401: ya lo maneja el interceptor; sin conexión: se mantiene la sesión
      .finally(() => setVerificandoSesion(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Devuelve { ok, usuario } o { ok: false, error } para que el formulario muestre el mensaje.
   * Con el backend activo es async: pide el token JWT a ms-auth y lo guarda en la sesión
   * (el interceptor de api.js lo agrega a todas las peticiones siguientes).
   */
  const iniciarSesion = async (correo, password) => {
    if (USAR_API) {
      try {
        const respuesta = await apiUsuarios.post('/auth/login', { correo, password });
        const sesion = { ...respuesta.data.usuario, token: respuesta.data.token };
        guardarSesion(sesion);
        setUsuario(sesion);
        return { ok: true, usuario: sesion };
      } catch (error) {
        return { ok: false, error: mensajeDeError(error) };
      }
    }
    const encontrado = autenticar(correo, password);
    if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    guardarSesion(encontrado);
    setUsuario(encontrado);
    return { ok: true, usuario: encontrado };
  };

  const cerrarSesion = () => {
    borrarSesion();
    setUsuario(null);
  };

  /** Se usa al editar el perfil, para que la cabecera muestre los datos nuevos. */
  const actualizarSesion = (usuarioActualizado) => {
    // Se conserva el token JWT de la sesión (los datos editados no lo traen)
    const token = leerSesion()?.token;
    const sesion = token ? { ...usuarioActualizado, token } : usuarioActualizado;
    guardarSesion(sesion);
    setUsuario(sesion);
  };

  // ─── ESTADO 2: carrito ─────────────────────────────────────────────────────
  const [items, setItems] = useState(() => leerCarrito());

  // Cada vez que cambian los items, se guardan en localStorage.
  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  // ─── ESTADO 3: avisos emergentes ───────────────────────────────────────────
  const [avisos, setAvisos] = useState([]);

  const mostrarAviso = (mensaje, variante = 'dark') => {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, mensaje, variante }]);
  };

  // ─── Backend: al abrir la app y al cambiar la sesión, se traen los datos de los microservicios ───
  const [, setVersionDatos] = useState(0); // al cambiar, las páginas vuelven a leer la copia local
  useEffect(() => {
    if (!USAR_API || verificandoSesion) return undefined; // primero se confirma quién es
    let activo = true;
    sincronizarTodo(usuario)
      .then(() => activo && setVersionDatos((v) => v + 1))
      .catch((error) => {
        // Un 401 ya lo avisa el evento "sesion-expirada"; aquí solo los demás problemas
        if (activo && error.response?.status !== 401) {
          mostrarAviso(`No pudimos conectar con el servidor: ${mensajeDeError(error)}`, 'danger');
        }
      });
    return () => { activo = false; };
    // Solo al iniciar o cerrar sesión (o si cambia el rol). Renovar el token NO vuelve a sincronizar:
    // los datos son los mismos, solo cambia la "llave".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id, usuario?.tipo, verificandoSesion]);

  // El interceptor de api.js avisa cuando renovó el token o cuando la sesión ya no es válida.
  useEffect(() => {
    const alRenovar = () => setUsuario(leerSesion());
    const alExpirar = () => {
      setUsuario(null);
      mostrarAviso('Tu sesión expiró. Vuelve a iniciar sesión.', 'danger');
    };
    window.addEventListener('sesion-renovada', alRenovar);
    window.addEventListener('sesion-expirada', alExpirar);
    return () => {
      window.removeEventListener('sesion-renovada', alRenovar);
      window.removeEventListener('sesion-expirada', alExpirar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrarAviso = (id) => {
    setAvisos((actuales) => actuales.filter((a) => a.id !== id));
  };

  /** Agrega un diseño al carrito (con el tamaño que pidió el cliente) y avisa si se pudo o qué regla lo impidió. */
  const agregarAlCarrito = (producto, cantidad = 1, medidas = null) => {
    const resultado = agregarItem(items, producto, cantidad, medidas);
    if (resultado.mensaje) {
      mostrarAviso(resultado.mensaje, 'danger');
      return false;
    }
    setItems(resultado.items);
    mostrarAviso(`«${producto.nombre}» se añadió a tu reserva.`);
    return true;
  };

  /** Agrega un artículo de la Tienda (cuidado o gift card) respetando su stock. */
  const agregarArticuloAlCarrito = (articulo, cantidad = 1) => {
    const resultado = agregarArticulo(items, articulo, cantidad);
    if (resultado.mensaje) {
      mostrarAviso(resultado.mensaje, 'danger');
      return false;
    }
    setItems(resultado.items);
    mostrarAviso(`«${articulo.nombre}» se agregó al carrito.`);
    return true;
  };

  // Todo lo que las páginas necesitan del carrito, en un solo objeto que se pasa por props.
  const carrito = {
    items,
    total: totalCarrito(items),
    cantidad: cantidadTotal(items),
    cambiarCantidad: (clave, cantidad) => setItems((actuales) => cambiarCantidadItem(actuales, clave, cantidad)),
    quitar: (clave) => setItems((actuales) => quitarItem(actuales, clave)),
    vaciar: () => setItems(vaciarCarrito()),
  };

  /** Atajo: envuelve una página del panel en su protección por rol. */
  const soloAdmin = (pagina) => (
    <RutaProtegida usuario={usuario} roles={SOLO_ADMIN} verificando={verificandoSesion}>{pagina}</RutaProtegida>
  );

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
          <Route path="/mi-proyecto" element={<MiProyecto usuario={usuario} mostrarAviso={mostrarAviso} />} />
          <Route path="/tienda" element={<Tienda onAgregar={agregarArticuloAlCarrito} />} />
          <Route path="/resenas" element={<Resenas usuario={usuario} mostrarAviso={mostrarAviso} />} />
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
              <RutaProtegida usuario={usuario} verificando={verificandoSesion}>
                <Perfil usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />
              </RutaProtegida>
            )}
          />
          <Route path="*" element={<NoEncontrado />} />
        </Route>

        <Route
          path="/admin"
          element={(
            <RutaProtegida usuario={usuario} roles={PERSONAL} verificando={verificandoSesion}>
              <LayoutAdmin usuario={usuario} onCerrarSesion={cerrarSesion} />
            </RutaProtegida>
          )}
        >
          <Route index element={<Dashboard usuario={usuario} />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:id" element={<DetalleOrden usuario={usuario} mostrarAviso={mostrarAviso} />} />
          <Route path="productos" element={<ProductosAdmin usuario={usuario} mostrarAviso={mostrarAviso} />} />
          <Route path="productos/:id" element={<DetalleProductoAdmin usuario={usuario} />} />
          <Route path="proyectos" element={<Proyectos mostrarAviso={mostrarAviso} />} />
          {/* Lo siguiente solo lo puede usar el administrador */}
          <Route path="productos/nuevo" element={soloAdmin(<FormularioProductoPagina mostrarAviso={mostrarAviso} />)} />
          <Route path="productos/:id/editar" element={soloAdmin(<FormularioProductoPagina mostrarAviso={mostrarAviso} />)} />
          <Route path="categorias" element={soloAdmin(<CategoriasAdmin mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios" element={soloAdmin(<Usuarios usuario={usuario} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/nuevo" element={soloAdmin(<FormularioUsuarioPagina usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/:id/editar" element={soloAdmin(<FormularioUsuarioPagina usuario={usuario} actualizarSesion={actualizarSesion} mostrarAviso={mostrarAviso} />)} />
          <Route path="usuarios/:id/historial" element={soloAdmin(<HistorialUsuario />)} />
          <Route path="reportes" element={soloAdmin(<Reportes />)} />
          <Route path="insumos" element={soloAdmin(<Insumos mostrarAviso={mostrarAviso} />)} />
        </Route>
      </Routes>
      <Avisos avisos={avisos} onCerrar={cerrarAviso} />
    </LimiteDeErrores>
  );
}
