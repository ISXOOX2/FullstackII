// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • MOLÉCULA: tarjeta de un artículo de la Tienda (cuidado del tatuaje o gift card).
// • A diferencia de un diseño, el artículo SÍ tiene stock: si quedan pocos se avisa y si se
//   agotó el botón queda deshabilitado (renderizado condicional).
// ───────────────────────────────────────────────────────────────────────────
import { Card } from 'react-bootstrap';
import Boton from '../atomos/Boton.jsx';
import { esInsumoCritico, estaAgotado } from '../../services/insumosService.js';
import { formatoCLP } from '../../utils/formato.js';
import images from '../../assets/images.js';

export default function TarjetaArticulo({ articulo, onAgregar }) {
  const agotado = estaAgotado(articulo);
  return (
    <Card className="tarjeta-producto h-100">
      <div className="marco-imagen position-relative">
        <Card.Img variant="top" src={images[articulo.imagen]} alt={articulo.nombre} />
        {agotado && <span className="badge insignia-oferta">Agotado</span>}
      </div>
      <Card.Body className="d-flex flex-column">
        <small className="text-muted text-uppercase">{articulo.tipo}</small>
        <Card.Title as="h3" className="h6 mb-1">{articulo.nombre}</Card.Title>
        <p className="small text-muted mb-2">{articulo.descripcion}</p>
        <span className="precio mb-1">{formatoCLP(articulo.precio)}</span>
        {!agotado && esInsumoCritico(articulo) && (
          <small className="text-danger mb-2" role="status">¡Quedan solo {articulo.stock}!</small>
        )}
        <Boton
          etiqueta={agotado ? 'Agotado' : 'Agregar al carrito'}
          className="mt-auto"
          deshabilitado={agotado}
          onClick={() => onAgregar && onAgregar(articulo)}
        />
      </Card.Body>
    </Card>
  );
}
