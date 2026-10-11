import { Link } from 'react-router-dom';
import { Badge, Button, Card } from 'react-bootstrap';
import { estaEnOferta, esStockCritico, precioFinal } from '../../services/productosService.js';
import { formatoCLP } from '../../utils/formato.js';

/**
 * Tarjeta de un diseño. Recibe todo por props (producto y la función onAgregar), por eso
 * es un componente de presentación fácil de probar: no conoce el carrito ni la sesión.
 */
export default function TarjetaProducto({ producto, nombreCategoria = '', onAgregar }) {
  const sinCupos = producto.stock <= 0;
  const oferta = estaEnOferta(producto);

  return (
    <Card className="tarjeta-producto h-100">
      <div className="marco-imagen position-relative">
        <Link to={`/productos/${producto.id}`}>
          <Card.Img variant="top" src={producto.imagen} alt={`Diseño ${producto.nombre}`} />
        </Link>
        {oferta && <Badge bg="dark" className="insignia-oferta">Oferta</Badge>}
      </div>
      <Card.Body className="d-flex flex-column">
        {nombreCategoria && <small className="text-muted text-uppercase">{nombreCategoria}</small>}
        <Card.Title as="h3" className="h6 mb-1">
          <Link to={`/productos/${producto.id}`} className="text-dark text-decoration-none">
            {producto.nombre}
          </Link>
        </Card.Title>
        <small className="text-muted mb-2">{producto.tamano} · {producto.duracionHoras} h</small>

        <div className="mb-2">
          <span className="precio">{formatoCLP(precioFinal(producto))}</span>
          {oferta && <span className="precio-tachado ms-2">{formatoCLP(producto.precio)}</span>}
        </div>

        {/* Renderizado condicional: avisos según los cupos disponibles. */}
        {sinCupos && <small className="text-danger mb-2">Sin cupos disponibles</small>}
        {!sinCupos && esStockCritico(producto) && (
          <small className="text-warning-emphasis mb-2">¡Últimos {producto.stock} cupos!</small>
        )}

        <Button
          variant="dark"
          className="mt-auto"
          disabled={sinCupos}
          onClick={() => onAgregar && onAgregar(producto)}
        >
          Añadir a mi reserva
        </Button>
      </Card.Body>
    </Card>
  );
}
