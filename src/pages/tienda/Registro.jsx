import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import FormularioUsuario from '../../components/organismos/FormularioUsuario.jsx';
import { datosParaRegistroRemoto, registrarCliente } from '../../services/usuariosService.js';
import { api, mensajeDeError, servicioNoDisponible } from '../../services/api.js';

export default function Registro({ iniciarSesion, mostrarAviso }) {
  const navegar = useNavigate();

  /**
   * 1) Se registra en usuario-service (POST /api/usuarios). Si responde 400 o 409, se muestra
   *    su mensaje. Si está apagado, se sigue igual con los datos locales.
   * 2) Se guarda también una copia local (perfil, historial de reservas y panel).
   * 3) Se inicia sesión de inmediato.
   */
  const registrar = async (datos) => {
    try {
      await api.registrar(datosParaRegistroRemoto(datos));
    } catch (error) {
      if (!servicioNoDisponible(error)) return mensajeDeError(error);
    }
    const resultado = registrarCliente(datos);
    if (!resultado.ok) return resultado.error;
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
