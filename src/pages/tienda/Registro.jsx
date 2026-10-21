import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormularioUsuario from '../../components/organismos/FormularioUsuario.jsx';
import { registrarCliente } from '../../services/usuariosService.js';

export default function Registro({ iniciarSesion, mostrarAviso }) {
  const navegar = useNavigate();

  const registrar = (datos) => {
    const resultado = registrarCliente(datos);
    if (!resultado.ok) return resultado.error;
    iniciarSesion(datos.correo, datos.password); // el cliente queda conectado de inmediato
    mostrarAviso('¡Cuenta creada! Ya puedes reservar tu hora.');
    navegar('/', { replace: true });
    return '';
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="titulo-seccion">Crear cuenta</h1>
          <FormularioUsuario modo="registro" onEnviar={registrar} />
          <p className="mt-3 small">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </Col>
      </Row>
    </Container>
  );
}
