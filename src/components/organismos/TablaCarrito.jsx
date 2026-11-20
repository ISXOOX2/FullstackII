import { Button, Form, Table } from 'react-bootstrap';
import { claveDe, detalleItem, limiteDeCantidad } from '../../services/carritoService.js';
import { formatoCLP } from '../../utils/formato.js';
import images from '../../assets/images.js';

/**
 * Tabla del carrito (reserva). Componente controlado: muestra "items" y avisa los cambios
 * con onCambiarCantidad(clave, cantidad) y onQuitar(clave). Puede tener diseños (reserva) y
 * artículos de la tienda: cada ítem se identifica por su clave ('d-3', 'a-9').
 */
export default function TablaCarrito({ items, onCambiarCantidad, onQuitar }) {
  return (
    <div className="table-responsive">
      <Table className="tabla-carrito align-middle" aria-label="Diseños y artículos de tu carrito">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" className="text-end">Precio</th>
            <th scope="col" className="text-center">Cantidad</th>
            <th scope="col" className="text-end">Subtotal</th>
            <th scope="col"><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const limite = Math.max(1, limiteDeCantidad(item));
            const clave = claveDe(item);
            return (
              <tr key={clave}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img src={images[item.imagen]} alt="" width="64" height="64" className="miniatura" />
                    <span>
                      {item.nombre}
                      <small className="d-block text-muted">{detalleItem(item)}</small>
                    </span>
                  </div>
                </td>
                <td className="text-end">{formatoCLP(item.precio)}</td>
                <td>
                  <div className="selector-cantidad mx-auto">
                    <Button
                      variant="outline-dark" size="sm"
                      aria-label={`Quitar una unidad de ${item.nombre}`}
                      disabled={item.cantidad <= 1}
                      onClick={() => onCambiarCantidad(clave, item.cantidad - 1)}
                    >−</Button>
                    <Form.Control
                      size="sm" type="number" min={1} max={limite}
                      aria-label={`Cantidad de ${item.nombre}`}
                      value={item.cantidad}
                      onChange={(e) => onCambiarCantidad(clave, e.target.value)}
                    />
                    <Button
                      variant="outline-dark" size="sm"
                      aria-label={`Agregar una unidad de ${item.nombre}`}
                      disabled={item.cantidad >= limite}
                      onClick={() => onCambiarCantidad(clave, item.cantidad + 1)}
                    >+</Button>
                  </div>
                  <small className="d-block text-center text-muted mt-1">Máx. {limite}</small>
                </td>
                <td className="text-end fw-semibold">{formatoCLP(item.precio * item.cantidad)}</td>
                <td className="text-end">
                  <Button variant="link" className="text-danger p-0" onClick={() => onQuitar(clave)}>
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
