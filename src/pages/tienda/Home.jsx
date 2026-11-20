import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import CarruselPortada from '../../components/organismos/CarruselPortada.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import TarjetaResena from '../../components/moleculas/TarjetaResena.jsx';
import Estrellas from '../../components/atomos/Estrellas.jsx';
import { productosDestacados } from '../../services/productosService.js';
import { listarResenas, promedioEstrellas } from '../../services/resenasService.js';
import { ESTUDIO } from '../../data/estudio.js';

const PASOS = [
  { numero: '01', titulo: 'Elige tu diseño', texto: 'Reserva un diseño del catálogo o envíanos tu propia idea en «Mi proyecto».' },
  { numero: '02', titulo: 'Agenda tu hora', texto: 'Escoge tatuador, fecha y horario disponible en nuestra agenda.' },
  { numero: '03', titulo: 'Paga y listo', texto: 'Confirma tu reserva y recibe tu boleta con todos los datos de la cita.' },
];

/** onAgregar(producto) llega por props desde App.jsx (ahí vive el estado del carrito). */
export default function Home({ onAgregar }) {
  const resenas = listarResenas();

  return (
    <>
      <CarruselPortada />
      <Container className="py-5">
        <h1 className="visually-hidden">{ESTUDIO.nombre}: {ESTUDIO.eslogan}</h1>

        {/* Dos caminos: el cliente sin idea elige un diseño; el que ya tiene una, envía su proyecto */}
        <section aria-labelledby="titulo-caminos">
          <p className="sobretitulo">Tu tatuaje</p>
          <h2 id="titulo-caminos" className="titulo-seccion">¿Cómo quieres empezar?</h2>
          <Row className="g-4">
            <Col md={6}>
              <div className="paso h-100">
                <h3 className="h5">Aún no sé qué tatuarme</h3>
                <p className="text-muted">Elige uno de nuestros 25 diseños originales y agenda tu hora en minutos.</p>
                <Link to="/productos" className="btn btn-dark">Ver diseños</Link>
              </div>
            </Col>
            <Col md={6}>
              <div className="paso h-100">
                <h3 className="h5">Ya tengo una idea</h3>
                <p className="text-muted">Cuéntanos tu idea y adjunta una imagen: te contactamos en 3 días hábiles.</p>
                <Link to="/mi-proyecto" className="btn btn-outline-dark">Enviar mi proyecto</Link>
              </div>
            </Col>
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

        <section className="mt-5 pt-3" aria-labelledby="titulo-resenas">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
            <div>
              <p className="sobretitulo">Reseñas</p>
              <h2 id="titulo-resenas" className="titulo-seccion mb-0">
                {promedioEstrellas(resenas).toFixed(1)} <Estrellas valor={promedioEstrellas(resenas)} tamano="lg" />
              </h2>
            </div>
            <Link to="/resenas" className="enlace-sutil">Ver las {resenas.length} reseñas →</Link>
          </div>
          <Row xs={1} md={3} className="g-4 mt-1">
            {resenas.slice(0, 3).map((r) => <Col key={r.id}><TarjetaResena resena={r} /></Col>)}
          </Row>
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
          <p className="mt-4 mb-0">
            ¿Necesitas cremas, jabón o una gift card para regalar? <Link to="/tienda">Visita la Tienda</Link>.
          </p>
        </section>
      </Container>
    </>
  );
}
