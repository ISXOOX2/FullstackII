import { Link, useNavigate, useParams } from 'react-router-dom';
import FormularioUsuario from '../../components/organismos/FormularioUsuario.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { actualizarUsuario, crearUsuario, obtenerUsuario, usuarioPublico } from '../../services/usuariosService.js';

/** Crear (/admin/usuarios/nuevo) o editar (/admin/usuarios/:id/editar) un usuario. */
export default function FormularioUsuarioPagina({ usuario: sesion, actualizarSesion, mostrarAviso }) {
  const { id } = useParams();
  const navegar = useNavigate();
  const existente = id ? obtenerUsuario(id) : null;

  if (id && !existente) {
    return (
      <MensajeVacio titulo="Ese usuario no existe">
        <Link to="/admin/usuarios" className="btn btn-dark">Volver</Link>
      </MensajeVacio>
    );
  }

  const guardar = (datos) => {
    const resultado = existente ? actualizarUsuario(existente.id, datos) : crearUsuario(datos);
    if (!resultado.ok) return resultado.error;
    // Si el administrador se edita a sí mismo, la sesión debe reflejar los cambios.
    if (existente && existente.id === sesion.id) actualizarSesion(usuarioPublico(resultado.usuario));
    mostrarAviso(existente ? 'Usuario actualizado.' : 'Usuario creado.');
    navegar('/admin/usuarios');
    return '';
  };

  return (
    <>
      <h1 className="titulo-seccion">{existente ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      <FormularioUsuario modo={existente ? 'admin-editar' : 'admin-nuevo'} inicial={existente} onEnviar={guardar} />
    </>
  );
}
