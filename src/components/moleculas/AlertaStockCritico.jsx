import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

/**
 * Alerta de stock crítico de INSUMOS: lista los que tienen stock igual o inferior al nivel crítico.
 * Si no hay ninguno no muestra nada (renderizado condicional).
 */
export default function AlertaStockCritico({ insumos, enlazar = true }) {
  if (insumos.length === 0) return null;
  return (
    <Alert variant="warning" role="alert" className="alerta-critico">
      <Alert.Heading as="h2" className="h6">Stock crítico: {insumos.length} insumo(s) por reponer</Alert.Heading>
      <ul className="mb-0">
        {insumos.map((i) => (
          <li key={i.id}>
            {i.nombre} — quedan {i.stock} {i.unidad} (crítico: {i.stockCritico})
          </li>
        ))}
      </ul>
      {enlazar && <Link to="/admin/insumos" className="d-inline-block mt-2">Ir a insumos</Link>}
    </Alert>
  );
}
