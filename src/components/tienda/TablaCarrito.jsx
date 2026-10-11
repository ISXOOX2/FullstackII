import { Button, Form, Table } from 'react-bootstrap';
import { limiteDeCantidad } from '../../services/carritoService.js';
import { formatoCLP } from '../../utils/formato.js';

/**
 * Tabla del carrito (reserva). Componente controlado: muestra "items" y avisa los cambios
 * con onCambiarCantidad(productoId, cantidad) y onQuitar(productoId).
 */
export default function TablaCarrito({ items, onCambiarCantidad, onQuitar }) {
  return (
    <div className="table-responsive">
      <Table className="tabla-carrito align-middle" aria-label="Diseños de tu reserva">
        <thead>
          <tr>
            <th scope="col">Diseño</th>
            <th scope="col" className="text-end">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col" className="text-end">Subtotal</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const limite = limiteDeCantidad(item.stock);
            return (
              <tr key={item.productoId}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img src={item.imagen} alt="" width="64" height="64" className="miniatura" />
                    <span>{item.nombre}</span>
                  </div>
                </td>
                <td className="text-end">{formatoCLP(item.precio)}</td>
                <td>
                  <div className="selector-cantidad mx-auto">
                    <Button
                      variant="outline-dark" size="sm"
                      aria-label={`Quitar una unidad de ${item.nombre}`}
                      disabled={item.cantidad <= 1}
                      onClick={() => onCambiarCantidad(item.productoId, item.cantidad - 1)}
                    >−</Button>
                    <Form.Control
                      size="sm" type="number" min={1} max={limite}
                      aria-label={`Cantidad de ${item.nombre}`}
                      value={item.cantidad}
                      onChange={(e) => onCambiarCantidad(item.productoId, e.target.value)}
                    />
                    <Button
                      variant="outline-dark" size="sm"
                      aria-label={`Agregar una unidad de ${item.nombre}`}
                      disabled={item.cantidad >= limite}
                      onClick={() => onCambiarCantidad(item.productoId, item.cantidad + 1)}
                    >+</Button>
                  </div>
                  <small className="d-block text-center text-muted mt-1">Máx. {limite}</small>
                </td>
                <td className="text-end fw-semibold">{formatoCLP(item.precio * item.cantidad)}</td>
                <td className="text-end">
                  <Button variant="link" className="text-danger p-0" onClick={() => onQuitar(item.productoId)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
