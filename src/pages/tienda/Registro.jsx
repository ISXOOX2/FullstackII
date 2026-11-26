import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormularioUsuario from '../../components/organismos/FormularioUsuario.jsx';
import { registrarCliente } from '../../services/usuariosService.js';
import { apiUsuarios, mensajeDeError, USAR_API } from '../../services/api.js';
import { usuarioParaApi } from '../../services/adminApi.js';

export default function Registro({ iniciarSesion, mostrarAviso }) {
  const navegar = useNavigate();

  const registrar = async (datos) => {
    if (USAR_API) {
      // Con backend: ms-auth valida (mayor de 18, RUN, correo único...) y crea la cuenta
      try {
        await apiUsuarios.post('/auth/registro', usuarioParaApi(datos));
      } catch (error) {
        return mensajeDeError(error);
      }
    } else {
      const resultado = registrarCliente(datos);
      if (!resultado.ok) return resultado.error;
    }
    await iniciarSesion(datos.correo, datos.password); // el cliente queda conectado de inmediato
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
