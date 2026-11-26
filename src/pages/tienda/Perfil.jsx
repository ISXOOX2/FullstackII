import { useState } from 'react';
import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import FormularioUsuario from '../../components/organismos/FormularioUsuario.jsx';
import Boleta from '../../components/organismos/Boleta.jsx';
import FormularioSolicitud from '../../components/organismos/FormularioSolicitud.jsx';
import InsigniaEstado from '../../components/atomos/InsigniaEstado.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { actualizarUsuario, historialDeCompras, obtenerUsuario, usuarioPublico } from '../../services/usuariosService.js';
import { NOMBRE_SOLICITUD, TIPOS_SOLICITUD, crearSolicitud, puedeSolicitar } from '../../services/ordenesService.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';
import { mensajeDeError, USAR_API } from '../../services/api.js';
import { solicitarApi } from '../../services/reservasApi.js';
import { guardarUsuarioApi } from '../../services/adminApi.js';
import { sincronizarOrdenes } from '../../services/sincronizacion.js';

/** El cliente puede gestionar una reserva si al menos uno de los dos tipos de solicitud está permitido. */
const puedeGestionar = (orden) =>
  !puedeSolicitar(orden, TIPOS_SOLICITUD.CAMBIO) || !puedeSolicitar(orden, TIPOS_SOLICITUD.REEMBOLSO);

/** Mi perfil: editar mis datos, ver el historial de mis reservas y pedir un cambio de fecha o un reembolso. */
export default function Perfil({ usuario, actualizarSesion, mostrarAviso }) {
  const [ordenVista, setOrdenVista] = useState(null);
  const [ordenGestion, setOrdenGestion] = useState(null);
  const completo = obtenerUsuario(usuario.id);
  const historial = historialDeCompras(usuario.id);

  const guardar = async (datos) => {
    if (USAR_API) {
      // Con backend: PUT /usuarios/{id} en ms-auth (cada usuario solo puede editar su propia cuenta)
      try {
        actualizarSesion(await guardarUsuarioApi(usuario, { ...datos, tipo: null }));
      } catch (e) {
        return mensajeDeError(e);
      }
    } else {
      const resultado = actualizarUsuario(usuario.id, { ...datos, tipo: usuario.tipo });
      if (!resultado.ok) return resultado.error;
      actualizarSesion(usuarioPublico(resultado.usuario));
    }
    mostrarAviso('Tus datos se actualizaron correctamente.');
    return '';
  };

  /** Envía la solicitud; si alguna regla lo impide, el formulario muestra el error. */
  const enviarSolicitud = async (datos) => {
    if (USAR_API) {
      // Con backend: ms-reservas revisa los plazos (48 h, 24 h o 10 días) y guarda la solicitud
      try {
        await solicitarApi(ordenGestion.id, datos);
        await sincronizarOrdenes(usuario);
      } catch (error) {
        return mensajeDeError(error);
      }
    } else {
      const resultado = crearSolicitud(ordenGestion.id, datos);
      if (!resultado.ok) return resultado.error;
    }
    setOrdenGestion(null);
    mostrarAviso('Tu solicitud se envió. El estudio la revisará y verás la respuesta aquí.');
    return '';
  };

  return (
    <Container className="py-4">
      <h1 className="titulo-seccion">Mi perfil</h1>
      <Row className="g-4 g-md-5">
        <Col lg={6}>
          <h2 className="h5 mb-3">Mis datos</h2>
          <FormularioUsuario modo="perfil" inicial={completo} onEnviar={guardar} />
        </Col>
        <Col lg={6}>
          <h2 className="h5 mb-3">Mis reservas</h2>
          {historial.length === 0 ? (
            <MensajeVacio titulo="Aún no tienes reservas" texto="Cuando agendes una cita aparecerá aquí." />
          ) : (
            <div className="table-responsive">
              <Table size="sm" className="align-middle">
                <thead><tr><th scope="col">N° orden</th><th scope="col">Cita</th><th scope="col" className="text-end">Total</th><th scope="col">Estado</th><th scope="col"><span className="visually-hidden">Acciones</span></th></tr></thead>
                <tbody>
                  {historial.map((o) => (
                    <tr key={o.id}>
                      <td>{o.numero}</td>
                      <td>{o.cita ? `${formatoFecha(o.cita.fecha)} ${o.cita.hora}` : 'Solo tienda'}</td>
                      <td className="text-end">{formatoCLP(o.total)}</td>
                      <td>
                        <InsigniaEstado estado={o.estado} />
                        {o.solicitud && (
                          <small className="d-block text-muted">
                            {NOMBRE_SOLICITUD[o.solicitud.tipo]}: {o.solicitud.estado}
                          </small>
                        )}
                      </td>
                      <td className="text-nowrap">
                        <Button variant="link" size="sm" className="p-0" onClick={() => setOrdenVista(o)}>Ver boleta</Button>
                        {puedeGestionar(o) && (
                          <Button variant="link" size="sm" className="p-0 ms-2" onClick={() => setOrdenGestion(o)}>
                            {o.cita ? 'Cambiar o reembolsar' : 'Pedir reembolso'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={Boolean(ordenVista)} onHide={() => setOrdenVista(null)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title as="h2" className="h5">Detalle de la reserva</Modal.Title></Modal.Header>
        <Modal.Body>{ordenVista && <Boleta orden={ordenVista} />}</Modal.Body>
      </Modal>

      <Modal show={Boolean(ordenGestion)} onHide={() => setOrdenGestion(null)} centered>
        <Modal.Header closeButton><Modal.Title as="h2" className="h5">{ordenGestion?.cita ? 'Cambiar fecha o pedir reembolso' : 'Pedir reembolso'}</Modal.Title></Modal.Header>
        <Modal.Body>
          {ordenGestion && (
            <FormularioSolicitud orden={ordenGestion} onEnviar={enviarSolicitud} onCancelar={() => setOrdenGestion(null)} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
