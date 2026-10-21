import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import images from '../../assets/images.js';

const DIAPOSITIVAS = [
  {
    imagen: 'portada-1',
    titulo: 'Tu próximo tatuaje, a una reserva de distancia',
    texto: 'Elige un diseño, escoge tatuador y agenda tu hora en minutos.',
    boton: 'Ver diseños',
    to: '/productos',
  },
  {
    imagen: 'portada-2',
    titulo: 'Ofertas de temporada',
    texto: 'Diseños seleccionados con precio especial por cupos limitados.',
    boton: 'Ver ofertas',
    to: '/ofertas',
  },
  {
    imagen: 'portada-3',
    titulo: 'Cuida tu piel, cuida tu tatuaje',
    texto: 'Lee nuestra guía de cuidados para las primeras cuatro semanas.',
    boton: 'Leer el blog',
    to: '/blogs/1',
  },
];

/** Carrusel principal de la página de inicio (react-bootstrap Carousel). */
export default function CarruselPortada() {
  return (
    <Carousel className="carrusel-portada" interval={6000} aria-label="Destacados del estudio">
      {DIAPOSITIVAS.map((d) => (
        <Carousel.Item key={d.to}>
          <img className="d-block w-100" src={images[d.imagen]} alt="" />
          <Carousel.Caption className="text-start">
            <h2 className="display-6">{d.titulo}</h2>
            <p className="d-none d-sm-block">{d.texto}</p>
            <Link to={d.to} className="btn btn-dark">{d.boton}</Link>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
