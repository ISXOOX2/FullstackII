import { Card, Col, Container, Row } from 'react-bootstrap';
import Migas from '../../components/moleculas/Migas.jsx';
import { ESTUDIO, EQUIPO_DESARROLLO } from '../../data/estudio.js';
import { TATUADORES } from '../../data/tatuadores.js';
import { inicial } from '../../utils/formato.js';

export default function Nosotros() {
  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Nosotros' }]} />
      <h1 className="titulo-seccion">Sobre {ESTUDIO.nombre}</h1>
      <Row className="g-4 g-md-5 mb-5">
        <Col md={7}>
          <p className="lead">
            Somos un estudio pequeño de Providencia con alma de manga: tinta negra, trazos limpios y diseños kawaii, anime, tribal Y2K, celestial y cybersigilism, hechos para durar.
          </p>
          <p>
            Trabajamos con cita previa para dedicar a cada persona el tiempo que merece. Elige un diseño de nuestro catálogo (o cuéntanos tu idea),
            reserva con el tatuador que prefieras y paga en línea para asegurar tu horario.
          </p>
          <p className="mb-0">
            Nuestra misión es que tu primera vez, o la décima, sea tranquila, higiénica y con un resultado que te guste dentro de diez años.
          </p>
        </Col>
        <Col md={5}>
          <Card className="ficha-estudio">
            <Card.Body>
              <Card.Title as="h2" className="h6 text-uppercase">Visítanos</Card.Title>
              <address className="mb-0">
                {ESTUDIO.direccion}<br />{ESTUDIO.horario}<br />{ESTUDIO.telefono}<br />{ESTUDIO.correo}
              </address>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <section aria-labelledby="titulo-equipo" className="mb-5">
        <h2 id="titulo-equipo" className="titulo-seccion">Nuestro equipo</h2>
        <Row xs={1} md={3} className="g-4">
          {TATUADORES.map((t) => (
            <Col key={t.id}>
              <Card className="h-100 tarjeta-persona">
                <Card.Body>
                  <span className="avatar" aria-hidden="true">{inicial(t)}</span>
                  <Card.Title as="h3" className="h5">{t.nombre}</Card.Title>
                  <p className="small text-uppercase text-muted mb-2">{t.especialidad} · {t.experiencia}</p>
                  <Card.Text>{t.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section aria-labelledby="titulo-desarrolladores">
        <h2 id="titulo-desarrolladores" className="titulo-seccion">Desarrollo del sitio</h2>
        <p className="text-muted">Proyecto de la asignatura Desarrollo Fullstack II (DSY1104) · DuocUC.</p>
        <Row xs={1} md={3} className="g-4">
          {EQUIPO_DESARROLLO.map((p) => (
            <Col key={p.nombre}>
              <Card className="h-100 tarjeta-persona">
                <Card.Body>
                  <Card.Title as="h3" className="h5">{p.nombre}</Card.Title>
                  <Card.Text className="mb-0">{p.rol}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
}
