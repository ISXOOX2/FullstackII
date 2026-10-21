import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import CarruselPortada from '../../components/organismos/CarruselPortada.jsx';
import TarjetaCategoria from '../../components/moleculas/TarjetaCategoria.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import { listarCategorias, contarProductosDeCategoria } from '../../services/categoriasService.js';
import { productosDestacados } from '../../services/productosService.js';
import { ESTUDIO } from '../../config/estudio.js';

const PASOS = [
  { numero: '01', titulo: 'Elige tu diseño', texto: 'Explora los estilos y reserva uno o varios diseños del catálogo.' },
  { numero: '02', titulo: 'Agenda tu hora', texto: 'Escoge tatuador, fecha y horario disponible en nuestra agenda.' },
  { numero: '03', titulo: 'Paga y listo', texto: 'Confirma tu reserva y recibe tu boleta con todos los datos de la cita.' },
];

/** onAgregar(producto) llega por props desde App.jsx (ahí vive el estado del carrito). */
export default function Home({ onAgregar }) {
  const categorias = listarCategorias();

  return (
    <>
      <CarruselPortada />
      <Container className="py-5">
        <section aria-labelledby="titulo-estilos">
          <h1 className="visually-hidden">{ESTUDIO.nombre}: {ESTUDIO.eslogan}</h1>
          <p className="sobretitulo">Estilos</p>
          <h2 id="titulo-estilos" className="titulo-seccion">Encuentra tu trazo</h2>
          <Row xs={1} sm={2} lg={4} className="g-4">
            {categorias.map((c) => (
              <Col key={c.id}>
                <TarjetaCategoria categoria={c} cantidad={contarProductosDeCategoria(c.id)} />
              </Col>
            ))}
          </Row>
        </section>

        <section className="mt-5 pt-3" aria-labelledby="titulo-destacados">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
            <div>
              <p className="sobretitulo">Destacados</p>
              <h2 id="titulo-destacados" className="titulo-seccion mb-0">Diseños favoritos</h2>
            </div>
            <Link to="/productos" className="enlace-sutil">Ver todos los diseños →</Link>
          </div>
          <div className="mt-4">
            <ListaProductos productos={productosDestacados(4)} onAgregar={onAgregar} />
          </div>
        </section>

        <section className="mt-5 pt-3" aria-labelledby="titulo-pasos">
          <p className="sobretitulo">Cómo funciona</p>
          <h2 id="titulo-pasos" className="titulo-seccion">Reservar es simple</h2>
          <Row className="g-4">
            {PASOS.map((p) => (
              <Col md={4} key={p.numero}>
                <div className="paso">
                  <span className="paso-numero">{p.numero}</span>
                  <h3 className="h5">{p.titulo}</h3>
                  <p className="text-muted mb-0">{p.texto}</p>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </>
  );
}
