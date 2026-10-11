import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormularioUsuario from '../../components/tienda/FormularioUsuario.jsx';
import { registrarCliente } from '../../services/usuariosService.js';
import { useSesion } from '../../context/SesionContext.jsx';
import { useAvisos } from '../../context/AvisosContext.jsx';

export default function Registro() {
  const { iniciarSesion } = useSesion();
  const { mostrar } = useAvisos();
  const navegar = useNavigate();

  const registrar = (datos) => {
    const resultado = registrarCliente(datos);
    if (!resultado.ok) return resultado.error;
    iniciarSesion(datos.correo, datos.password); // el cliente queda conectado de inmediato
    mostrar('¡Cuenta creada! Ya puedes reservar tu hora.');
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
