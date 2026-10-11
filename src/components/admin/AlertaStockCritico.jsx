import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

/**
 * Alerta de stock crítico: lista los diseños con cupos iguales o inferiores al nivel crítico.
 * Si no hay ninguno no muestra nada (renderizado condicional).
 */
export default function AlertaStockCritico({ productos, puedeEditar = false }) {
  if (productos.length === 0) return null;
  return (
    <Alert variant="warning" role="alert" className="alerta-critico">
      <Alert.Heading as="h2" className="h6">Stock crítico: {productos.length} diseño(s) con pocos cupos</Alert.Heading>
      <ul className="mb-0">
        {productos.map((p) => (
          <li key={p.id}>
            {puedeEditar ? <Link to={`/admin/productos/${p.id}/editar`}>{p.nombre}</Link> : p.nombre}
            {' '}— quedan {p.stock} (crítico: {p.stockCritico})
          </li>
        ))}
      </ul>
    </Alert>
  );
}
