import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import ModalConfirmacion from '../../components/moleculas/ModalConfirmacion.jsx';
import { eliminarProducto, listarProductos } from '../../services/productosService.js';
import { mensajeDeError, USAR_API } from '../../services/api.js';
import { eliminarDisenoApi } from '../../services/adminApi.js';
import { nombreCategoria } from '../../services/categoriasService.js';
import { formatoCLP } from '../../utils/formato.js';
import images from '../../assets/images.js';

/** Mantenedor de productos. El vendedor solo puede ver (sin crear, editar ni eliminar). */
export default function Productos({ usuario, mostrarAviso }) {
  const puedeEditar = usuario.tipo === 'Administrador';
  const [version, setVersion] = useState(0); // al cambiar, la lista se vuelve a leer de la base
  const [aEliminar, setAEliminar] = useState(null);

  const productos = listarProductos();

  const confirmarEliminar = async () => {
    if (USAR_API) {
      // Con backend: DELETE en ms-catalogo
      try {
        await eliminarDisenoApi(aEliminar.id);
      } catch (e) {
        mostrarAviso(mensajeDeError(e), 'danger');
        setAEliminar(null);
        return;
      }
    } else {
      eliminarProducto(aEliminar.id);
    }
    mostrarAviso(`«${aEliminar.nombre}» fue eliminado.`, 'secondary');
    setAEliminar(null);
    setVersion(version + 1);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="titulo-seccion mb-0">Productos</h1>
        {puedeEditar && <Link to="/admin/productos/nuevo" className="btn btn-dark">Nuevo diseño</Link>}
      </div>
      {!puedeEditar && <p className="text-muted small">Tu rol (Vendedor) permite consultar el catálogo, pero no modificarlo.</p>}
      <div className="table-responsive">
        <Table hover size="sm" className="align-middle" data-version={version}>
          <thead>
            <tr><th scope="col">Código</th><th scope="col">Diseño</th><th scope="col">Estilo</th><th scope="col" className="text-end">Precio</th><th scope="col">Acciones</th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>
                  <img src={images[p.imagen]} alt="" width="36" height="36" className="miniatura me-2" />
                  {p.nombre}
                </td>
                <td>{nombreCategoria(p.categoriaId)}</td>
                <td className="text-end">{formatoCLP(p.precioOferta ?? p.precio)}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="me-3">Ver</Link>
                  {puedeEditar && (
                    <>
                      <Link to={`/admin/productos/${p.id}/editar`} className="me-3">Editar</Link>
                      <Button variant="link" className="text-danger p-0 align-baseline" onClick={() => setAEliminar(p)}>Eliminar</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ModalConfirmacion
        show={Boolean(aEliminar)}
        titulo="Eliminar diseño"
        mensaje={aEliminar ? `¿Seguro que quieres eliminar «${aEliminar.nombre}»? Esta acción no se puede deshacer.` : ''}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}
