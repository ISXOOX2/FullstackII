import { Navigate, useLocation } from 'react-router-dom';
import { useSesion } from '../../context/SesionContext.jsx';

/**
 * Protege vistas privadas (el panel de administración).
 *  - Sin sesión            -> manda al login.
 *  - Con sesión sin permiso-> manda al inicio de la tienda.
 *  - Con permiso           -> muestra el contenido.
 * "roles" es la lista de tipos de usuario que pueden entrar (vacía = cualquiera con sesión).
 */
export default function RutaProtegida({ roles = [], children }) {
  const { usuario } = useSesion();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (roles.length > 0 && !roles.includes(usuario.tipo)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
