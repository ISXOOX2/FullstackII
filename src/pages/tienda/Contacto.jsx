import { Col, Container, Row } from 'react-bootstrap';
import FormularioContacto from '../../components/organismos/FormularioContacto.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import { enviarMensaje } from '../../services/contactoService.js';
import { mensajeDeError } from '../../services/api.js';
import { ESTUDIO } from '../../data/estudio.js';

export default function Contacto({ mostrarAviso }) {

  // Devuelve true si se guardó: así el formulario solo se limpia cuando el mensaje llegó.
  const enviar = async (valores) => {
    try {
      await enviarMensaje(valores);
      mostrarAviso('Mensaje enviado. Te responderemos pronto.');
      return true;
    } catch (error) {
      mostrarAviso(mensajeDeError(error), 'danger');
      return false;
    }
  };

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Contacto' }]} />
      <h1 className="titulo-seccion">Contacto</h1>
      <Row className="g-4 g-md-5">
        <Col md={7}><FormularioContacto onEnviar={enviar} /></Col>
        <Col md={5}>
          <h2 className="h6 text-uppercase">Estudio</h2>
          <address>
            {ESTUDIO.direccion}<br />{ESTUDIO.horario}<br />{ESTUDIO.telefono}<br />{ESTUDIO.correo}<br />Instagram {ESTUDIO.instagram}
          </address>
        </Col>
      </Row>
    </Container>
  );
}
