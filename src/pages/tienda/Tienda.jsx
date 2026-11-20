import { useState } from 'react';
import { Col, Container, Nav, Row } from 'react-bootstrap';
import TarjetaArticulo from '../../components/moleculas/TarjetaArticulo.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { listarArticulosEnVenta } from '../../services/insumosService.js';

// Pestañas de la Tienda: 'todo' muestra todos los artículos.
const SECCIONES = [
  { valor: 'todo', texto: 'Todo' },
  { valor: 'Cuidado posterior', texto: 'Cuidado del tatuaje' },
  { valor: 'Gift card', texto: 'Gift cards' },
];

/**
 * Tienda: insumos del estudio que se venden a los clientes (jabones, cremas, film, gift cards).
 * onAgregar(articulo) llega por props desde App.jsx, donde vive el carrito.
 */
export default function Tienda({ onAgregar }) {
  const [seccion, setSeccion] = useState('todo');
  const articulos = listarArticulosEnVenta(seccion === 'todo' ? '' : seccion);

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Tienda' }]} />
      <h1 className="titulo-seccion">Tienda</h1>
      <p className="text-muted">
        Todo para cuidar tu tatuaje y gift cards para regalar. Se pagan junto a tu reserva o por separado, y se
        retiran en el estudio.
      </p>
      <Nav variant="pills" className="mb-4 gap-2" activeKey={seccion} onSelect={(v) => setSeccion(v ?? 'todo')}>
        {SECCIONES.map((s) => (
          <Nav.Item key={s.valor}>
            <Nav.Link eventKey={s.valor} as="button" type="button">{s.texto}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      {articulos.length === 0 ? (
        <MensajeVacio titulo="No hay productos en esta sección" texto="Vuelve pronto." />
      ) : (
        <Row xs={1} sm={2} lg={4} className="g-4">
          {articulos.map((a) => (
            <Col key={a.id}><TarjetaArticulo articulo={a} onAgregar={onAgregar} /></Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
