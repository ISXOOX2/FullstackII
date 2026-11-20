import { useState } from 'react';
import { Badge, Button, Card, Form } from 'react-bootstrap';
import { ESTADOS_SOLICITUD, NOMBRE_SOLICITUD } from '../../services/ordenesService.js';
import { formatoFecha } from '../../utils/formato.js';

const COLOR = {
  [ESTADOS_SOLICITUD.PENDIENTE]: 'warning',
  [ESTADOS_SOLICITUD.APROBADA]: 'success',
  [ESTADOS_SOLICITUD.RECHAZADA]: 'danger',
};

/**
 * MOLÉCULA: muestra la solicitud de una orden (reembolso o cambio de fecha) en el panel.
 * Si puedeResponder es true y la solicitud está pendiente, muestra los botones Aprobar / Rechazar
 * y avisa al padre con onResponder(aprobar, respuesta).
 */
export default function TarjetaSolicitud({ solicitud, puedeResponder = false, onResponder }) {
  const [respuesta, setRespuesta] = useState('');
  if (!solicitud) return null;
  const pendiente = solicitud.estado === ESTADOS_SOLICITUD.PENDIENTE;

  return (
    <Card className="mb-4 tarjeta-solicitud">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
          <Card.Title as="h2" className="h5 mb-1">Solicitud de {NOMBRE_SOLICITUD[solicitud.tipo].toLowerCase()}</Card.Title>
          <Badge bg={COLOR[solicitud.estado]} className="fw-normal">{solicitud.estado}</Badge>
        </div>
        <p className="small text-muted mb-2">Enviada el {formatoFecha(solicitud.fechaSolicitud.slice(0, 10))}</p>
        <dl className="mb-0">
          <dt>Motivo</dt>
          <dd>{solicitud.motivo}</dd>
          <dt>Justificativo</dt>
          <dd>{solicitud.justificativo}</dd>
          {solicitud.nuevaFecha && (
            <>
              <dt>Nueva fecha y hora pedida</dt>
              <dd>{formatoFecha(solicitud.nuevaFecha)} a las {solicitud.nuevaHora}</dd>
            </>
          )}
          {solicitud.respuesta && (
            <>
              <dt>Respuesta del estudio</dt>
              <dd>{solicitud.respuesta}</dd>
            </>
          )}
        </dl>

        {pendiente && puedeResponder && (
          <div className="mt-3 d-print-none">
            <Form.Group controlId="respuesta-solicitud" className="mb-2">
              <Form.Label className="etiqueta-campo">Respuesta para el cliente (opcional)</Form.Label>
              <Form.Control as="textarea" rows={2} maxLength={300} value={respuesta} onChange={(e) => setRespuesta(e.target.value)} />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="dark" size="sm" onClick={() => onResponder(true, respuesta)}>Aprobar</Button>
              <Button variant="outline-danger" size="sm" onClick={() => onResponder(false, respuesta)}>Rechazar</Button>
            </div>
          </div>
        )}
        {pendiente && !puedeResponder && (
          <p className="small text-muted mt-3 mb-0">Solo el administrador puede aprobar o rechazar solicitudes.</p>
        )}
      </Card.Body>
    </Card>
  );
}
