import { Button, Card } from 'react-bootstrap';
import Estrellas from '../atomos/Estrellas.jsx';
import { formatoFecha } from '../../utils/formato.js';
import { fuenteImagen } from '../../utils/imagenes.js';
import images from '../../assets/images.js';

/** MOLÉCULA · Una reseña: estrellas, nombre, fecha, comentario y la foto si la tiene. */
export default function TarjetaResena({ resena, onEliminar = null }) {
  const foto = fuenteImagen(resena.imagen, images);
  return (
    <Card className="tarjeta-resena h-100">
      {foto && <Card.Img variant="top" src={foto} alt={`Tatuaje de ${resena.nombre}`} className="foto-resena" />}
      <Card.Body>
        <Estrellas valor={resena.estrellas} />
        <blockquote className="mt-2 mb-2">«{resena.comentario}»</blockquote>
        <small className="text-muted">{resena.nombre} · {formatoFecha(resena.fecha)}</small>
        {onEliminar && (
          <Button variant="link" size="sm" className="text-danger p-0 d-block mt-2" onClick={() => onEliminar(resena)}>
            Eliminar reseña
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
