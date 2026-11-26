// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • CRUD del panel contra el backend (con VITE_USAR_API=true):
//     Crear  -> POST     Leer -> GET (ver sincronizacion.js)
//     Editar -> PUT      Eliminar -> DELETE
// • Diseños, estilos e insumos van a ms-catalogo; usuarios a ms-auth.
// • Después de cada cambio se vuelve a sincronizar para que el panel muestre lo que guardó la API.
// • Los errores (validaciones, permisos, duplicados) los devuelve el backend en { mensaje } y se
//   muestran en el formulario con mensajeDeError.
// ───────────────────────────────────────────────────────────────────────────
import { apiCatalogo, apiUsuarios } from './api.js';
import { sincronizarCatalogo, sincronizarUsuarios } from './sincronizacion.js';
import { normalizarProducto } from './productosService.js';

const numeroONulo = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

// ── Diseños (ms-catalogo /disenos) ─────────────────────────────────────────

/** POST /disenos (nuevo, el código FI-### lo pone el servidor) o PUT /disenos/{id} (editar). */
export async function guardarDisenoApi(existente, valores) {
  const { codigo, ...datos } = normalizarProducto({ ...valores, codigo: existente?.codigo ?? '' }); // eslint-disable-line no-unused-vars
  const imagenes = existente?.imagenes && existente.imagen === datos.imagen ? existente.imagenes : [datos.imagen];
  const cuerpo = { ...datos, imagenes };
  const respuesta = existente
    ? await apiCatalogo.put(`/disenos/${existente.id}`, cuerpo)
    : await apiCatalogo.post('/disenos', cuerpo);
  await sincronizarCatalogo();
  return respuesta.data;
}

/** DELETE /disenos/{id} */
export async function eliminarDisenoApi(id) {
  await apiCatalogo.delete(`/disenos/${id}`);
  await sincronizarCatalogo();
}

// ── Estilos (ms-catalogo /categorias) ──────────────────────────────────────

export async function guardarCategoriaApi(existente, valores) {
  const cuerpo = {
    nombre: valores.nombre.trim(),
    descripcion: (valores.descripcion || '').trim(),
    imagen: existente?.imagen ?? null,
  };
  const respuesta = existente?.id
    ? await apiCatalogo.put(`/categorias/${existente.id}`, cuerpo)
    : await apiCatalogo.post('/categorias', cuerpo);
  await sincronizarCatalogo();
  return respuesta.data;
}

export async function eliminarCategoriaApi(id) {
  await apiCatalogo.delete(`/categorias/${id}`);
  await sincronizarCatalogo();
}

// ── Insumos y artículos de la Tienda (ms-catalogo /insumos) ────────────────

export async function guardarInsumoApi(existente, valores) {
  const aLaVenta = valores.aLaVenta === true || valores.aLaVenta === 'true';
  const cuerpo = {
    nombre: valores.nombre.trim(),
    tipo: valores.tipo,
    unidad: valores.unidad.trim(),
    stock: Number(valores.stock),
    stockCritico: Number(valores.stockCritico),
    aLaVenta,
    precio: aLaVenta ? numeroONulo(valores.precio) : null,
    descripcion: aLaVenta ? valores.descripcion : null,
    imagen: aLaVenta ? valores.imagen : null,
  };
  const respuesta = existente
    ? await apiCatalogo.put(`/insumos/${existente.id}`, cuerpo)
    : await apiCatalogo.post('/insumos', cuerpo);
  await sincronizarCatalogo();
  return respuesta.data;
}

export async function eliminarInsumoApi(id) {
  await apiCatalogo.delete(`/insumos/${id}`);
  await sincronizarCatalogo();
}

// ── Usuarios (ms-auth) ──────────────────────────────────────────────────

/** Datos del formulario en el formato de UsuarioRequest (sin campos de confirmación). */
export function usuarioParaApi(datos) {
  return {
    run: String(datos.run || '').trim().toUpperCase(),
    nombre: datos.nombre,
    apellidos: datos.apellidos,
    correo: String(datos.correo || '').trim(),
    password: datos.password ? datos.password : null, // vacía al editar = se mantiene la anterior
    fechaNacimiento: datos.fechaNacimiento,
    telefono: String(datos.telefono || '').replace(/\s+/g, ''),
    tipo: datos.tipo || null,
    region: datos.region || null,
    comuna: datos.comuna || null,
    direccion: datos.direccion,
  };
}

/** POST /usuarios (admin crea) o PUT /usuarios/{id} (admin edita, o el usuario edita su perfil). */
export async function guardarUsuarioApi(existente, datos) {
  const cuerpo = usuarioParaApi(datos);
  const respuesta = existente
    ? await apiUsuarios.put(`/${existente.id}`, cuerpo)
    : await apiUsuarios.post('', cuerpo);
  await sincronizarUsuarios();
  return respuesta.data;
}

export async function eliminarUsuarioApi(id) {
  await apiUsuarios.delete(`/${id}`);
  await sincronizarUsuarios();
}
