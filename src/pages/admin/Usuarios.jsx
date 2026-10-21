import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Table } from 'react-bootstrap';
import ModalConfirmacion from '../../components/moleculas/ModalConfirmacion.jsx';
import { useSesion } from '../../context/SesionContext.jsx';
import { useAvisos } from '../../context/AvisosContext.jsx';
import { eliminarUsuario, listarUsuarios } from '../../services/usuariosService.js';

export default function Usuarios() {
  const { usuario: actual } = useSesion();
  const { mostrar } = useAvisos();
  const [, setVersion] = useState(0);
  const [aEliminar, setAEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  const confirmar = () => {
    const resultado = eliminarUsuario(aEliminar.id, actual.id);
    if (!resultado.ok) {
      setErrorEliminar(resultado.error);
      return;
    }
    mostrar('Usuario eliminado.', 'secondary');
    setAEliminar(null);
    setVersion((v) => v + 1);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="titulo-seccion mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-dark">Nuevo usuario</Link>
      </div>
      <div className="table-responsive">
        <Table hover size="sm" className="align-middle">
          <thead><tr><th scope="col">RUN</th><th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Tipo</th><th scope="col">Comuna</th><th scope="col">Acciones</th></tr></thead>
          <tbody>
            {listarUsuarios().map((u) => (
              <tr key={u.id}>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><Badge bg={u.tipo === 'Administrador' ? 'dark' : u.tipo === 'Vendedor' ? 'secondary' : 'light'} text={u.tipo === 'Cliente' ? 'dark' : undefined} className="fw-normal border">{u.tipo}</Badge></td>
                <td>{u.comuna}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/usuarios/${u.id}/editar`} className="me-3">Editar</Link>
                  {u.tipo === 'Cliente' && <Link to={`/admin/usuarios/${u.id}/historial`} className="me-3">Historial</Link>}
                  <Button variant="link" className="text-danger p-0 align-baseline" onClick={() => { setErrorEliminar(''); setAEliminar(u); }}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ModalConfirmacion
        show={Boolean(aEliminar)}
        titulo="Eliminar usuario"
        mensaje={
          aEliminar && (
            <>
              <p className="mb-2">¿Seguro que quieres eliminar a {aEliminar.nombre} {aEliminar.apellidos}?</p>
              {errorEliminar && <p className="text-danger mb-0" role="alert">{errorEliminar}</p>}
            </>
          )
        }
        textoConfirmar="Eliminar"
        onConfirmar={confirmar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}
