import { Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioCheckout, validarFechaCita } from '../../utils/validaciones.js';
import { useEffect, useState } from 'react';
import { horasDisponibles, horasLibresProximas } from '../../services/ordenesService.js';
import { USAR_API } from '../../services/api.js';
import { horasDisponiblesApi } from '../../services/reservasApi.js';
import { TATUADORES } from '../../data/tatuadores.js';
import {
  DIAS_ALERTA_AGENDA, DIAS_MAXIMOS_AGENDA, HORAS_CITA, HORAS_LIBRES_CRITICAS, LADOS_CUERPO, ZONAS_CUERPO,
} from '../../data/estudio.js';
import { fechaISO, formatoCLP, sumarDias } from '../../utils/formato.js';

/**
 * Datos del cliente + datos de la cita + simulación del pago.
 * Props:
 *  - valoresIniciales : datos para pre-llenar (usuario conectado o intento anterior).
 *  - total            : monto a pagar (se muestra en el botón).
 *  - ordenId          : si es un reintento, esa orden no bloquea sus propias horas.
 *  - procesando       : true mientras se "paga" (deshabilita el botón).
 *  - conCita          : false si el carrito solo tiene artículos de la tienda (no se agenda cita).
 *  - onPagar(valores) : se llama solo si el formulario es válido.
 */
