import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

/** Avisos emergentes (toasts) para confirmar acciones: "Diseño añadido al carrito", etc. */
export const AvisosContext = createContext(null);

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const cerrar = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((a) => a.id !== id));
  }, []);

  const mostrar = useCallback((mensaje, variante = 'dark') => {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, mensaje, variante }]);
  }, []);

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      <ToastContainer position="bottom-end" className="p-3 position-fixed" style={{ zIndex: 2000 }}>
        {avisos.map((aviso) => (
          <Toast
            key={aviso.id}
            onClose={() => cerrar(aviso.id)}
            autohide
            delay={3200}
            bg={aviso.variante}
            className="aviso-toast"
          >
            <Toast.Body className={aviso.variante === 'light' ? '' : 'text-white'} role="status">
              {aviso.mensaje}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </AvisosContext.Provider>
  );
}

export function useAvisos() {
  const contexto = useContext(AvisosContext);
  // Si no hay proveedor (por ejemplo en una prueba aislada) se devuelve una función vacía.
  return contexto || { mostrar: () => {} };
}
