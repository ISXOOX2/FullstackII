import { Badge } from 'react-bootstrap';

const VARIANTES = {
  Pagada: 'success',
  'Pago rechazado': 'danger',
  Pendiente: 'warning',
};

/** Etiqueta de color según el estado de una orden. */
export default function InsigniaEstado({ estado }) {
  return (
    <Badge bg={VARIANTES[estado] || 'secondary'} className="fw-normal">
      {estado}
    </Badge>
  );
}
