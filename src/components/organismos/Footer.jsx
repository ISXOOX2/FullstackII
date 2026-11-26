import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from '../atomos/Logo.jsx';
import FormularioNewsletter from '../moleculas/FormularioNewsletter.jsx';
import { ESTUDIO } from '../../data/estudio.js';

/** ORGANISMO · Footer (pie de página, nombre de la diapositiva React III): datos del estudio, enlaces y boletín. */
export default function Footer({ mostrarAviso }) {
  return (
    <footer className="pie-tienda mt-5 pt-5 pb-4 d-print-none">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <Logo />
            <address className="small mb-0 mt-3">
              {ESTUDIO.direccion}<br />
              {ESTUDIO.horario}<br />
              {ESTUDIO.telefono} · {ESTUDIO.correo}<br />
              Instagram {ESTUDIO.instagram}
            </address>
          </Col>
          <Col xs={6} md={2}>
            <h2 className="h6 text-uppercase">Explora</h2>
            <ul className="list-unstyled small">
              <li><Link to="/productos">Diseños</Link></li>
              <li><Link to="/mi-proyecto">Mi proyecto</Link></li>
              <li><Link to="/tienda">Tienda</Link></li>
              <li><Link to="/resenas">Reseñas</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
              <li><Link to="/blogs">Blog</Link></li>
            </ul>
          </Col>
          <Col xs={6} md={2}>
            <h2 className="h6 text-uppercase">Estudio</h2>
            <ul className="list-unstyled small">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/login">Iniciar sesión</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <FormularioNewsletter mostrarAviso={mostrarAviso} />
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
