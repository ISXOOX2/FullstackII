// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Mismo patrón que el carrito: Context para que el menú, el checkout y el panel admin sepan
//   quién inició sesión sin pasar `usuario` por props.
// • El estado es `usuario` (null = nadie). iniciarSesion y cerrarSesion lo cambian.
// • Se guarda en sessionStorage para que no se pierda al recargar la página.
// ───────────────────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { autenticar } from '../services/usuariosService.js';
import { borrarSesion, guardarSesion, leerSesion } from '../services/sesionService.js';

/**
 * Contexto de sesión: guarda quién inició sesión y lo comparte con TODA la aplicación
 * (la barra de navegación, las rutas protegidas, el checkout, etc.) sin tener que pasarlo
 * por props de componente en componente.
 */
export const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  // Estado: el usuario activo (se recupera de sessionStorage al recargar la página).
  const [usuario, setUsuario] = useState(() => leerSesion());

  const iniciarSesion = useCallback((correo, password) => {
    const encontrado = autenticar(correo, password);
    if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    guardarSesion(encontrado);
    setUsuario(encontrado);
    return { ok: true, usuario: encontrado };
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarSesion();
    setUsuario(null);
  }, []);

  /** Se usa cuando el usuario edita su perfil, para que la sesión muestre los datos nuevos. */
  const actualizarSesion = useCallback((usuarioActualizado) => {
    guardarSesion(usuarioActualizado);
    setUsuario(usuarioActualizado);
  }, []);

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, cerrarSesion, actualizarSesion }),
    [usuario, iniciarSesion, cerrarSesion, actualizarSesion],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>.');
  return contexto;
}
