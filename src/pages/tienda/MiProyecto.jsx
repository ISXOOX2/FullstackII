import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import Migas from '../../components/moleculas/Migas.jsx';
import FormularioProyecto from '../../components/organismos/FormularioProyecto.jsx';
import { enviarProyecto } from '../../services/proyectosService.js';
import { mensajeDeError } from '../../services/api.js';
import { DIAS_HABILES_CONTACTO } from '../../data/estudio.js';
import { formatoFechaLarga, nombreCompleto } from '../../utils/formato.js';

/**
 * Mi proyecto: para el cliente que ya tiene una idea propia (si no la tiene, elige un diseño
 * del catálogo). Envía su idea y el estudio lo contacta en 3 días hábiles.
 */
export default function MiProyecto({ usuario, mostrarAviso }) {
  const [enviado, setEnviado] = useState(null);

  const enviar = async (datos) => {
    try {
      setEnviado(await enviarProyecto(datos, usuario?.id ?? null));
    } catch (error) {
      mostrarAviso?.(mensajeDeError(error), 'danger');
    }
  };

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Mi proyecto' }]} />
      <Row className="g-4 g-md-5">
        <Col lg={5}>
          <h1 className="titulo-seccion">Mi proyecto</h1>
          <p>
            ¿Ya tienes una idea para tu tatuaje? Cuéntanos qué quieres, en qué zona del cuerpo y, si tienes, adjunta
            una imagen de referencia (un boceto, una foto o una captura).
          </p>
          <p>
            En un plazo de <strong>{DIAS_HABILES_CONTACTO} días hábiles</strong> te contactaremos por correo para
            evaluar tu idea, cotizarla y coordinar una sesión con el tatuador que mejor calce con tu estilo.
          </p>
          <p className="text-muted small mb-0">
            ¿Todavía no sabes qué tatuarte? Mira nuestros <Link to="/productos">diseños</Link> y reserva uno.
          </p>
        </Col>
        <Col lg={7}>
          {enviado ? (
            <Alert variant="success" role="status">
              <Alert.Heading as="h2" className="h5">¡Recibimos tu proyecto!</Alert.Heading>
              <p className="mb-2">
                Gracias, {enviado.nombre}. Te escribiremos a <strong>{enviado.correo}</strong> a más tardar
                el <strong>{formatoFechaLarga(enviado.contactarAntesDe)}</strong>.
              </p>
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setEnviado(null)}>
                Enviar otra idea
              </button>
            </Alert>
          ) : (
            <FormularioProyecto
              valoresIniciales={{ nombre: usuario ? nombreCompleto(usuario) : '', correo: usuario?.correo ?? '' }}
              onEnviar={enviar}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
