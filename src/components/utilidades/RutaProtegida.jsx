// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Es el "guardia" del panel admin: recibe por props el usuario conectado (vive en App.jsx).
// • Sin sesión -> <Navigate> al login. Con sesión pero rol equivocado -> al inicio.
// • Roles del proyecto: Administrador, Vendedor y Cliente.
// ───────────────────────────────────────────────────────────────────────────
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Protege vistas privadas (el panel de administración).
 *  - Sin sesión            -> manda al login.
 *  - Con sesión sin permiso-> manda al inicio de la tienda.
 *  - Con permiso           -> muestra el contenido.
 * "roles" es la lista de tipos de usuario que pueden entrar (vacía = cualquiera con sesión).
 */
export default function RutaProtegida({ usuario, roles = [], children }) {
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles.length > 0 && !roles.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
