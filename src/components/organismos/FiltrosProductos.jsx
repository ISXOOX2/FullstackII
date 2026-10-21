import { Button, Col, Form, Row } from 'react-bootstrap';

/**
 * Panel de filtros del catálogo. Es un componente "controlado": no guarda estado propio,
 * recibe los valores por props y avisa los cambios con onCambiar(campo, valor).
 */
export default function FiltrosProductos({ filtros, categorias, onCambiar, onLimpiar }) {
  return (
    <Form className="filtros-productos mb-4" aria-label="Filtros de diseños" onSubmit={(e) => e.preventDefault()}>
      <Row className="g-3 align-items-end">
        <Col md={6} lg={3}>
          <Form.Label htmlFor="f-texto" className="etiqueta-campo">Buscar</Form.Label>
          <Form.Control
            id="f-texto"
            type="search"
            placeholder="Nombre, zona, tamaño…"
            value={filtros.texto}
            onChange={(e) => onCambiar('texto', e.target.value)}
          />
        </Col>
        <Col md={6} lg={2}>
          <Form.Label htmlFor="f-categoria" className="etiqueta-campo">Estilo</Form.Label>
          <Form.Select id="f-categoria" value={filtros.categoriaId} onChange={(e) => onCambiar('categoriaId', e.target.value)}>
            <option value="">Todos</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={6} lg={2}>
          <Form.Label htmlFor="f-precio" className="etiqueta-campo">Precio máximo</Form.Label>
          <Form.Select id="f-precio" value={filtros.precioMax} onChange={(e) => onCambiar('precioMax', e.target.value)}>
            <option value="">Sin límite</option>
            <option value="70000">Hasta $70.000</option>
            <option value="100000">Hasta $100.000</option>
            <option value="150000">Hasta $150.000</option>
          </Form.Select>
        </Col>
        <Col md={6} lg={2}>
          <Form.Label htmlFor="f-orden" className="etiqueta-campo">Ordenar por</Form.Label>
          <Form.Select id="f-orden" value={filtros.orden} onChange={(e) => onCambiar('orden', e.target.value)}>
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre (A-Z)</option>
          </Form.Select>
        </Col>
        <Col lg={3} className="d-flex align-items-center justify-content-between gap-3">
          <Form.Check
            id="f-ofertas"
            type="switch"
            label="Solo ofertas"
            checked={filtros.soloOfertas}
            onChange={(e) => onCambiar('soloOfertas', e.target.checked)}
          />
          <Button variant="outline-dark" size="sm" onClick={onLimpiar}>Limpiar</Button>
        </Col>
      </Row>
    </Form>
  );
}
