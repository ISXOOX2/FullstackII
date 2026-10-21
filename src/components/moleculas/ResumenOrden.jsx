import { formatoCLP } from '../../utils/formato.js';

/** Resumen de lo que se va a pagar (lista corta de diseños + total). Solo presenta datos. */
export default function ResumenOrden({ items, total, titulo = 'Resumen de tu reserva' }) {
  return (
    <section className="resumen-orden" aria-label={titulo}>
      <h2 className="h5">{titulo}</h2>
      <ul className="list-unstyled mb-3">
        {items.map((item) => (
          <li key={item.productoId} className="d-flex justify-content-between gap-3 py-2 border-bottom">
            <span>{item.nombre} <span className="text-muted">× {item.cantidad}</span></span>
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
