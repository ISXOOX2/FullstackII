import { Toast, ToastContainer } from 'react-bootstrap';

/**
 * ORGANISMO · Avisos emergentes (Toast de Bootstrap): "Diseño añadido a tu reserva", etc.
 * No guarda estado propio: la lista de avisos vive en App.jsx y llega por props.
 *
 * Props:
 *  - avisos   : lista de { id, mensaje, variante } que se están mostrando.
 *  - onCerrar : función que App usa para quitar un aviso de la lista (recibe su id).
 */
export default function Avisos({ avisos, onCerrar }) {
  return (
    <ToastContainer position="bottom-end" className="contenedor-avisos p-3 position-fixed d-print-none">
      {avisos.map((aviso) => (
        <Toast
          key={aviso.id}
          onClose={() => onCerrar(aviso.id)}
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
  );
}
