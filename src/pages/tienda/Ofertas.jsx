import { Container } from 'react-bootstrap';
import ListaProductos from '../../components/tienda/ListaProductos.jsx';
import Migas from '../../components/comunes/Migas.jsx';
import useAgregarAlCarrito from '../../hooks/useAgregarAlCarrito.js';
import { productosEnOferta } from '../../services/productosService.js';

export default function Ofertas() {
  const agregar = useAgregarAlCarrito();
  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Ofertas' }]} />
      <h1 className="titulo-seccion">Ofertas</h1>
      <p className="text-muted mb-4">Diseños con precio especial mientras queden cupos.</p>
      <ListaProductos
        productos={productosEnOferta()}
        onAgregar={agregar}
        vacioTitulo="No hay ofertas por ahora"
        vacioTexto="Vuelve pronto: publicamos promociones cada mes."
      />
    </Container>
  );
}
