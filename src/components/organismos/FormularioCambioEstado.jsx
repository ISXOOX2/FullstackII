// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • ORGANISMO del panel: el administrador cambia el estado de una orden a mano.
// • El select solo ofrece los estados PERMITIDOS desde el estado actual (TRANSICIONES).
// • Pide un motivo obligatorio; las reglas de agenda las revisa ordenesService.cambiarEstadoOrden.
// • También muestra el historial de cambios (quién, cuándo, de qué estado a cuál y por qué).
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarCambioEstado } from '../../utils/validaciones.js';
import { estadosPermitidos } from '../../services/ordenesService.js';
import { formatoFecha } from '../../utils/formato.js';

/**
 * Props:
 *  - orden          : la orden que se está viendo.
 *  - puedeCambiar   : true solo para el administrador.
 *  - onCambiar      : función (estado, motivo) -> '' si salió bien o el mensaje de error.
 */
export default function FormularioCambioEstado({ orden, puedeCambiar = false, onCambiar }) {
  const opciones = estadosPermitidos(orden);
  const f = useFormulario({ estado: '', motivo: '' }, validarCambioEstado);
  const [error, setError] = useState('');
  const historial = orden.historialEstados || [];

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    const mensaje = await onCambiar(f.valores.estado, f.valores.motivo); // puede ir a la API
    setError(mensaje || '');
    if (!mensaje) f.reiniciar({ estado: '', motivo: '' });
  };

  const p = (campo) => ({
    name: campo, value: f.valores[campo], onChange: f.manejarCambio, onBlur: f.manejarBlur, error: f.visibles[campo],
  });

  return (
    <Card className="mb-4 d-print-none">
      <Card.Body>
        <Card.Title as="h2" className="h5">Estado de la orden</Card.Title>

        {puedeCambiar && opciones.length > 0 && (
          <Form onSubmit={enviar} noValidate aria-label="Cambiar estado de la orden">
            {error && <Alert variant="danger" role="alert">{error}</Alert>}
            <Row className="g-2">
              <Col md={4}>
                <CampoFormulario id="nuevo-estado" etiqueta="Nuevo estado" tipo="select" {...p('estado')}>
                  <option value="">Selecciona</option>
                  {opciones.map((e) => <option key={e} value={e}>{e}</option>)}
                </CampoFormulario>
              </Col>
              <Col md={8}>
                <CampoFormulario
                  id="motivo-estado" etiqueta="Motivo del cambio" maxLength={300}
                  placeholder="Ej: el banco reversó el pago" {...p('motivo')}
                />
              </Col>
            </Row>
            <Button type="submit" variant="dark" size="sm">Cambiar estado</Button>
          </Form>
        )}
        {puedeCambiar && opciones.length === 0 && (
          <p className="text-muted small mb-0">Una orden en estado «{orden.estado}» ya no puede cambiar.</p>
        )}
        {!puedeCambiar && (
          <p className="text-muted small mb-0">Solo el administrador puede cambiar el estado de una orden.</p>
        )}

        {historial.length > 0 && (
          <>
            <h3 className="h6 mt-4">Historial de cambios</h3>
            <ul className="list-unstyled small mb-0">
              {historial.map((h) => (
                <li key={h.fecha} className="border-top py-2">
                  <strong>{h.de} → {h.a}</strong> · {formatoFecha(h.fecha.slice(0, 10))}
                  {h.responsable && ` · ${h.responsable}`}
                  <span className="d-block text-muted">{h.motivo}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
