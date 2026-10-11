import { Link, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Migas from '../../components/comunes/Migas.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { obtenerBlog } from '../../data/blogs.js';
import { formatoFechaLarga } from '../../utils/formato.js';

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = obtenerBlog(id);

  if (!blog) {
    return (
      <Container className="py-5">
        <MensajeVacio titulo="Ese artículo no existe">
          <Link to="/blogs" className="btn btn-dark">Volver al blog</Link>
        </MensajeVacio>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 780 }}>
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Blog', to: '/blogs' }, { texto: blog.etiqueta }]} />
      <article>
        <h1 className="titulo-seccion">{blog.titulo}</h1>
        <p className="text-muted">{formatoFechaLarga(blog.fecha)} · {blog.autor}</p>
        <img src={blog.imagen} alt="" className="img-fluid mb-4 imagen-blog" />
        {blog.contenido.map((bloque, i) =>
          bloque.tipo === 'h' ? <h2 key={i} className="h4 mt-4">{bloque.texto}</h2> : <p key={i}>{bloque.texto}</p>,
        )}
      </article>
      <Link to="/blogs" className="enlace-sutil">← Volver al blog</Link>
    </Container>
  );
}
