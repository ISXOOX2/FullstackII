// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Es el "guardia" del panel admin: recibe por props el usuario conectado (vive en App.jsx).
// • Sin sesión -> <Navigate> al login. Con sesión pero rol equivocado -> al inicio.
// • Roles del proyecto: Administrador, Vendedor y Cliente.
// • Con backend, mientras el servidor confirma quién es el usuario (GET /usuarios/yo) se muestra
//   "Verificando tu sesión…": así nadie ve el panel por haber editado su rol en el navegador.
// ───────────────────────────────────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';
import Cargando from '../atomos/Cargando.jsx';

/**
 * Protege vistas privadas (el panel de administración).
 *  - Sin sesión            -> manda al login.
 *  - Con sesión sin permiso-> manda al inicio de la tienda.
 *  - Con permiso           -> muestra el contenido.
 * "roles" es la lista de tipos de usuario que pueden entrar (vacía = cualquiera con sesión).
 */
export default function RutaProtegida({ usuario, roles = [], verificando = false, children }) {
  const ubicacion = useLocation();

  if (verificando) return <Cargando texto="Verificando tu sesión…" />;

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles.length > 0 && !roles.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
