import { Link } from 'react-router-dom';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import Migas from '../../components/moleculas/Migas.jsx';
import { BLOGS } from '../../data/blogs.js';
import { formatoFechaLarga } from '../../utils/formato.js';
import images from '../../assets/images.js';

export default function Blogs() {
  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Blog' }]} />
      <h1 className="titulo-seccion">Blog</h1>
      <p className="text-muted mb-4">Cuidados, consejos y datos curiosos del mundo del tatuaje.</p>
      <Row xs={1} md={2} className="g-4">
        {BLOGS.map((b) => (
          <Col key={b.id}>
            <Card as={Link} to={`/blogs/${b.id}`} className="h-100 text-decoration-none tarjeta-blog">
              <div className="marco-imagen"><Card.Img variant="top" src={images[b.imagen]} alt="" /></div>
              <Card.Body>
                <Badge bg="dark" className="fw-normal mb-2">{b.etiqueta}</Badge>
                <Card.Title as="h2" className="h5">{b.titulo}</Card.Title>
                <Card.Text className="text-muted">{b.resumen}</Card.Text>
                <small className="text-muted">{formatoFechaLarga(b.fecha)} · {b.autor}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
