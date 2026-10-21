// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • CONTEXT API: comparte el carrito con toda la app sin pasarlo por props nivel a nivel.
//   Tres piezas: createContext (crea), <Provider value=...> (entrega) y useContext (lee).
// • useState guarda los items; useEffect los copia a localStorage cada vez que cambian.
// • Las reglas (máx. 5, stock) NO están aquí: están en services/carritoService.js, para poder
//   probarlas sin React.
// ───────────────────────────────────────────────────────────────────────────
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  agregarItem,
  cambiarCantidad as cambiarCantidadItem,
  cantidadTotal,
  guardarCarrito,
  leerCarrito,
  quitarItem,
  totalCarrito,
  vaciarCarrito,
} from '../services/carritoService.js';

/**
 * Contexto del carrito: el estado "items" vive aquí y se comparte con la barra de
 * navegación (muestra el total), las tarjetas de producto (botón Añadir), la página del
 * carrito y el checkout. Cada cambio se guarda en localStorage (useEffect).
 */
export const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => leerCarrito());

  // Cada vez que cambian los items, se guardan en localStorage.
  useEffect(() => {
    guardarCarrito(items);
  }, [items]);

  /** Devuelve '' si se agregó, o el mensaje de la regla que lo impidió. */
  const agregar = useCallback(
    (producto, cantidad = 1) => {
      const resultado = agregarItem(items, producto, cantidad);
      if (!resultado.mensaje) setItems(resultado.items);
      return resultado.mensaje;
    },
    [items],
  );

  const cambiarCantidad = useCallback((productoId, cantidad) => {
    setItems((actuales) => cambiarCantidadItem(actuales, productoId, cantidad));
  }, []);

  const quitar = useCallback((productoId) => {
    setItems((actuales) => quitarItem(actuales, productoId));
  }, []);

  const vaciar = useCallback(() => setItems(vaciarCarrito()), []);

  const valor = useMemo(
    () => ({
      items,
      total: totalCarrito(items),
      cantidad: cantidadTotal(items),
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
    }),
    [items, agregar, cambiarCantidad, quitar, vaciar],
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>.');
  return contexto;
}
