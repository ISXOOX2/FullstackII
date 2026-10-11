import { Col, Row } from 'react-bootstrap';
import TarjetaProducto from './TarjetaProducto.jsx';
import MensajeVacio from '../comunes/MensajeVacio.jsx';
import { nombreCategoria } from '../../services/categoriasService.js';

/** Grilla responsiva de tarjetas. Si no hay diseños muestra un mensaje en vez de una grilla vacía. */
export default function ListaProductos({ productos, onAgregar, vacioTitulo, vacioTexto }) {
  if (productos.length === 0) {
    return <MensajeVacio titulo={vacioTitulo || 'No encontramos diseños'} texto={vacioTexto || 'Prueba cambiando los filtros o la búsqueda.'} />;
  }
  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4" data-testid="lista-productos">
      {productos.map((producto) => (
        <Col key={producto.id}>
          <TarjetaProducto
            producto={producto}
            nombreCategoria={nombreCategoria(producto.categoriaId)}
            onAgregar={onAgregar}
          />
        </Col>
      ))}
    </Row>
  );
}
