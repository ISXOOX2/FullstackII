import { Link, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { obtenerCategoria } from '../../services/categoriasService.js';
import { productosPorCategoria } from '../../services/productosService.js';

export default function DetalleCategoria({ onAgregar }) {
  const { id } = useParams();
  const categoria = obtenerCategoria(id);

  if (!categoria) {
    return (
      <Container className="py-5">
        <MensajeVacio nivelTitulo={1} titulo="Ese estilo no existe">
          <Link to="/categorias" className="btn btn-dark">Ver los estilos</Link>
        </MensajeVacio>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Estilos', to: '/categorias' }, { texto: categoria.nombre }]} />
      <h1 className="titulo-seccion mb-1">{categoria.nombre}</h1>
      <p className="text-muted mb-4">{categoria.descripcion}</p>
      <ListaProductos
        productos={productosPorCategoria(categoria.id)}
        onAgregar={onAgregar}
        vacioTitulo="Aún no hay diseños en este estilo"
        vacioTexto="Pronto subiremos nuevos diseños."
      />
    </Container>
  );
}
