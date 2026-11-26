import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Migas from '../../components/moleculas/Migas.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import Cargando from '../../components/atomos/Cargando.jsx';
import { obtenerBlog } from '../../data/blogs.js';
import { USAR_API } from '../../services/api.js';
import { obtenerArticulo } from '../../services/blogService.js';
import { formatoFechaLarga } from '../../utils/formato.js';
import images from '../../assets/images.js';

/** Detalle de un artículo: lo pide a ms-catalogo (/api/v1/blog) por su id (o lo toma de los datos locales sin backend). */
export default function DetalleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(() => (USAR_API ? undefined : obtenerBlog(id)));

  useEffect(() => {
    if (!USAR_API) {
      setBlog(obtenerBlog(id));
      return undefined;
    }
    let activo = true;
    setBlog(undefined);
    obtenerArticulo(id)
      .then((datos) => activo && setBlog(datos))
      .catch(() => activo && setBlog(obtenerBlog(id))); // sin conexión: intenta con los artículos guardados
    return () => { activo = false; };
  }, [id]);

  if (blog === undefined) return <Container className="py-5"><Cargando texto="Cargando artículo…" /></Container>;

  if (!blog) {
    return (
      <Container className="py-5">
        <MensajeVacio nivelTitulo={1} titulo="Ese artículo no existe">
          <Link to="/blogs" className="btn btn-dark">Volver al blog</Link>
        </MensajeVacio>
      </Container>
    );
  }

  return (
    <Container className="py-4 contenedor-lectura">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Blog', to: '/blogs' }, { texto: blog.etiqueta || blog.titulo }]} />
      <article>
        <h1 className="titulo-seccion">{blog.titulo}</h1>
        <p className="text-muted">{formatoFechaLarga(blog.fecha)} · {blog.autor}</p>
        <img src={images[blog.imagen] || images.logo} alt={`Infografía: ${blog.titulo}`} className="img-fluid mb-4 imagen-blog" />
        {blog.contenido.map((bloque, i) =>
          bloque.tipo === 'h' ? <h2 key={i} className="h4 mt-4">{bloque.texto}</h2> : <p key={i}>{bloque.texto}</p>,
        )}
      </article>
      <Link to="/blogs" className="enlace-sutil">← Volver al blog</Link>
    </Container>
  );
}
