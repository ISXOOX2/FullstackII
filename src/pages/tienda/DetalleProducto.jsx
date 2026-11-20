import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Col, Container, Form, Row } from 'react-bootstrap';
import Galeria from '../../components/moleculas/Galeria.jsx';
import CampoFormulario from '../../components/moleculas/CampoFormulario.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { estaEnOferta, obtenerProducto, precioFinal, productosRelacionados, textoTamano } from '../../services/productosService.js';
import { limiteDeCantidad } from '../../services/carritoService.js';
import { nombreCategoria } from '../../services/categoriasService.js';
import { formatoCLP } from '../../utils/formato.js';
import useFormulario from '../../utils/useFormulario.js';
import { validarTamanoPersonalizado } from '../../utils/validaciones.js';
import { TAMANO_MAX_CM, TAMANO_MIN_CM } from '../../data/estudio.js';

// Simulador gratuito para ver cómo se vería un tatuaje sobre un cuerpo en 3D (herramienta externa).
const URL_TRYTATTOO3D = 'https://trytattoo3d.com/';

/**
 * Página de detalle de un diseño. Lee el id de la URL con useParams.
 * La "key" hace que, al pasar de un diseño a otro (por ejemplo desde "También te puede gustar"),
 * React cree el contenido desde cero y los campos de cantidad y tamaño vuelvan a sus valores iniciales.
 */
export default function DetalleProducto({ onAgregar }) {
  const { id } = useParams();
  const producto = obtenerProducto(id);

  if (!producto) {
    return (
      <Container className="py-5">
        <MensajeVacio nivelTitulo={1} titulo="Ese diseño no existe" texto="Puede que haya sido retirado del catálogo.">
          <Link to="/productos" className="btn btn-dark">Ver todos los diseños</Link>
        </MensajeVacio>
      </Container>
    );
  }
  return <ContenidoDetalle key={producto.id} producto={producto} onAgregar={onAgregar} />;
}

function ContenidoDetalle({ producto, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);
  // Tamaño personalizado: parte con el tamaño original del diseño y el cliente lo puede ajustar.
  const tamano = useFormulario(
    { anchoCm: String(producto.anchoCm ?? ''), altoCm: String(producto.altoCm ?? '') },
    validarTamanoPersonalizado,
  );

  const limite = limiteDeCantidad();
  const oferta = estaEnOferta(producto);

  const manejarCantidad = (evento) => {
    const valor = Math.min(Math.max(1, Number(evento.target.value) || 1), limite);
    setCantidad(valor);
  };

  /** Solo agrega si el tamaño es válido (en cm y dentro del rango del estudio). */
  const agregar = () => {
    if (!tamano.intentarEnviar()) return;
    onAgregar(producto, cantidad, {
      anchoCm: Number(tamano.valores.anchoCm),
      altoCm: Number(tamano.valores.altoCm),
    });
  };

  const FILAS = [
    ['Código', producto.codigo],
    ['Estilo', nombreCategoria(producto.categoriaId)],
    ['Tamaño original', textoTamano(producto)],
    ['Duración aproximada', `${producto.duracionHoras} h`],
    ['Zonas recomendadas', producto.zonas],
    ['Nivel de dolor', `${producto.nivelDolor} de 5`],
    ['Tinta', producto.colorTinta],
  ];

  const campoTamano = (campo) => ({
    name: campo,
    value: tamano.valores[campo],
    onChange: tamano.manejarCambio,
    onBlur: tamano.manejarBlur,
    error: tamano.visibles[campo],
  });

  return (
    <Container className="py-4">
      <Migas
        items={[
          { texto: 'Home', to: '/' },
          { texto: 'Diseños', to: '/productos' },
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

          <>
              {/* El cliente puede pedir el diseño en otro tamaño: ancho y alto, siempre en centímetros */}
              <fieldset className="tamano-personalizado mb-2">
                <legend className="etiqueta-campo">Tamaño que quieres (en centímetros)</legend>
                <Row className="g-2">
                  <Col xs={6}>
                    <CampoFormulario
                      id="detalle-ancho" etiqueta="Ancho (cm)" tipo="number"
                      min={TAMANO_MIN_CM} max={TAMANO_MAX_CM} step={0.5} {...campoTamano('anchoCm')}
                    />
                  </Col>
                  <Col xs={6}>
                    <CampoFormulario
                      id="detalle-alto" etiqueta="Alto (cm)" tipo="number"
                      min={TAMANO_MIN_CM} max={TAMANO_MAX_CM} step={0.5} {...campoTamano('altoCm')}
                    />
                  </Col>
                </Row>
                <Form.Text muted>
                  Entre {TAMANO_MIN_CM} y {TAMANO_MAX_CM} cm por lado. Para piezas más grandes, escríbenos desde Contacto.
                </Form.Text>
              </fieldset>

              <div className="d-flex align-items-end gap-3 flex-wrap mt-3">
                <Form.Group controlId="cantidad-detalle">
                  <Form.Label className="etiqueta-campo">Cantidad</Form.Label>
                  <Form.Control type="number" min={1} max={limite} value={cantidad} onChange={manejarCantidad} className="campo-cantidad" />
                </Form.Group>
                <Button variant="dark" size="lg" onClick={agregar}>
                  Añadir a mi reserva
                </Button>
              </div>
              <small className="text-muted d-block mt-2">Máximo {limite} por reserva. La fecha, hora y tatuador/a los eliges al pagar.</small>
          </>

          {/* Herramienta gratuita externa: ver el tatuaje sobre un cuerpo en 3D. Se abre en otra pestaña. */}
          <div className="probar-3d mt-4">
            <a href={URL_TRYTATTOO3D} target="_blank" rel="noreferrer" className="btn btn-outline-dark">
              Pruébalo en 3D
            </a>
            <small className="d-block text-muted mt-1">
              Abre TryTattoo3D, un simulador gratuito para ver cómo se vería este diseño en el cuerpo.
            </small>
          </div>
        </Col>
      </Row>

      <section className="mt-5" aria-labelledby="titulo-relacionados">
        <h2 id="titulo-relacionados" className="titulo-seccion">También te puede gustar</h2>
        <ListaProductos productos={productosRelacionados(producto, 4)} onAgregar={onAgregar} />
      </section>
    </Container>
  );
}
