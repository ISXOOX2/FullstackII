import { useCallback } from 'react';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useAvisos } from '../context/AvisosContext.jsx';

/**
 * Hook personalizado: devuelve una función para añadir un diseño al carrito y avisar
 * con un mensaje emergente si se pudo o qué regla lo impidió.
 */
export default function useAgregarAlCarrito() {
  const { agregar } = useCarrito();
  const { mostrar } = useAvisos();

  return useCallback(
    (producto, cantidad = 1) => {
      const mensaje = agregar(producto, cantidad);
      if (mensaje) mostrar(mensaje, 'danger');
      else mostrar(`«${producto.nombre}» se añadió a tu reserva.`);
      return !mensaje;
    },
    [agregar, mostrar],
  );
}
