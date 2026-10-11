import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Container } from 'react-bootstrap';
import Boleta from '../../components/comunes/Boleta.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { obtenerOrden } from '../../services/ordenesService.js';
import { construirMailtoBoleta } from '../../utils/boleta.js';

export default function CompraExitosa() {
  const { id } = useParams();
  const orden = obtenerOrden(id);

  if (!orden || orden.estado !== 'Pagada') {
    return (
      <Container className="py-5">
        <MensajeVacio titulo="No encontramos esa compra">
          <Link to="/" className="btn btn-dark">Volver al inicio</Link>
        </MensajeVacio>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 820 }}>
      <Alert variant="success" className="no-imprimir" role="status">
        <strong>¡Reserva confirmada!</strong> Te esperamos el {orden.cita.fecha.split('-').reverse().join('-')} a las {orden.cita.hora} hrs.
      </Alert>
      <Boleta orden={orden} />
      <div className="d-flex flex-wrap gap-2 mt-4 no-imprimir">
        <Button variant="dark" onClick={() => window.print()}>Imprimir boleta (PDF)</Button>
        <a className="btn btn-outline-dark" href={construirMailtoBoleta(orden)}>Enviar boleta por correo</a>
        <Link to="/productos" className="btn btn-outline-dark">Seguir explorando</Link>
      </div>
    </Container>
  );
}
