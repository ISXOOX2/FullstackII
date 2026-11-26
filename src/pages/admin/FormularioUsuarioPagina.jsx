import { Link, useNavigate, useParams } from 'react-router-dom';
import FormularioUsuario from '../../components/organismos/FormularioUsuario.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { actualizarUsuario, crearUsuario, obtenerUsuario, usuarioPublico } from '../../services/usuariosService.js';
import { mensajeDeError, USAR_API } from '../../services/api.js';
import { guardarUsuarioApi } from '../../services/adminApi.js';

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

  const guardar = async (datos) => {
    let guardado;
    if (USAR_API) {
      // Con backend: POST o PUT en ms-auth (valida RUN, edad, correo único...)
      try {
        guardado = await guardarUsuarioApi(existente, datos);
      } catch (e) {
        return mensajeDeError(e);
      }
    } else {
      const resultado = existente ? actualizarUsuario(existente.id, datos) : crearUsuario(datos);
      if (!resultado.ok) return resultado.error;
      guardado = usuarioPublico(resultado.usuario);
    }
    // Si el administrador se edita a sí mismo, la sesión debe reflejar los cambios.
    if (existente && existente.id === sesion.id) actualizarSesion(guardado);
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
