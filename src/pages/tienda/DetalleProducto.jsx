import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Col, Container, Form, Row } from 'react-bootstrap';
import Galeria from '../../components/moleculas/Galeria.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { estaEnOferta, esStockCritico, obtenerProducto, precioFinal, productosRelacionados } from '../../services/productosService.js';
import { limiteDeCantidad } from '../../services/carritoService.js';
import { nombreCategoria } from '../../services/categoriasService.js';
import { nombreTatuador } from '../../data/tatuadores.js';
import { formatoCLP } from '../../utils/formato.js';

export default function DetalleProducto({ onAgregar }) {
  const { id } = useParams();
  const producto = obtenerProducto(id);
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <Container className="py-5">
        <MensajeVacio nivelTitulo={1} titulo="Ese diseño no existe" texto="Puede que haya sido retirado del catálogo.">
          <Link to="/productos" className="btn btn-dark">Ver todos los diseños</Link>
        </MensajeVacio>
      </Container>
    );
  }

  const limite = Math.max(1, limiteDeCantidad(producto.stock));
  const sinCupos = producto.stock <= 0;
  const oferta = estaEnOferta(producto);

  const manejarCantidad = (evento) => {
    const valor = Math.min(Math.max(1, Number(evento.target.value) || 1), limite);
    setCantidad(valor);
  };

  const FILAS = [
    ['Código', producto.codigo],
    ['Estilo', nombreCategoria(producto.categoriaId)],
    ['Tamaño', producto.tamano],
    ['Duración aproximada', `${producto.duracionHoras} h`],
    ['Zonas recomendadas', producto.zonas],
    ['Nivel de dolor', `${producto.nivelDolor} de 5`],
    ['Tinta', producto.colorTinta],
    ['Tatuador/a', nombreTatuador(producto.tatuadorId)],
  ];

  return (
    <Container className="py-4">
      <Migas
        items={[
          { texto: 'Home', to: '/' },
          { texto: nombreCategoria(producto.categoriaId), to: `/categorias/${producto.categoriaId}` },
          { texto: producto.nombre },
        ]}
      />
      <Row className="g-4 g-md-5">
        <Col md={6}>
          <Galeria imagenes={producto.imagenes || [producto.imagen]} nombre={producto.nombre} />
        </Col>
        <Col md={6}>
          <h1 className="titulo-seccion mb-2">{producto.nombre}</h1>
          <div className="mb-3">
            <span className="precio precio-grande">{formatoCLP(precioFinal(producto))}</span>
            {oferta && (
              <>
                <span className="precio-tachado ms-2">{formatoCLP(producto.precio)}</span>
                <Badge bg="dark" className="ms-2">Oferta</Badge>
              </>
            )}
          </div>
          <p>{producto.descripcion}</p>

          <dl className="ficha-tecnica">
            {FILAS.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="ficha-fila">
                <dt>{etiqueta}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>

          {sinCupos ? (
            <p className="text-danger">Este diseño no tiene cupos disponibles por ahora.</p>
          ) : (
            <>
              <p className={esStockCritico(producto) ? 'text-warning-emphasis' : 'text-muted'}>
                {esStockCritico(producto) ? `¡Quedan solo ${producto.stock} cupos!` : `${producto.stock} cupos disponibles`}
              </p>
              <div className="d-flex align-items-end gap-3 flex-wrap">
                <Form.Group controlId="cantidad-detalle">
                  <Form.Label className="etiqueta-campo">Cantidad</Form.Label>
                  <Form.Control type="number" min={1} max={limite} value={cantidad} onChange={manejarCantidad} className="campo-cantidad" />
                </Form.Group>
                <Button variant="dark" size="lg" onClick={() => onAgregar(producto, cantidad)}>
                  Añadir a mi reserva
                </Button>
              </div>
              <small className="text-muted d-block mt-2">Máximo {limite} por reserva.</small>
            </>
          )}
        </Col>
      </Row>

      <section className="mt-5" aria-labelledby="titulo-relacionados">
        <h2 id="titulo-relacionados" className="titulo-seccion">También te puede gustar</h2>
        <ListaProductos productos={productosRelacionados(producto, 4)} onAgregar={onAgregar} />
      </section>
    </Container>
  );
}