export default function FormularioCheckout({
  valoresIniciales, total, ordenId = null, procesando = false, conCita = true, onPagar,
}) {
  const hoy = fechaISO();
  const f = useFormulario(valoresIniciales, (datos) => {
    const errores = validarFormularioCheckout(datos, new Date(), { conCita });
    if (!conCita) return errores;
    // Si la hora elegida ya no está disponible (otro cliente la tomó) se avisa.
    // (con backend, esta revisión la hace ms-reservas al crear la orden)
    if (!USAR_API && !errores.hora && !errores.fecha && datos.tatuadorId &&
        !horasDisponibles(datos.fecha, datos.tatuadorId, ordenId).includes(datos.hora)) {
      errores.hora = 'Ese horario ya fue reservado. Elige otro.';
    }
    return errores;
  });

  const { fecha, tatuadorId } = f.valores;
  const fechaValida = !validarFechaCita(fecha);
  // Con backend, las horas libres se piden a ms-reservas cada vez que cambia la fecha o el tatuador.
  const [horasApi, setHorasApi] = useState(null);
  useEffect(() => {
    if (!USAR_API || !fechaValida || !tatuadorId) return undefined;
    let activo = true;
    horasDisponiblesApi(fecha, tatuadorId)
      .then((libres) => activo && setHorasApi(libres))
      .catch(() => activo && setHorasApi([]));
    return () => { activo = false; };
  }, [fecha, tatuadorId, fechaValida]);

  // Horarios libres para la fecha y el tatuador elegidos (sin backend se recalculan en cada render).
  const horasLocales = fechaValida && tatuadorId ? horasDisponibles(fecha, tatuadorId, ordenId) : [];
  const horas = USAR_API ? (fechaValida && tatuadorId ? horasApi ?? [] : []) : horasLocales;

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    onPagar(f.valores);
  };

  const propsCampo = (campo) => ({
    name: campo,
    value: f.valores[campo],
    onChange: f.manejarCambio,
    onBlur: f.manejarBlur,
    error: f.visibles[campo],
  });

  return (
    <Form onSubmit={enviar} noValidate aria-label="Datos de la reserva">
      <h2 className="h5 mb-3">Tus datos</h2>
      <Row>
        <Col md={6}><CampoFormulario id="c-nombre" etiqueta="Nombre" autoComplete="given-name" maxLength={50} {...propsCampo('nombre')} /></Col>
        <Col md={6}><CampoFormulario id="c-apellidos" etiqueta="Apellidos" autoComplete="family-name" maxLength={100} {...propsCampo('apellidos')} /></Col>
        <Col md={6}><CampoFormulario id="c-correo" etiqueta="Correo electrónico" autoComplete="email" tipo="email" {...propsCampo('correo')} /></Col>
        <Col md={6}><CampoFormulario id="c-telefono" etiqueta="Teléfono" autoComplete="tel" tipo="tel" placeholder="+56912345678" {...propsCampo('telefono')} /></Col>
      </Row>

      {!conCita && (
        <p className="small text-muted">
          Tu carrito solo tiene productos de la tienda: no necesitas agendar. Los retiras en el estudio de martes a sábado.
        </p>
      )}
      {conCita && (<>
      <h2 className="h5 mt-3 mb-3">Tu cita</h2>
      <Row>
        <Col md={6}>
          <CampoFormulario
            id="c-tatuador" etiqueta="Tatuador/a" tipo="select" {...propsCampo('tatuadorId')}
            onChange={(e) => { f.manejarCambio(e); f.setValores((a) => ({ ...a, hora: '' })); }}
          >
            <option value="">Elige con quién tatuarte</option>
            {TATUADORES.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </CampoFormulario>
          {/* Aviso al cliente: si al tatuador le quedan pocas horas esta semana, se lo decimos */}
          {tatuadorId && horasLibresProximas(tatuadorId) <= HORAS_LIBRES_CRITICAS && (
            <p className="small text-warning-emphasis mt-n2 mb-3" role="status">
              ¡Quedan pocas horas! Solo {horasLibresProximas(tatuadorId)} disponible(s) en los próximos {DIAS_ALERTA_AGENDA} días de atención.
            </p>
          )}
        </Col>
        <Col md={6}>
          <CampoFormulario
            id="c-fecha" etiqueta="Fecha" tipo="date" min={sumarDias(hoy, 1)} max={sumarDias(hoy, DIAS_MAXIMOS_AGENDA)}
            {...propsCampo('fecha')}
            onChange={(e) => { f.manejarCambio(e); f.setValores((a) => ({ ...a, hora: '' })); }}
            ayuda="Atendemos de martes a sábado."
          />
        </Col>
        <Col md={6}>
          <CampoFormulario id="c-hora" etiqueta="Horario" tipo="select" disabled={horas.length === 0} {...propsCampo('hora')}>
            <option value="">
              {fechaValida && tatuadorId
                ? (horas.length ? 'Elige un horario' : 'Sin horarios libres ese día')
                : 'Elige primero fecha y tatuador/a'}
            </option>
            {HORAS_CITA.filter((h) => horas.includes(h)).map((h) => <option key={h} value={h}>{h} hrs</option>)}
          </CampoFormulario>
        </Col>
        <Col md={6}>
          {/* Zona: lista desplegable con las zonas del estudio (no se escribe a mano) */}
          <CampoFormulario id="c-zona" etiqueta="Zona del cuerpo" tipo="select" {...propsCampo('zonaCuerpo')}>
            <option value="">Elige la zona</option>
            {ZONAS_CUERPO.map((z) => <option key={z} value={z}>{z}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={6}>
          <CampoFormulario id="c-lado" etiqueta="Lado" tipo="select" opcional {...propsCampo('ladoCuerpo')}>
            <option value="">Sin preferencia</option>
            {LADOS_CUERPO.map((l) => <option key={l} value={l}>{l}</option>)}
          </CampoFormulario>
        </Col>
        <Col xs={12}>
          <CampoFormulario
            id="c-indicaciones" etiqueta="Indicaciones para el tatuador" tipo="textarea" rows={3} maxLength={300}
            opcional {...propsCampo('indicaciones')}
          />
        </Col>
      </Row>
      </>)}

      <h2 className="h5 mt-3 mb-3">Pago (simulado)</h2>
      <p className="small text-muted">
        Este sitio es un proyecto académico: no se cobra dinero real. Elige qué resultado quieres simular.
      </p>
      <CampoFormulario id="c-resultado" etiqueta="Resultado de la pasarela de pago" tipo="select" {...propsCampo('resultadoPago')}>
        <option value="aprobado">Pago aprobado</option>
        <option value="rechazado">Pago rechazado</option>
      </CampoFormulario>

      <Button type="submit" variant="dark" size="lg" className="w-100" disabled={procesando}>
        {procesando ? 'Procesando pago…' : `Pagar ahora ${formatoCLP(total)}`}
      </Button>
    </Form>
  );
}
