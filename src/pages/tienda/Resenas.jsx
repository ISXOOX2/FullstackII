import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
import Estrellas from '../../components/atomos/Estrellas.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import TarjetaResena from '../../components/moleculas/TarjetaResena.jsx';
import ModalConfirmacion from '../../components/moleculas/ModalConfirmacion.jsx';
import FormularioResena from '../../components/organismos/FormularioResena.jsx';
import {
  distribucionEstrellas, listarResenas, promedioEstrellas, publicarResena, quitarResena, resenaDeUsuario,
} from '../../services/resenasService.js';
import { mensajeDeError } from '../../services/api.js';

/**
 * Reseñas de clientes: promedio, cuántas hay de cada nota y la lista.
 * Un cliente con sesión puede publicar (o actualizar) su reseña; el administrador puede eliminar.
 */
export default function Resenas({ usuario, mostrarAviso }) {
  const [version, setVersion] = useState(0); // al cambiar, se vuelven a leer las reseñas
  const [aEliminar, setAEliminar] = useState(null);
  const resenas = listarResenas();
  const promedio = promedioEstrellas(resenas);
  const distribucion = distribucionEstrellas(resenas);
  const esCliente = usuario?.tipo === 'Cliente';
  const esAdmin = usuario?.tipo === 'Administrador';
  const mia = esCliente ? resenaDeUsuario(usuario.id) : null;

  const publicar = async (datos) => {
    try {
      await publicarResena(usuario, datos);
      mostrarAviso(mia ? 'Tu reseña se actualizó.' : '¡Gracias! Tu reseña ya está publicada.');
      setVersion((v) => v + 1);
    } catch (error) {
      mostrarAviso(mensajeDeError(error), 'danger');
    }
  };

  const confirmarEliminar = async () => {
    try {
      await quitarResena(aEliminar.id);
      mostrarAviso('La reseña fue eliminada.', 'secondary');
      setVersion((v) => v + 1);
    } catch (error) {
      mostrarAviso(mensajeDeError(error), 'danger');
    }
    setAEliminar(null);
  };

  return (
    <Container className="py-4" data-version={version}>
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Reseñas' }]} />
      <h1 className="titulo-seccion">Lo que dicen nuestros clientes</h1>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <p className="display-4 fw-bold mb-0">{promedio.toFixed(1)}</p>
              <Estrellas valor={promedio} tamano="lg" />
              <p className="text-muted small mt-2 mb-0">{resenas.length} reseña(s)</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="h-100">
            <Card.Body>
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="d-flex align-items-center gap-2 mb-2">
                  <span className="small text-nowrap etiqueta-barra">{n} estrella{n > 1 ? 's' : ''}</span>
                  <ProgressBar
                    now={resenas.length ? (distribucion[n] / resenas.length) * 100 : 0}
                    variant="dark" className="flex-grow-1" aria-label={`${distribucion[n]} reseñas de ${n} estrellas`}
                  />
                  <span className="small text-muted">{distribucion[n]}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <section className="mb-5" aria-labelledby="titulo-opinar">
        <h2 id="titulo-opinar" className="h5">{mia ? 'Tu reseña' : 'Deja tu reseña'}</h2>
        {esCliente && (
          <Card><Card.Body><FormularioResena key={mia?.id ?? 'nueva'} inicial={mia} onEnviar={publicar} /></Card.Body></Card>
        )}
        {!usuario && (
          <p className="text-muted">
            <Link to="/login">Inicia sesión</Link> o <Link to="/registro">crea tu cuenta</Link> para dejar tu reseña.
          </p>
        )}
        {usuario && !esCliente && <p className="text-muted small">Las reseñas las escriben los clientes.</p>}
      </section>

      <Row xs={1} md={2} lg={3} className="g-4">
        {resenas.map((r) => (
          <Col key={r.id}>
            <TarjetaResena resena={r} onEliminar={esAdmin ? setAEliminar : null} />
          </Col>
        ))}
      </Row>

      <ModalConfirmacion
        show={Boolean(aEliminar)}
        titulo="Eliminar reseña"
        mensaje={aEliminar && `¿Eliminar la reseña de ${aEliminar.nombre}?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </Container>
  );
}
