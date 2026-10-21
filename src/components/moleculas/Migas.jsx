import { Link } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

/**
 * Migas de pan: Home > Categoría > Producto.
 * items: [{ texto, to }]. El último elemento no lleva "to" (es la página actual).
 */
export default function Migas({ items }) {
  return (
    <Breadcrumb className="migas" listProps={{ className: 'mb-0' }}>
      {items.map((item, indice) =>
        item.to ? (
          <Breadcrumb.Item key={indice} linkAs={Link} linkProps={{ to: item.to }}>
            {item.texto}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={indice} active>
            {item.texto}
          </Breadcrumb.Item>
        ),
      )}
    </Breadcrumb>
  );
}
