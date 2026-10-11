import { useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import FormularioCategoria from '../../components/admin/FormularioCategoria.jsx';
import ModalConfirmacion from '../../components/comunes/ModalConfirmacion.jsx';
import { useAvisos } from '../../context/AvisosContext.jsx';
import {
  actualizarCategoria, contarProductosDeCategoria, crearCategoria, eliminarCategoria, listarCategorias,
} from '../../services/categoriasService.js';

/** Mantenedor de categorías (estilos). El formulario se abre en una ventana modal. */
export default function Categorias() {
  const { mostrar } = useAvisos();
  const [, setVersion] = useState(0);
  const refrescar = () => setVersion((v) => v + 1);
  const [editando, setEditando] = useState(null); // null = cerrado, {} = nueva, {id,...} = editar
  const [aEliminar, setAEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  const guardar = (valores) => {
    const resultado = editando.id ? actualizarCategoria(editando.id, valores) : crearCategoria(valores);
    if (!resultado.ok) return resultado.error;
    mostrar(editando.id ? 'Categoría actualizada.' : 'Categoría creada.');
    setEditando(null);
    refrescar();
    return '';
  };

  const confirmarEliminar = () => {
    const resultado = eliminarCategoria(aEliminar.id);
    if (!resultado.ok) {
      setErrorEliminar(resultado.error);
      return;
    }
    mostrar('Categoría eliminada.', 'secondary');
    setAEliminar(null);
    refrescar();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="titulo-seccion mb-0">Categorías</h1>
        <Button variant="dark" onClick={() => setEditando({})}>Nueva categoría</Button>
      </div>
      <div className="table-responsive">
        <Table hover size="sm" className="align-middle">
          <thead><tr><th scope="col">Nombre</th><th scope="col">Descripción</th><th scope="col" className="text-center">Diseños</th><th scope="col">Acciones</th></tr></thead>
          <tbody>
            {listarCategorias().map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.descripcion}</td>
                <td className="text-center">{contarProductosDeCategoria(c.id)}</td>
                <td className="text-nowrap">
                  <Button variant="link" className="p-0 me-3 align-baseline" onClick={() => setEditando(c)}>Editar</Button>
                  <Button variant="link" className="text-danger p-0 align-baseline" onClick={() => { setErrorEliminar(''); setAEliminar(c); }}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={Boolean(editando)} onHide={() => setEditando(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">{editando?.id ? 'Editar categoría' : 'Nueva categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editando && <FormularioCategoria inicial={editando.id ? editando : null} onEnviar={guardar} onCancelar={() => setEditando(null)} />}
        </Modal.Body>
      </Modal>

      <ModalConfirmacion
        show={Boolean(aEliminar)}
        titulo="Eliminar categoría"
        mensaje={
          aEliminar && (
            <>
              <p className="mb-2">¿Seguro que quieres eliminar «{aEliminar.nombre}»?</p>
              {errorEliminar && <p className="text-danger mb-0" role="alert">{errorEliminar}</p>}
            </>
          )
        }
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}
