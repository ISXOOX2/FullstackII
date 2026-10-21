import { Col, Container, Row } from 'react-bootstrap';
import FormularioContacto from '../../components/organismos/FormularioContacto.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import { guardarMensaje } from '../../services/contactoService.js';
import { useAvisos } from '../../context/AvisosContext.jsx';
import { ESTUDIO } from '../../config/estudio.js';

export default function Contacto() {
  const { mostrar } = useAvisos();

  const enviar = (valores) => {
    guardarMensaje(valores);
    mostrar('Mensaje enviado. Te responderemos pronto.');
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
