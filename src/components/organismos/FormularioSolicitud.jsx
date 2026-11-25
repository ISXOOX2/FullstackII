// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • ORGANISMO: formulario con el que el cliente pide un REEMBOLSO o un CAMBIO de fecha y hora.
// • Recibe por props la orden y la función onEnviar; el componente padre (Perfil) decide qué hacer.
// • Usa el hook useFormulario para validar en tiempo real (motivo, justificativo, fecha y hora).
// • Renderizado condicional: los campos de fecha y hora solo aparecen si elige "cambio".
// • Las reglas de plazo (48 h / 24 h; 10 días para compras de la tienda) vienen de
//   ordenesService.puedeSolicitar. Una compra sin cita solo puede pedir reembolso.
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioSolicitud } from '../../utils/validaciones.js';
import { DIAS_RETRACTO_TIENDA, MOTIVOS_SOLICITUD } from '../../data/estudio.js';
import { NOMBRE_SOLICITUD, TIPOS_SOLICITUD, horasDisponibles, puedeSolicitar } from '../../services/ordenesService.js';
import { formatoFecha } from '../../utils/formato.js';

/**
 * Props:
 *  - orden     : la reserva pagada sobre la que se hace la solicitud.
 *  - onEnviar  : función (datos) -> '' si salió bien o el mensaje de error.
 *  - onCancelar: cierra el formulario sin enviar.
 */
export default function FormularioSolicitud({ orden, onEnviar, onCancelar }) {
  // Qué tipos puede pedir según los plazos (si no puede, se muestra el motivo).
  const bloqueoReembolso = puedeSolicitar(orden, TIPOS_SOLICITUD.REEMBOLSO);
  const bloqueoCambio = puedeSolicitar(orden, TIPOS_SOLICITUD.CAMBIO);
  const tipoInicial = !bloqueoCambio ? TIPOS_SOLICITUD.CAMBIO : TIPOS_SOLICITUD.REEMBOLSO;

  const f = useFormulario(
    { tipo: tipoInicial, motivo: '', justificativo: '', fecha: '', hora: '' },
    validarFormularioSolicitud,
  );
  const [errorGeneral, setErrorGeneral] = useState('');

  const esCambio = f.valores.tipo === TIPOS_SOLICITUD.CAMBIO;
  // Horas libres del mismo tatuador en la fecha elegida (sin contar la propia reserva).
  const horas = orden.cita && f.valores.fecha && !f.errores.fecha
    ? horasDisponibles(f.valores.fecha, orden.cita.tatuadorId, orden.id)
    : [];

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    // await: si onEnviar llama a la API, se espera su respuesta antes de mostrar el error
    setErrorGeneral((await onEnviar(f.valores)) || '');
  };

  const p = (campo) => ({
    name: campo, value: f.valores[campo], onChange: f.manejarCambio, onBlur: f.manejarBlur, error: f.visibles[campo],
  });

  const opcionTipo = (tipo, bloqueo) => (
    <Form.Check
      key={tipo}
      type="radio"
      id={`solicitud-${tipo}`}
      name="tipo"
      value={tipo}
      label={NOMBRE_SOLICITUD[tipo]}
      checked={f.valores.tipo === tipo}
      onChange={f.manejarCambio}
      disabled={Boolean(bloqueo)}
    />
  );

  return (
    <Form onSubmit={enviar} noValidate aria-label="Solicitud sobre la reserva">
      <p className="text-muted small">
        {orden.cita
          ? <>Reserva <strong>{orden.numero}</strong> · cita actual: {formatoFecha(orden.cita.fecha)} a las {orden.cita.hora}</>
          : <>Compra <strong>{orden.numero}</strong> de la tienda · tienes {DIAS_RETRACTO_TIENDA} días desde la compra para arrepentirte (producto sin abrir).</>}
      </p>
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}

      <fieldset className="mb-3">
        <legend className="etiqueta-campo">¿Qué necesitas?</legend>
        {opcionTipo(TIPOS_SOLICITUD.CAMBIO, bloqueoCambio)}
        {bloqueoCambio && <small className="d-block text-muted ms-4">{bloqueoCambio}</small>}
        {opcionTipo(TIPOS_SOLICITUD.REEMBOLSO, bloqueoReembolso)}
        {bloqueoReembolso && <small className="d-block text-muted ms-4">{bloqueoReembolso}</small>}
      </fieldset>

      <CampoFormulario id="solicitud-motivo" etiqueta="Motivo" tipo="select" {...p('motivo')}>
        <option value="">Selecciona un motivo</option>
        {MOTIVOS_SOLICITUD.map((m) => <option key={m} value={m}>{m}</option>)}
      </CampoFormulario>

      <CampoFormulario
        id="solicitud-justificativo" etiqueta="Justificativo" tipo="textarea" rows={3} maxLength={300}
        ayuda={`Cuéntanos la razón (mínimo 10 caracteres). ${f.valores.justificativo.length}/300`}
        {...p('justificativo')}
      />

      {esCambio && (
        <Row>
          <Col sm={6}>
            <CampoFormulario id="solicitud-fecha" etiqueta="Nueva fecha" tipo="date" {...p('fecha')} />
          </Col>
          <Col sm={6}>
            <CampoFormulario id="solicitud-hora" etiqueta="Nueva hora" tipo="select" disabled={horas.length === 0} {...p('hora')}>
              <option value="">{f.valores.fecha ? 'Selecciona una hora' : 'Primero elige la fecha'}</option>
              {horas.map((h) => <option key={h} value={h}>{h}</option>)}
            </CampoFormulario>
          </Col>
        </Row>
      )}

      {!esCambio && (
        <Alert variant="light" className="small">
          Si el estudio aprueba el reembolso, la reserva queda anulada y se devuelve el total pagado.
        </Alert>
      )}

      <div className="d-flex gap-2 justify-content-end">
        <Button variant="outline-dark" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" variant="dark">Enviar solicitud</Button>
      </div>
    </Form>
  );
}
