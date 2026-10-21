import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';

export default function NoEncontrado() {
  return (
    <Container className="py-5">
      <MensajeVacio nivelTitulo={1} titulo="Página no encontrada (404)" texto="La dirección que buscas no existe o fue movida.">
        <Link to="/" className="btn btn-dark">Volver al inicio</Link>
      </MensajeVacio>
    </Container>
  );
}
