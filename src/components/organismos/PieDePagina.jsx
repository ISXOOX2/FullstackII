import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from '../atomos/Logo.jsx';
import FormularioNewsletter from '../moleculas/FormularioNewsletter.jsx';
import { ESTUDIO } from '../../data/estudio.js';

/** Pie de página: datos del estudio, enlaces y suscripción al boletín. */
export default function PieDePagina({ mostrarAviso }) {
  return (
    <footer className="pie-tienda mt-5 pt-5 pb-4 d-print-none">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <Logo />
            <p className="mt-3 text-muted small">{ESTUDIO.eslogan}</p>
            <address className="small mb-0">
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
              <li><Link to="/categorias">Estilos</Link></li>
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
        <hr />
        <p className="small text-muted text-center mb-0">
          © {new Date().getFullYear()} {ESTUDIO.nombre}. Proyecto académico DSY1104 · Desarrollo Fullstack II · DuocUC.
        </p>
      </Container>
    </footer>
  );
}
