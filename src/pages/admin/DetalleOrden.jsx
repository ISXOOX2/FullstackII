import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import Boleta from '../../components/organismos/Boleta.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import TarjetaSolicitud from '../../components/moleculas/TarjetaSolicitud.jsx';
import FormularioCambioEstado from '../../components/organismos/FormularioCambioEstado.jsx';
import { cambiarEstadoOrden, obtenerOrden, responderSolicitud } from '../../services/ordenesService.js';
import { mensajeDeError, USAR_API } from '../../services/api.js';
import { cambiarEstadoApi, responderSolicitudApi } from '../../services/reservasApi.js';
import { sincronizarOrdenes } from '../../services/sincronizacion.js';

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
  const responder = async (aprobar, respuesta) => {
    if (USAR_API) {
      // Con backend: ms-reservas aprueba o rechaza (y si es reembolso, pide a ms-catalogo reponer el stock)
      try {
        await responderSolicitudApi(orden.id, orden.solicitud.id, aprobar, respuesta);
        await sincronizarOrdenes(usuario);
      } catch (e) {
        setError(mensajeDeError(e));
        return;
      }
    } else {
      const resultado = responderSolicitud(orden.id, aprobar, respuesta);
      if (!resultado.ok) {
        setError(resultado.error);
        return;
      }
    }
    setError('');
    setVersion(version + 1);
    mostrarAviso?.(aprobar ? 'La solicitud fue aprobada.' : 'La solicitud fue rechazada.');
  };

  /** Cambio manual de estado: devuelve '' si salió bien o el mensaje de error para el formulario. */
  const cambiarEstado = async (estado, motivo) => {
    if (USAR_API) {
      try {
        await cambiarEstadoApi(orden.id, estado, motivo);
        await sincronizarOrdenes(usuario);
      } catch (e) {
        return mensajeDeError(e);
      }
    } else {
      const responsable = `${usuario?.nombre ?? ''} ${usuario?.apellidos ?? ''}`.trim();
      const resultado = cambiarEstadoOrden(orden.id, estado, motivo, responsable);
      if (!resultado.ok) return resultado.error;
    }
    setVersion(version + 1);
    mostrarAviso?.(`La orden pasó a «${estado}».`);
    return '';
  };

  const esAdmin = usuario?.tipo === 'Administrador';

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
        puedeResponder={esAdmin}
        onResponder={responder}
      />
      <FormularioCambioEstado key={`estado-${version}`} orden={orden} puedeCambiar={esAdmin} onCambiar={cambiarEstado} />
      <Boleta orden={orden} />
    </>
  );
}
