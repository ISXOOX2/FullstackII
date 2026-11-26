import { Link } from 'react-router-dom';
import { Alert, Badge, Card, Col, Container, Row } from 'react-bootstrap';
import Migas from '../../components/moleculas/Migas.jsx';
import Cargando from '../../components/atomos/Cargando.jsx';
import VideoYoutube from '../../components/moleculas/VideoYoutube.jsx';
import useArticulos from '../../utils/useArticulos.js';
import { USAR_API } from '../../services/api.js';
import { REFRESCO_BLOG_MS } from '../../services/blogService.js';
import { formatoFechaLarga } from '../../utils/formato.js';
import images from '../../assets/images.js';

/** Blog: los artículos vienen de ms-catalogo (/api/v1/blog) y la lista se actualiza sola cada 30 segundos. */
export default function Blogs() {
  const { articulos, cargando, error, actualizado } = useArticulos();

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Blog' }]} />
      <h1 className="titulo-seccion">Blog</h1>
      <p className="text-muted mb-2">Cuidados, consejos y datos curiosos del mundo del tatuaje.</p>
      {USAR_API && actualizado && (
        <p className="small text-muted mb-4" aria-live="polite">
          Se actualiza solo cada {REFRESCO_BLOG_MS / 1000} segundos · última revisión{' '}
          {actualizado.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      )}
      {error && (
        <Alert variant="warning">No pudimos conectar con el blog ({error}). Te mostramos los últimos artículos que tenemos.</Alert>
      )}
      <section className="mb-5" aria-labelledby="titulo-video">
        <h2 id="titulo-video" className="h4 mb-3">Video del estudio</h2>
        <Row><Col lg={8}><VideoYoutube idVideo="gX7tSE8b2Bk" titulo="Video de Forever Ink en YouTube" pie="Mira el video" /></Col></Row>
      </section>
      {cargando ? <Cargando texto="Cargando artículos…" /> : (
        <Row xs={1} md={2} className="g-4">
          {articulos.map((b) => (
            <Col key={b.id}>
              <Card as={Link} to={`/blogs/${b.id}`} className="h-100 text-decoration-none tarjeta-blog">
                <div className="marco-imagen"><Card.Img variant="top" src={images[b.imagen] || images.logo} alt="" /></div>
                <Card.Body>
                  {b.etiqueta && <Badge bg="dark" className="fw-normal mb-2">{b.etiqueta}</Badge>}
                  <Card.Title as="h2" className="h5">{b.titulo}</Card.Title>
                  <Card.Text className="text-muted">{b.resumen}</Card.Text>
                  <small className="text-muted">{formatoFechaLarga(b.fecha)} · {b.autor}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
