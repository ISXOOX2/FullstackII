import { Link, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { esStockCritico, obtenerProducto, precioFinal } from '../../services/productosService.js';
import { nombreCategoria } from '../../services/categoriasService.js';
import { nombreTatuador } from '../../data/tatuadores.js';
import { formatoCLP } from '../../utils/formato.js';
import images from '../../assets/images.js';

export default function DetalleProductoAdmin({ usuario }) {
  const { id } = useParams();
  const p = obtenerProducto(id);

  if (!p) {
    return (
      <MensajeVacio titulo="Ese diseño no existe">
        <Link to="/admin/productos" className="btn btn-dark">Volver</Link>
      </MensajeVacio>
    );
  }
  const filas = [
    ['Código', p.codigo], ['Estilo', nombreCategoria(p.categoriaId)], ['Precio', formatoCLP(p.precio)],
    ['Precio de oferta', p.precioOferta ? formatoCLP(precioFinal(p)) : '—'],
    ['Stock', `${p.stock}${esStockCritico(p) ? ' (crítico)' : ''}`], ['Stock crítico', p.stockCritico ?? '—'],
    ['Tamaño', p.tamano || '—'], ['Duración', p.duracionHoras ? `${p.duracionHoras} h` : '—'],
    ['Zonas', p.zonas || '—'], ['Nivel de dolor', p.nivelDolor ?? '—'], ['Tinta', p.colorTinta],
    ['Tatuador/a', nombreTatuador(p.tatuadorId)], ['Destacado', p.destacado ? 'Sí' : 'No'],
  ];
  return (
    <>
      <h1 className="titulo-seccion">{p.nombre}</h1>
      <Row className="g-4">
        <Col md={4}><div className="marco-imagen"><img src={images[p.imagen]} alt={`Diseño ${p.nombre}`} /></div></Col>
        <Col md={8}>
          <p>{p.descripcion}</p>
          <dl className="ficha-tecnica">
            {filas.map(([k, v]) => (<div key={k} className="ficha-fila"><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
          <div className="d-flex gap-2">
            {usuario.tipo === 'Administrador' && <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-dark">Editar</Link>}
            <Link to="/admin/productos" className="btn btn-outline-dark">Volver</Link>
          </div>
        </Col>
      </Row>
    </>
  );
}
