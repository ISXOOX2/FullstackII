import { useState } from 'react';
import { Button, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import FormularioUsuario from '../../components/tienda/FormularioUsuario.jsx';
import Boleta from '../../components/comunes/Boleta.jsx';
import InsigniaEstado from '../../components/comunes/InsigniaEstado.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { useSesion } from '../../context/SesionContext.jsx';
import { useAvisos } from '../../context/AvisosContext.jsx';
import { actualizarUsuario, historialDeCompras, obtenerUsuario, usuarioPublico } from '../../services/usuariosService.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';

/** Mi perfil: editar mis datos e ver el historial de mis reservas. */
export default function Perfil() {
  const { usuario, actualizarSesion } = useSesion();
  const { mostrar } = useAvisos();
  const [ordenVista, setOrdenVista] = useState(null);
  const completo = obtenerUsuario(usuario.id);
  const historial = historialDeCompras(usuario.id);

  const guardar = (datos) => {
    const resultado = actualizarUsuario(usuario.id, { ...datos, tipo: usuario.tipo });
    if (!resultado.ok) return resultado.error;
    actualizarSesion(usuarioPublico(resultado.usuario));
    mostrar('Tus datos se actualizaron correctamente.');
    return '';
  };

  return (
    <Container className="py-4">
      <h1 className="titulo-seccion">Mi perfil</h1>
      <Row className="g-5">
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
                <thead><tr><th scope="col">N° orden</th><th scope="col">Cita</th><th scope="col" className="text-end">Total</th><th scope="col">Estado</th><th scope="col"><span className="visually-hidden">Ver</span></th></tr></thead>
                <tbody>
                  {historial.map((o) => (
                    <tr key={o.id}>
                      <td>{o.numero}</td>
                      <td>{formatoFecha(o.cita.fecha)} {o.cita.hora}</td>
                      <td className="text-end">{formatoCLP(o.total)}</td>
                      <td><InsigniaEstado estado={o.estado} /></td>
                      <td><Button variant="link" size="sm" className="p-0" onClick={() => setOrdenVista(o)}>Ver boleta</Button></td>
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
    </Container>
  );
}
