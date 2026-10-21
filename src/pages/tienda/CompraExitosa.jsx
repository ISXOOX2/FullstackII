import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Container } from 'react-bootstrap';
import Boleta from '../../components/organismos/Boleta.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { obtenerOrden } from '../../services/ordenesService.js';
import { construirMailtoBoleta } from '../../utils/boleta.js';

export default function CompraExitosa() {
  const { id } = useParams();
  const orden = obtenerOrden(id);

  if (!orden || orden.estado !== 'Pagada') {
    return (
      <Container className="py-5">
        <MensajeVacio nivelTitulo={1} titulo="No encontramos esa compra">
          <Link to="/" className="btn btn-dark">Volver al inicio</Link>
        </MensajeVacio>
      </Container>
    );
  }

  return (
    <Container className="py-4 contenedor-angosto">
      <h1 className="titulo-seccion d-print-none">Compra exitosa</h1>
      <Alert variant="success" className="d-print-none" role="status">
        <strong>¡Reserva confirmada!</strong> Te esperamos el {orden.cita.fecha.split('-').reverse().join('-')} a las {orden.cita.hora} hrs.
      </Alert>
      <Boleta orden={orden} />
      <div className="d-flex flex-wrap gap-2 mt-4 d-print-none">
        <Button variant="dark" onClick={() => window.print()}>Imprimir boleta (PDF)</Button>
        <a className="btn btn-outline-dark" href={construirMailtoBoleta(orden)}>Enviar boleta por correo</a>
        <Link to="/productos" className="btn btn-outline-dark">Seguir explorando</Link>
      </div>
    </Container>
  );
}
