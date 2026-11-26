// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Cuando el backend está activo (VITE_USAR_API=true), la API es la FUENTE DE VERDAD.
// • Estas funciones piden los datos a los microservicios con axios y guardan una COPIA en la
//   base local (data/db.js). Así el resto de las páginas sigue leyendo igual que antes.
// • Se llama al abrir la app, al iniciar sesión y después de cada cambio (comprar, pedir
//   reembolso, aprobar...).
// ───────────────────────────────────────────────────────────────────────────
import { listar, reemplazarColeccion } from '../data/db.js';
import { apiCatalogo, apiReservas, apiUsuarios, USAR_API } from './api.js';
import { leerSesion } from './sesionService.js';

const esPersonal = (usuario) => usuario?.tipo === 'Administrador' || usuario?.tipo === 'Vendedor';

/** Catálogo (ms-catalogo): diseños, estilos y los artículos de la Tienda (todos los insumos si es admin). */
export async function sincronizarCatalogo(usuario = leerSesion()) {
  const [disenos, categorias] = await Promise.all([apiCatalogo.get('/disenos'), apiCatalogo.get('/categorias')]);
  reemplazarColeccion('productos', disenos.data);
  reemplazarColeccion('categorias', categorias.data);

  if (usuario?.tipo === 'Administrador') {
    const insumos = await apiCatalogo.get('/insumos');
    reemplazarColeccion('insumos', insumos.data);
  } else {
    const tienda = await apiCatalogo.get('/tienda');
    const internos = listar('insumos').filter((i) => !i.aLaVenta);
    reemplazarColeccion('insumos', [...internos, ...tienda.data]);
  }
}

/** Reseñas (ms-catalogo /resenas): públicas, las ve cualquiera. */
export async function sincronizarResenas() {
  const respuesta = await apiCatalogo.get('/resenas');
  reemplazarColeccion('resenas', respuesta.data);
}

/** Proyectos de clientes y mensajes de contacto (ms-reservas): solo los ve el personal. */
export async function sincronizarSolicitudesClientes(usuario = leerSesion()) {
  if (!esPersonal(usuario)) {
    reemplazarColeccion('proyectos', []);
    reemplazarColeccion('mensajes', []);
    return;
  }
  const [proyectos, mensajes] = await Promise.all([apiReservas.get('/proyectos'), apiReservas.get('/mensajes')]);
  reemplazarColeccion('proyectos', proyectos.data);
  reemplazarColeccion('mensajes', mensajes.data);
}

/** Usuarios (ms-auth): el administrador ve la lista real; los demás solo su propia cuenta. */
export async function sincronizarUsuarios(usuario = leerSesion()) {
  if (!usuario?.token) return;
  if (usuario.tipo === 'Administrador') {
    const respuesta = await apiUsuarios.get('');
    reemplazarColeccion('usuarios', respuesta.data.map((u) => ({ ...u, password: '' })));
    return;
  }
  const { token, ...datos } = usuario;
  const otros = listar('usuarios').filter((u) => u.id !== usuario.id);
  reemplazarColeccion('usuarios', [...otros, { ...datos, password: '' }]);
}

/** Convierte una orden de ms-reservas al formato que usan las páginas del frontend. */
export function ordenDesdeApi(o, solicitudes = [], historial = []) {
  const productos = listar('productos');
  const insumos = listar('insumos');
  const ultima = solicitudes[0]; // la API las entrega de la más nueva a la más antigua
  return {
    id: o.id,
    numero: o.numero,
    codigo: `ORDER${1000 + o.id}`,
    usuarioId: o.usuarioId,
    fecha: String(o.fecha).slice(0, 19),
    estado: o.estado,
    total: o.total,
    metodoPago: o.estado === 'Pagada' || o.estado === 'Reembolsada' ? 'Tarjeta (simulado)' : '',
    cliente: { nombre: o.clienteNombre, apellidos: o.clienteApellidos, correo: o.clienteCorreo, telefono: o.clienteTelefono },
    cita: o.citaFecha
      ? { fecha: o.citaFecha, hora: o.citaHora, tatuadorId: o.tatuadorId, zonaCuerpo: o.zonaCuerpo, indicaciones: o.indicaciones || '' }
      : null,
    items: o.items.map((i) => (i.tipo === 'diseno'
      ? {
        clave: `d-${i.productoId}`, tipo: 'diseno', productoId: i.productoId, nombre: i.nombre, precio: i.precio,
        cantidad: i.cantidad, anchoCm: i.anchoCm, altoCm: i.altoCm,
        imagen: productos.find((p) => p.id === i.productoId)?.imagen,
        categoriaId: productos.find((p) => p.id === i.productoId)?.categoriaId,
      }
      : {
        clave: `a-${i.articuloId}`, tipo: 'articulo', articuloId: i.articuloId, nombre: i.nombre, precio: i.precio,
        cantidad: i.cantidad, imagen: insumos.find((a) => a.id === i.articuloId)?.imagen,
      })),
    solicitud: ultima
      ? {
        id: ultima.id, tipo: ultima.tipo, motivo: ultima.motivo, justificativo: ultima.justificativo,
        nuevaFecha: ultima.nuevaFecha, nuevaHora: ultima.nuevaHora, estado: ultima.estado,
        fechaSolicitud: ultima.fecha, respuesta: ultima.respuesta || '',
      }
      : null,
    historialEstados: historial
      .filter((h) => h.de) // el primer registro ("Orden creada") no es un cambio de estado
      .map((h) => ({ de: h.de, a: h.a, motivo: h.motivo, responsable: h.responsable, fecha: h.fecha })),
  };
}

/** Órdenes (ms-reservas): el personal ve todas; el cliente, las suyas. Trae el detalle de cada una. */
export async function sincronizarOrdenes(usuario = leerSesion()) {
  if (!usuario?.token) {
    reemplazarColeccion('ordenes', []);
    return;
  }
  const lista = await apiReservas.get(esPersonal(usuario) ? '' : '/mias');
  const detalles = await Promise.all(lista.data.map((o) => apiReservas.get(`/${o.id}`)));
  reemplazarColeccion('ordenes', detalles.map((d) => ordenDesdeApi(d.data.orden, d.data.solicitudes, d.data.historial)));
}

/** Todo junto. Si la API no responde, deja los datos que había y lanza el error para avisar. */
export async function sincronizarTodo(usuario) {
  if (!USAR_API) return;
  await sincronizarCatalogo(usuario);
  await Promise.all([
    sincronizarUsuarios(usuario), sincronizarOrdenes(usuario),
    sincronizarResenas(), sincronizarSolicitudesClientes(usuario),
  ]);
}
