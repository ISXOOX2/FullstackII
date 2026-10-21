import { Suspense } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Nav, Row } from 'react-bootstrap';
import Logo from '../atomos/Logo.jsx';
import Cargando from '../atomos/Cargando.jsx';

/**
 * PLANTILLA · Estructura del panel: menú lateral + contenido (<Outlet/>). El menú depende del rol:
 *  - Administrador: todo.
 *  - Vendedor: solo Órdenes y Productos (este último en modo lectura).
 */
export default function LayoutAdmin({ usuario, onCerrarSesion }) {
  const navegar = useNavigate();
  const esAdmin = usuario.tipo === 'Administrador';

  const salir = () => {
    onCerrarSesion();
    navegar('/');
  };

  return (
    <div className="panel-admin">
      <header className="panel-cabecera d-print-none">
        <Container fluid className="d-flex justify-content-between align-items-center py-2 px-3">
          <Link to="/" className="text-decoration-none text-dark"><Logo alto={28} /></Link>
          <div className="d-flex align-items-center gap-3">
            <span className="small d-none d-sm-inline">{usuario.nombre} {usuario.apellidos} · <strong>{usuario.tipo}</strong></span>
            <Button variant="outline-dark" size="sm" onClick={salir}>Cerrar sesión</Button>
          </div>
        </Container>
      </header>
      <Container fluid>
        <Row>
          <Col lg={2} className="panel-menu py-3 d-print-none">
            <Nav as="nav" className="flex-lg-column flex-row flex-wrap gap-1" aria-label="Menú del panel">
              {esAdmin && <Nav.Link as={NavLink} to="/admin" end>Dashboard</Nav.Link>}
              <Nav.Link as={NavLink} to="/admin/ordenes">Órdenes</Nav.Link>
              <Nav.Link as={NavLink} to="/admin/productos">Productos</Nav.Link>
              {esAdmin && <Nav.Link as={NavLink} to="/admin/categorias">Categorías</Nav.Link>}
              {esAdmin && <Nav.Link as={NavLink} to="/admin/usuarios">Usuarios</Nav.Link>}
              {esAdmin && <Nav.Link as={NavLink} to="/admin/reportes">Reportes</Nav.Link>}
              <Nav.Link as={NavLink} to="/perfil">Mi perfil</Nav.Link>
              <Nav.Link as={NavLink} to="/">Ir a la tienda</Nav.Link>
            </Nav>
          </Col>
          <Col xs={12} lg={10} className="py-4 px-lg-4">
            {/* Las páginas del panel son lazy: mientras se descargan se muestra <Cargando />. */}
            <Suspense fallback={<Cargando />}>
              <Outlet />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
