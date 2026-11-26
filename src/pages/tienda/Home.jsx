// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Animación del index con GSAP (clase GSAP + React): useRef + useGSAP con scope.
//   1) Timeline: al cargar, el texto de la portada entra en secuencia (título, texto y botón).
//   2) repeat: -1 + yoyo: las estrellas decorativas flotan sin parar.
//   3) ScrollTrigger + stagger: cada sección aparece al llegar a ella con el scroll.
// • gsap.matchMedia: si la persona pidió "reducir movimiento" en su sistema, no se anima nada.
// ───────────────────────────────────────────────────────────────────────────
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Col, Container, Row } from 'react-bootstrap';
import CarruselPortada from '../../components/organismos/CarruselPortada.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import TarjetaResena from '../../components/moleculas/TarjetaResena.jsx';
import Estrellas from '../../components/atomos/Estrellas.jsx';
import { productosDestacados } from '../../services/productosService.js';
import { listarResenas, promedioEstrellas } from '../../services/resenasService.js';
import { ESTUDIO } from '../../data/estudio.js';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PASOS = [
  { numero: '01', titulo: 'Elige tu diseño', texto: 'Reserva un diseño del catálogo o envíanos tu propia idea en «Mi proyecto».' },
  { numero: '02', titulo: 'Agenda tu hora', texto: 'Escoge tatuador, fecha y horario disponible en nuestra agenda.' },
  { numero: '03', titulo: 'Paga y listo', texto: 'Confirma tu reserva y recibe tu boleta con todos los datos de la cita.' },
];

/** onAgregar(producto) llega por props desde App.jsx (ahí vive el estado del carrito). */
export default function Home({ onAgregar }) {
  const resenas = listarResenas();
  const contenedor = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1) Entrada de la portada: una animación después de otra
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.carousel-item.active .carousel-caption h2', { y: 60, opacity: 0, duration: 0.9 })
        .from('.carousel-item.active .carousel-caption p', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.carousel-item.active .carousel-caption .btn', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' })
        .from('.forma', { scale: 0, rotation: 90, opacity: 0, duration: 0.6, stagger: 0.15 }, '<');

      // 2) Estrellas decorativas que flotan sin parar
      gsap.to('.forma', { y: -14, rotation: 20, duration: 1.6, repeat: -1, yoyo: true, ease: 'power1.inOut', stagger: 0.3 });

      // 3) Cada sección aparece al llegar con el scroll; sus tarjetas, una tras otra
      gsap.utils.toArray('.seccion-animada').forEach((seccion) => {
        gsap.from(seccion.querySelectorAll('.revelar'), {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: seccion, start: 'top 80%', toggleActions: 'play none none none' },
        });
      });
    });
  }, { scope: contenedor });

  return (
    <div ref={contenedor}>
      <CarruselPortada />
      <Container className="py-5">
        <h1 className="visually-hidden">{ESTUDIO.nombre}: {ESTUDIO.eslogan}</h1>

        {/* Dos caminos: el cliente sin idea elige un diseño; el que ya tiene una, envía su proyecto */}
        <section className="seccion-animada position-relative" aria-labelledby="titulo-caminos">
          {/* Formas decorativas (estrellas manga) que anima GSAP */}
          <span className="forma forma-1" aria-hidden="true">★</span>
          <span className="forma forma-2" aria-hidden="true">✦</span>
          <span className="forma forma-3" aria-hidden="true">★</span>
          <p className="sobretitulo">Tu tatuaje</p>
          <h2 id="titulo-caminos" className="titulo-seccion">¿Cómo quieres empezar?</h2>
          <Row className="g-4">
            <Col md={6} className="revelar">
              <div className="paso h-100">
                <h3 className="h5">Aún no sé qué tatuarme</h3>
                <p className="text-muted">Elige uno de nuestros diseños y agenda tu hora en minutos.</p>
                <Link to="/productos" className="btn btn-dark">Ver diseños</Link>
              </div>
            </Col>
            <Col md={6} className="revelar">
              <div className="paso h-100">
                <h3 className="h5">Ya tengo una idea</h3>
                <p className="text-muted">Cuéntanos tu idea y adjunta una imagen: te contactamos en 3 días hábiles.</p>
                <Link to="/mi-proyecto" className="btn btn-outline-dark">Enviar mi proyecto</Link>
              </div>
            </Col>
          </Row>
        </section>

        <section className="mt-5 pt-3 seccion-animada" aria-labelledby="titulo-destacados">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
            <div>
              <p className="sobretitulo">Destacados</p>
              <h2 id="titulo-destacados" className="titulo-seccion mb-0">Diseños favoritos</h2>
            </div>
            <Link to="/productos" className="enlace-sutil">Ver todos los diseños →</Link>
          </div>
          <div className="mt-4 revelar">
            <ListaProductos productos={productosDestacados(4)} onAgregar={onAgregar} />
          </div>
        </section>

        <section className="mt-5 pt-3 seccion-animada" aria-labelledby="titulo-resenas">
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
            {resenas.slice(0, 3).map((r) => <Col key={r.id} className="revelar"><TarjetaResena resena={r} /></Col>)}
          </Row>
        </section>

        <section className="mt-5 pt-3 seccion-animada" aria-labelledby="titulo-pasos">
          <p className="sobretitulo">Cómo funciona</p>
          <h2 id="titulo-pasos" className="titulo-seccion">Reservar es simple</h2>
          <Row className="g-4">
            {PASOS.map((p) => (
              <Col md={4} key={p.numero} className="revelar">
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
    </div>
  );
}
