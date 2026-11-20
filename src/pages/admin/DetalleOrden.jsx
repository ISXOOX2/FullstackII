import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import Boleta from '../../components/organismos/Boleta.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import TarjetaSolicitud from '../../components/moleculas/TarjetaSolicitud.jsx';
import { obtenerOrden, responderSolicitud } from '../../services/ordenesService.js';

/** Detalle de una orden. Si el cliente pidió un reembolso o un cambio de fecha, el administrador lo responde aquí. */
export default function DetalleOrden({ usuario, mostrarAviso }) {
  const { id } = useParams();
  // "version" solo sirve para volver a leer la orden después de responder la solicitud.
  const [version, setVersion] = useState(0);
  const [error, setError] = useState('');
  const orden = obtenerOrden(id);

  if (!orden) {
    return (
      <MensajeVacio titulo="Esa orden no existe">
        <Link to="/admin/ordenes" className="btn btn-dark">Volver a las órdenes</Link>
      </MensajeVacio>
    );
  }
  const responder = (aprobar, respuesta) => {
    const resultado = responderSolicitud(orden.id, aprobar, respuesta);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setError('');
    setVersion(version + 1);
    mostrarAviso?.(aprobar ? 'La solicitud fue aprobada.' : 'La solicitud fue rechazada.');
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 d-print-none">
        <h1 className="titulo-seccion mb-0">Orden {orden.numero}</h1>
        <div className="d-flex gap-2">
          <Button variant="outline-dark" size="sm" onClick={() => window.print()}>Imprimir</Button>
          <Link to="/admin/ordenes" className="btn btn-dark btn-sm">Volver</Link>
        </div>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <TarjetaSolicitud
        key={version}
        solicitud={orden.solicitud}
        puedeResponder={usuario?.tipo === 'Administrador'}
        onResponder={responder}
      />
      <Boleta orden={orden} />
    </>
  );
}
