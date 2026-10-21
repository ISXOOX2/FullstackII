import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FiltrosProductos from '../../components/organismos/FiltrosProductos.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import useAgregarAlCarrito from '../../hooks/useAgregarAlCarrito.js';
import { buscarProductos } from '../../services/productosService.js';
import { listarCategorias } from '../../services/categoriasService.js';

const FILTROS_VACIOS = { texto: '', categoriaId: '', precioMax: '', soloOfertas: false, orden: 'relevancia' };

/**
 * Catálogo completo con filtros. La búsqueda de la barra llega por la URL (?q=texto).
 * Como en el material 2.2.1, los parámetros de búsqueda se leen con useLocation():
 * location.search trae "?q=texto" y URLSearchParams permite pedir cada parámetro por nombre.
 */
export default function Productos() {
  const location = useLocation();
  const navegar = useNavigate();
  const textoUrl = new URLSearchParams(location.search).get('q') || '';
  const [filtros, setFiltros] = useState({ ...FILTROS_VACIOS, texto: textoUrl });
  const [ultimoTextoUrl, setUltimoTextoUrl] = useState(textoUrl);
  const agregar = useAgregarAlCarrito();

  // Si el usuario busca de nuevo desde la barra, la URL cambia y el filtro de texto se actualiza.
  if (textoUrl !== ultimoTextoUrl) {
    setUltimoTextoUrl(textoUrl);
    setFiltros((actuales) => ({ ...actuales, texto: textoUrl }));
  }

  const productos = useMemo(() => buscarProductos(filtros), [filtros]);

  const cambiar = (campo, valor) => setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
  const limpiar = () => {
    setFiltros(FILTROS_VACIOS);
    navegar('/productos'); // quita el ?q= de la URL
  };

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Diseños' }]} />
      <h1 className="titulo-seccion">Todos los diseños</h1>
      <FiltrosProductos filtros={filtros} categorias={listarCategorias()} onCambiar={cambiar} onLimpiar={limpiar} />
      <p className="text-muted small" role="status">{productos.length} diseño(s) encontrados</p>
      <ListaProductos productos={productos} onAgregar={agregar} />
    </Container>
  );
}
