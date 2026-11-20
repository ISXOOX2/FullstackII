import { formatoCLP } from '../../utils/formato.js';
import { claveDe, detalleItem } from '../../services/carritoService.js';

/** Resumen de lo que se va a pagar (lista corta de diseños + total). Solo presenta datos. */
export default function ResumenOrden({ items, total, titulo = 'Resumen de tu compra' }) {
  return (
    <section className="resumen-orden" aria-label={titulo}>
      <h2 className="h5">{titulo}</h2>
      <ul className="list-unstyled mb-3">
        {items.map((item) => (
          <li key={claveDe(item)} className="d-flex justify-content-between gap-3 py-2 border-bottom">
            <span>{item.nombre} <span className="text-muted">× {item.cantidad} · {detalleItem(item)}</span></span>
            <span>{formatoCLP(item.precio * item.cantidad)}</span>
          </li>
        ))}
      </ul>
      <p className="d-flex justify-content-between fs-5 mb-0">
        <strong>Total</strong>
        <strong data-testid="total-resumen">{formatoCLP(total)}</strong>
      </p>
    </section>
  );
}
