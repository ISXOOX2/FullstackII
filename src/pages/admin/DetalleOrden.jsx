import { Link, useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Boleta from '../../components/comunes/Boleta.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { obtenerOrden } from '../../services/ordenesService.js';

export default function DetalleOrden() {
  const { id } = useParams();
  const orden = obtenerOrden(id);

  if (!orden) {
    return (
      <MensajeVacio titulo="Esa orden no existe">
        <Link to="/admin/ordenes" className="btn btn-dark">Volver a las órdenes</Link>
      </MensajeVacio>
    );
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 no-imprimir">
        <h1 className="titulo-seccion mb-0">Orden {orden.numero}</h1>
        <div className="d-flex gap-2">
          <Button variant="outline-dark" size="sm" onClick={() => window.print()}>Imprimir</Button>
          <Link to="/admin/ordenes" className="btn btn-dark btn-sm">Volver</Link>
        </div>
      </div>
      <Boleta orden={orden} />
    </>
  );
}
