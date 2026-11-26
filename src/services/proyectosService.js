// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • "Mi proyecto": el cliente que ya tiene una idea propia la envía (con imagen de referencia
//   opcional). El estudio se compromete a contactarlo en un plazo de 3 DÍAS HÁBILES
//   (lunes a viernes) para evaluar la idea y coordinar una sesión.
// • contactarAntesDe = fecha de envío + 3 días hábiles. Si pasa esa fecha y sigue "Nuevo",
//   el panel lo marca como atrasado.
// • Con backend, la idea se envía a ms-reservas (POST /proyectos) y el servidor calcula la fecha
//   límite y el estado: así el administrador la ve desde cualquier computador.
// ───────────────────────────────────────────────────────────────────────────
import { actualizar, crear, listar } from '../data/db.js';
import { DIAS_HABILES_CONTACTO } from '../data/estudio.js';
import { fechaISO, sumarDiasHabiles } from '../utils/formato.js';
import { apiReservas, USAR_API } from './api.js';
import { sincronizarSolicitudesClientes } from './sincronizacion.js';

const COLECCION = 'proyectos';
export const ESTADOS_PROYECTO = ['Nuevo', 'Contactado', 'Sesión coordinada', 'Descartado'];

export function listarProyectos() {
  return listar(COLECCION).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
}

/** Guarda la idea del cliente y calcula hasta cuándo hay que contactarlo. */
export function crearProyecto({ nombre, correo, zonaCuerpo, lado = '', idea, imagen = '' }, usuarioId = null, hoy = fechaISO()) {
  return crear(COLECCION, {
    nombre: nombre.trim(),
    correo: correo.trim(),
    zonaCuerpo,
    lado,
    idea: idea.trim(),
    imagen,
    fecha: hoy,
    contactarAntesDe: sumarDiasHabiles(hoy, DIAS_HABILES_CONTACTO),
    estado: 'Nuevo',
    usuarioId,
  });
}

export function cambiarEstadoProyecto(id, estado) {
  if (!ESTADOS_PROYECTO.includes(estado)) return null;
  return actualizar(COLECCION, id, { estado });
}

/** Atrasado: sigue "Nuevo" y ya pasó la fecha límite de contacto. */
export function estaAtrasado(proyecto, hoy = fechaISO()) {
  return proyecto.estado === 'Nuevo' && proyecto.contactarAntesDe < hoy;
}

export function proyectosPendientes() {
  return listarProyectos().filter((p) => p.estado === 'Nuevo');
}

/** Enviar la idea del cliente (con backend va a ms-reservas). Devuelve el proyecto guardado. */
export async function enviarProyecto(datos, usuarioId = null) {
  if (!USAR_API) return crearProyecto(datos, usuarioId);
  const respuesta = await apiReservas.post('/proyectos', {
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim(),
    zonaCuerpo: datos.zonaCuerpo,
    lado: datos.lado || '',
    idea: datos.idea.trim(),
    imagen: datos.imagen || '',
  });
  return respuesta.data;
}

/** Cambiar el estado desde el panel (con backend, PUT /proyectos/{id}/estado). */
export async function actualizarEstadoProyecto(id, estado) {
  if (!USAR_API) return cambiarEstadoProyecto(id, estado);
  const respuesta = await apiReservas.put(`/proyectos/${id}/estado`, { estado });
  await sincronizarSolicitudesClientes();
  return respuesta.data;
}
