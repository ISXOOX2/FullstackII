import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import FormularioLogin from '../../components/organismos/FormularioLogin.jsx';
import { CUENTAS_DEMO } from '../../data/estudio.js';

export default function Login({ iniciarSesion, mostrarAviso }) {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  /** Devuelve '' si el ingreso fue correcto, o el mensaje de error para el formulario. */
  const ingresar = async ({ correo, password }) => {
    const resultado = await iniciarSesion(correo, password); // espera la respuesta de usuario-service
    if (!resultado.ok) return resultado.error;
    mostrarAviso(`¡Bienvenido/a, ${resultado.usuario.nombre}!`);
    // Admin y vendedor van al panel; el cliente vuelve a donde estaba (o al inicio).
    const destino = ubicacion.state?.desde || (resultado.usuario.tipo === 'Cliente' ? '/' : '/admin');
    navegar(destino, { replace: true });
    return '';
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center g-4">
        <Col md={6} lg={5}>
          <h1 className="titulo-seccion">Iniciar sesión</h1>
          <FormularioLogin onEnviar={ingresar} />
          <p className="mt-3 small">¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </Col>
        <Col md={6} lg={5}>
          <Card className="cuentas-demo">
            <Card.Body>
              <Card.Title as="h2" className="h6 text-uppercase">Cuentas de demostración</Card.Title>
              <Card.Text className="small text-muted">Para revisar el proyecto sin registrarte:</Card.Text>
              <Table responsive size="sm" className="mb-0 small">
                <thead><tr><th>Rol</th><th>Correo</th><th>Clave</th></tr></thead>
                <tbody>
                  {CUENTAS_DEMO.map((c) => (
                    <tr key={c.rol}><td>{c.rol}</td><td>{c.correo}</td><td><code>{c.password}</code></td></tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
