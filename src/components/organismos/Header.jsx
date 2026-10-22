import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, Container, Form, InputGroup, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import Logo from '../atomos/Logo.jsx';
import { listarCategorias } from '../../services/categoriasService.js';
import { formatoCLP } from '../../utils/formato.js';

/**
 * ORGANISMO · Header (cabecera), con el mismo nombre que en la diapositiva React III.
 * Cabecera de la tienda en dos filas:
 *  1) logo, buscador y botones de sesión;
 *  2) menú de navegación (Home, Categorías, Ofertas, Nosotros, Blog, Contacto) y el carrito.
 * Recibe por props quién está conectado (usuario) y el total del carrito, que viven en App.jsx.
 */
export default function Header({ usuario, onCerrarSesion, total, cantidad }) {
  const navegar = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const categorias = listarCategorias();

  const buscar = (evento) => {
    evento.preventDefault();
    const texto = busqueda.trim();
    navegar(texto ? `/productos?q=${encodeURIComponent(texto)}` : '/productos');
    setMenuAbierto(false);
  };

  const salir = () => {
    onCerrarSesion();
    setMenuAbierto(false);
    navegar('/');
  };

  const cerrarMenu = () => setMenuAbierto(false);
  const esPersonal = usuario && usuario.tipo !== 'Cliente';

  return (
    <header className="barra-tienda d-print-none">
      <Container className="barra-superior d-flex flex-wrap align-items-center gap-3 py-3">
        <Link to="/" className="text-decoration-none text-dark me-lg-3" aria-label="Forever Ink, ir al inicio">
          <Logo />
        </Link>

        <Form role="search" onSubmit={buscar} className="buscador flex-grow-1 order-3 order-md-2">
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Buscar diseños (ej. neko, tribal, luna)"
              aria-label="Buscar diseños"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Button type="submit" variant="dark">Buscar</Button>
          </InputGroup>
        </Form>

        <div className="d-flex align-items-center gap-2 ms-auto order-2 order-md-3">
          {/* En pantallas pequeñas el carrito del menú queda escondido: se repite aquí. */}
          <Link to="/carrito" className="btn btn-outline-dark btn-sm d-lg-none" aria-label={`Ir a mi reserva (${cantidad})`}>
            Reserva{cantidad > 0 ? ` (${cantidad})` : ''}
          </Link>
          {usuario ? (
            <NavDropdown
              align="end"
              title={<span data-testid="saludo">Hola, {usuario.nombre}</span>}
              id="menu-usuario"
            >
              <NavDropdown.Item as={Link} to="/perfil">Mi perfil</NavDropdown.Item>
              {usuario.tipo === 'Cliente' && (
                <NavDropdown.Item as={Link} to="/perfil">Mis reservas</NavDropdown.Item>
              )}
              {esPersonal && <NavDropdown.Item as={Link} to="/admin">Panel de administración</NavDropdown.Item>}
              <NavDropdown.Divider />
              <NavDropdown.Item as="button" onClick={salir}>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline-dark" size="sm">Iniciar sesión</Button>
              <Button as={Link} to="/registro" variant="dark" size="sm">Registrarse</Button>
            </>
          )}
        </div>
      </Container>

      <Navbar expand="lg" expanded={menuAbierto} onToggle={setMenuAbierto} className="barra-menu border-top">
        <Container>
          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
          <Navbar.Collapse id="menu-principal">
            <Nav className="me-auto" onClick={cerrarMenu}>
              <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/productos">Diseños</Nav.Link>
              <NavDropdown title="Estilos" id="menu-categorias">
                {categorias.map((c) => (
                  <NavDropdown.Item as={Link} key={c.id} to={`/categorias/${c.id}`}>
                    {c.nombre}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/categorias">Ver todos los estilos</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
              <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
              <Nav.Link as={NavLink} to="/blogs">Blog</Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            </Nav>
            <Link to="/carrito" className="pill-carrito" onClick={cerrarMenu} aria-label={`Carrito: ${cantidad} diseño(s), total ${formatoCLP(total)}`}>
              <span aria-hidden="true">Mi reserva</span>
              <strong data-testid="total-carrito">{formatoCLP(total)}</strong>
              {cantidad > 0 && <span className="pill-cantidad">{cantidad}</span>}
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
