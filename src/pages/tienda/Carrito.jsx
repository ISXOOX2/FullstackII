import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import TablaCarrito from '../../components/organismos/TablaCarrito.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { useAvisos } from '../../context/AvisosContext.jsx';
import { formatoCLP } from '../../utils/formato.js';

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCarrito();
  const { mostrar } = useAvisos();
  const navegar = useNavigate();

  const quitarConAviso = (productoId) => {
    quitar(productoId);
    mostrar('Diseño quitado de tu reserva.', 'secondary');
  };

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Mi reserva' }]} />
      <h1 className="titulo-seccion">Mi reserva</h1>

      {items.length === 0 ? (
        <MensajeVacio titulo="Tu reserva está vacía" texto="Agrega uno o más diseños para agendar tu cita.">
          <Link to="/productos" className="btn btn-dark">Explorar diseños</Link>
        </MensajeVacio>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <TablaCarrito items={items} onCambiarCantidad={cambiarCantidad} onQuitar={quitarConAviso} />
            <Button variant="outline-dark" size="sm" onClick={vaciar}>Vaciar reserva</Button>
          </Col>
          <Col lg={4}>
            <aside className="resumen-orden" aria-label="Total de la reserva">
              <h2 className="h5">Total</h2>
              <p className="fs-3 mb-3" data-testid="total-carrito-pagina">{formatoCLP(total)}</p>
              <Button variant="dark" size="lg" className="w-100 mb-2" onClick={() => navegar('/checkout')}>
                Continuar con la reserva
              </Button>
              <Link to="/productos" className="btn btn-outline-dark w-100">Seguir explorando</Link>
            </aside>
          </Col>
        </Row>
      )}
    </Container>
  );
}
