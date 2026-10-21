import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import images from '../../assets/images.js';

/** Tarjeta de un estilo (categoría): imagen, nombre y descripción. */
export default function TarjetaCategoria({ categoria, cantidad }) {
  return (
    <Card as={Link} to={`/categorias/${categoria.id}`} className="tarjeta-categoria h-100 text-decoration-none">
      <div className="marco-imagen">
        <Card.Img variant="top" src={images[categoria.imagen]} alt={`Ejemplo de estilo ${categoria.nombre}`} />
      </div>
      <Card.Body>
        <Card.Title as="h3" className="h5">{categoria.nombre}</Card.Title>
        <Card.Text className="text-muted small mb-1">{categoria.descripcion}</Card.Text>
        {cantidad !== undefined && <small className="text-muted">{cantidad} diseño(s)</small>}
      </Card.Body>
    </Card>
  );
}
