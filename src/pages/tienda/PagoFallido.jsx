import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Container } from 'react-bootstrap';
import Boleta from '../../components/organismos/Boleta.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { obtenerOrden } from '../../services/ordenesService.js';

export default function PagoFallido() {
  const { id } = useParams();
  const navegar = useNavigate();
  const orden = obtenerOrden(id);

  if (!orden) {
    return (
      <Container className="py-5">
        <MensajeVacio nivelTitulo={1} titulo="No encontramos esa orden">
          <Link to="/carrito" className="btn btn-dark">Volver a mi reserva</Link>
        </MensajeVacio>
      </Container>
    );
  }

  return (
    <Container className="py-4 contenedor-angosto">
      <h1 className="titulo-seccion">No se pudo realizar el pago</h1>
      <Alert variant="danger" role="alert">
        <strong>No pudimos procesar tu pago.</strong> Tu reserva sigue guardada y el horario aún no está tomado. Puedes intentarlo otra vez.
      </Alert>
      <Boleta orden={orden} />
      <div className="d-flex flex-wrap gap-2 mt-4">
        <Button variant="dark" onClick={() => navegar('/checkout', { state: { ordenId: orden.id } })}>
          Volver a realizar el pago
        </Button>
        <Link to="/carrito" className="btn btn-outline-dark">Revisar mi reserva</Link>
      </div>
    </Container>
  );
}
