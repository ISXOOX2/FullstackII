import { Link, useNavigate, useParams } from 'react-router-dom';
import FormularioProducto from '../../components/admin/FormularioProducto.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { useAvisos } from '../../context/AvisosContext.jsx';
import { listarCategorias } from '../../services/categoriasService.js';
import { actualizarProducto, crearProducto, obtenerProducto } from '../../services/productosService.js';

/** Página para crear (/admin/productos/nuevo) o editar (/admin/productos/:id/editar) un diseño. */
export default function FormularioProductoPagina() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { mostrar } = useAvisos();
  const existente = id ? obtenerProducto(id) : null;

  if (id && !existente) {
    return (
      <MensajeVacio titulo="Ese diseño no existe">
        <Link to="/admin/productos" className="btn btn-dark">Volver</Link>
      </MensajeVacio>
    );
  }

  const guardar = (valores) => {
    const resultado = existente ? actualizarProducto(existente.id, valores) : crearProducto(valores);
    if (!resultado.ok) return resultado.error;
    mostrar(existente ? 'Diseño actualizado.' : 'Diseño creado.');
    navegar('/admin/productos');
    return '';
  };

  return (
    <>
      <h1 className="titulo-seccion">{existente ? `Editar «${existente.nombre}»` : 'Nuevo diseño'}</h1>
      <FormularioProducto inicial={existente} categorias={listarCategorias()} onEnviar={guardar} />
    </>
  );
}
