import { Col, Container, Row } from 'react-bootstrap';
import TarjetaCategoria from '../../components/tienda/TarjetaCategoria.jsx';
import Migas from '../../components/comunes/Migas.jsx';
import { contarProductosDeCategoria, listarCategorias } from '../../services/categoriasService.js';

export default function Categorias() {
  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Estilos' }]} />
      <h1 className="titulo-seccion">Estilos de tatuaje</h1>
      <Row xs={1} sm={2} lg={4} className="g-4">
        {listarCategorias().map((c) => (
          <Col key={c.id}>
            <TarjetaCategoria categoria={c} cantidad={contarProductosDeCategoria(c.id)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
