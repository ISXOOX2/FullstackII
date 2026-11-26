import { useState } from 'react';
import { Badge, Card, Col, Form, Row } from 'react-bootstrap';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import {
  ESTADOS_PROYECTO, actualizarEstadoProyecto, estaAtrasado, listarProyectos,
} from '../../services/proyectosService.js';
import { listarMensajes } from '../../services/contactoService.js';
import { mensajeDeError } from '../../services/api.js';
import { formatoFecha } from '../../utils/formato.js';
import { fuenteImagen } from '../../utils/imagenes.js';
import images from '../../assets/images.js';

/**
 * Panel · Proyectos de clientes ("Mi proyecto"). El personal ve cada idea con su imagen y
 * la fecha límite de contacto (3 días hábiles), y va cambiando el estado.
 */
export default function Proyectos({ mostrarAviso }) {
  const [version, setVersion] = useState(0);
  const [soloNuevos, setSoloNuevos] = useState(false);
  const proyectos = listarProyectos().filter((p) => !soloNuevos || p.estado === 'Nuevo');

  const mensajes = listarMensajes();

  const cambiar = async (proyecto, estado) => {
    try {
      await actualizarEstadoProyecto(proyecto.id, estado);
      mostrarAviso(`El proyecto de ${proyecto.nombre} quedó «${estado}».`);
      setVersion((v) => v + 1);
    } catch (error) {
      mostrarAviso(mensajeDeError(error), 'danger');
    }
  };

  return (
    <>
      <h1 className="titulo-seccion">Proyectos y mensajes de clientes</h1>
      <p className="text-muted">Ideas propias enviadas desde «Mi proyecto». Hay que contactar a cada cliente en 3 días hábiles.</p>
      <Form.Check
        id="solo-proyectos-nuevos" type="switch" className="mb-3" label="Mostrar solo los nuevos"
        checked={soloNuevos} onChange={(e) => setSoloNuevos(e.target.checked)}
      />
      {proyectos.length === 0 && <MensajeVacio titulo="No hay proyectos" texto="Cuando un cliente envíe su idea aparecerá aquí." />}
      <Row xs={1} lg={2} className="g-4" data-version={version}>
        {proyectos.map((p) => {
          const foto = fuenteImagen(p.imagen, images);
          return (
            <Col key={p.id}>
              <Card className={`h-100 ${estaAtrasado(p) ? 'border-danger' : ''}`}>
                <Card.Body>
                  <div className="d-flex gap-3">
                    {foto && <img src={foto} alt={`Referencia de ${p.nombre}`} className="miniatura-proyecto" />}
                    <div className="flex-grow-1">
                      <Card.Title as="h2" className="h6 mb-1">{p.nombre}</Card.Title>
                      <a href={`mailto:${p.correo}`} className="small">{p.correo}</a>
                      <p className="small text-muted mb-2">
                        {p.zonaCuerpo}{p.lado && ` (${p.lado.toLowerCase()})`} · recibido el {formatoFecha(p.fecha)}
                      </p>
                    </div>
                  </div>
                  <p className="mb-3">{p.idea}</p>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <Form.Select
                      size="sm" className="w-auto" aria-label={`Estado del proyecto de ${p.nombre}`}
                      value={p.estado} onChange={(e) => cambiar(p, e.target.value)}
                    >
                      {ESTADOS_PROYECTO.map((e) => <option key={e} value={e}>{e}</option>)}
                    </Form.Select>
                    <small className="text-muted">Contactar antes del {formatoFecha(p.contactarAntesDe)}</small>
                    {estaAtrasado(p) && <Badge bg="danger">Atrasado</Badge>}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <h2 className="titulo-seccion h4 mt-5" id="mensajes-contacto">Mensajes de contacto</h2>
      {mensajes.length === 0 && <MensajeVacio titulo="No hay mensajes" texto="Los mensajes del formulario de contacto aparecerán aquí." />}
      <Row xs={1} lg={2} className="g-3">
        {mensajes.map((m) => (
          <Col key={m.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title as="h3" className="h6 mb-1">{m.nombre}</Card.Title>
                <a href={`mailto:${m.correo}`} className="small">{m.correo}</a>
                <span className="small text-muted"> · {formatoFecha(String(m.fecha).slice(0, 10))}</span>
                <p className="mb-0 mt-2">{m.comentario}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
