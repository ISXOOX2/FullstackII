import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FiltrosProductos from '../../components/organismos/FiltrosProductos.jsx';
import ListaProductos from '../../components/organismos/ListaProductos.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import { buscarProductos, listarProductos } from '../../services/productosService.js';
import { api } from '../../services/api.js';
import { listarCategorias } from '../../services/categoriasService.js';

const FILTROS_VACIOS = { texto: '', categoriaId: '', precioMax: '', soloOfertas: false, orden: 'relevancia' };

/**
 * Catálogo completo con filtros. La búsqueda de la barra llega por la URL (?q=texto).
 * Como en el material 2.2.1, los parámetros de búsqueda se leen con useLocation():
 * location.search trae "?q=texto" y URLSearchParams permite pedir cada parámetro por nombre.
 *
 * Los diseños se piden a producto-service con axios dentro de un useEffect (clase React V).
 * Mientras llegan, y si el microservicio no responde, se muestran los datos locales (db.js).
 */
export default function Productos({ onAgregar }) {
  const location = useLocation();
  const navegar = useNavigate();
  const textoUrl = new URLSearchParams(location.search).get('q') || '';
  const [filtros, setFiltros] = useState({ ...FILTROS_VACIOS, texto: textoUrl });
  const [ultimoTextoUrl, setUltimoTextoUrl] = useState(textoUrl);
  const [catalogo, setCatalogo] = useState(() => listarProductos());
  const [origen, setOrigen] = useState('local');

  // [] = se ejecuta una sola vez, al montar la página
  useEffect(() => {
    api.listarProductos()
      .then((productos) => {
        setCatalogo(productos);
        setOrigen('microservicio');
      })
      .catch(() => setOrigen('local')); // producto-service apagado: se quedan los datos locales
  }, []);

  // Si el usuario busca de nuevo desde la barra, la URL cambia y el filtro de texto se actualiza.
  if (textoUrl !== ultimoTextoUrl) {
    setUltimoTextoUrl(textoUrl);
    setFiltros((actuales) => ({ ...actuales, texto: textoUrl }));
  }

  const productos = buscarProductos(filtros, catalogo); // se recalcula cada vez que cambia el estado

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
      <p className="text-muted small" role="status">
        {productos.length} diseño(s) encontrados
        <span className="ms-2" data-testid="origen-catalogo">
          · {origen === 'microservicio' ? 'Catálogo desde producto-service' : 'Catálogo local'}
        </span>
      </p>
      <ListaProductos productos={productos} onAgregar={onAgregar} />
    </Container>
  );
}
