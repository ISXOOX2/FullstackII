/**
 * Servicio de productos (diseños de tatuaje).
 * Usa el CRUD genérico de db.js y agrega las reglas propias del catálogo:
 * ofertas y búsqueda con filtros. Los diseños no tienen stock: se pueden tatuar las veces que se quiera.
 */
import { listar, obtenerPorId, crear, actualizar, eliminar } from '../data/db.js';
import { normalizarTexto } from '../utils/formato.js';

const COLECCION = 'productos';

const tieneValor = (v) => v !== null && v !== undefined && v !== '';

/** Precio que realmente paga el cliente (oferta si existe, si no el precio normal). */
export function precioFinal(producto) {
  return estaEnOferta(producto) ? producto.precioOferta : producto.precio;
}

export function estaEnOferta(producto) {
  return tieneValor(producto.precioOferta) && Number(producto.precioOferta) < Number(producto.precio);
}

/**
 * Texto del tamaño para mostrar: "7 x 6 cm" (ancho x alto). Recibe un diseño o un ítem del carrito.
 * Si un registro antiguo todavía trae el tamaño como texto, se muestra ese texto.
 */
export function textoTamano(medidas) {
  if (tieneValor(medidas?.anchoCm) && tieneValor(medidas?.altoCm)) return `${medidas.anchoCm} x ${medidas.altoCm} cm`;
  return medidas?.tamano || 'Sin medida';
}

/** Convierte lo que escribió el usuario en el formulario (texto) a los tipos correctos. */
export function normalizarProducto(datos) {
  const aNumeroONulo = (v) => (tieneValor(v) ? Number(v) : null);
  return {
    codigo: String(datos.codigo).trim().toUpperCase(),
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion || '').trim(),
    categoriaId: Number(datos.categoriaId),
    precio: Number(datos.precio),
    precioOferta: aNumeroONulo(datos.precioOferta),
    anchoCm: aNumeroONulo(datos.anchoCm),
    altoCm: aNumeroONulo(datos.altoCm),
    duracionHoras: aNumeroONulo(datos.duracionHoras),
    zonas: String(datos.zonas || '').trim(),
    nivelDolor: aNumeroONulo(datos.nivelDolor),
    colorTinta: String(datos.colorTinta || 'Negro').trim(),
    destacado: Boolean(datos.destacado),
    imagen: String(datos.imagen || 'panda-globo-corazon').trim(),
  };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------
export function listarProductos() {
  return listar(COLECCION);
}

export function obtenerProducto(id) {
  return obtenerPorId(COLECCION, id);
}

// Código de producto: lo asigna el sistema, no el administrador.
// Formato FI-001, FI-002… Cada diseño nuevo toma el número siguiente al más alto que exista,
// así nunca hay códigos repetidos ni escritos de distintas formas (fi-26, FI-0026…).
export const PREFIJO_CODIGO = 'FI-';

/** Código que recibirá el próximo diseño (por ejemplo FI-026 si el último es FI-025). */
export function siguienteCodigoProducto() {
  const mayor = listarProductos().reduce((max, p) => {
    const numero = Number(String(p.codigo).replace(PREFIJO_CODIGO, ''));
    return Number.isInteger(numero) ? Math.max(max, numero) : max;
  }, 0);
  return PREFIJO_CODIGO + String(mayor + 1).padStart(3, '0');
}

/** Crea un producto con el código siguiente. Devuelve { ok, producto } o { ok:false, error }. */
export function crearProducto(datos) {
  const producto = { ...normalizarProducto(datos), codigo: siguienteCodigoProducto() };
  const imagenes = [producto.imagen];
  return { ok: true, producto: crear(COLECCION, { ...producto, imagenes }) };
}

/** Actualiza un producto. El código NO cambia: identifica al diseño para siempre. */
export function actualizarProducto(id, datos) {
  const existente = obtenerProducto(id);
  if (!existente) return { ok: false, error: 'El producto no existe.' };
  const producto = { ...normalizarProducto(datos), codigo: existente.codigo };
  const imagenes = existente.imagenes && existente.imagen === producto.imagen
    ? existente.imagenes
    : [producto.imagen];
  return { ok: true, producto: actualizar(COLECCION, id, { ...producto, imagenes }) };
}

export function eliminarProducto(id) {
  return eliminar(COLECCION, id);
}

// ---------------------------------------------------------------------------
// Consultas de la tienda
// ---------------------------------------------------------------------------
export function productosEnOferta() {
  return listarProductos().filter(estaEnOferta);
}

export function productosDestacados(cantidad = 4) {
  return listarProductos().filter((p) => p.destacado).slice(0, cantidad);
}

export function productosPorCategoria(categoriaId) {
  return listarProductos().filter((p) => p.categoriaId === Number(categoriaId));
}

/** Otros diseños del mismo estilo (para la sección "Relacionados" del detalle). */
export function productosRelacionados(producto, cantidad = 4) {
  return listarProductos()
    .filter((p) => p.id !== producto.id && p.categoriaId === producto.categoriaId)
    .concat(listarProductos().filter((p) => p.id !== producto.id && p.categoriaId !== producto.categoriaId))
    .slice(0, cantidad);
}

/**
 * Búsqueda con filtros.
 * filtros: { texto, categoriaId, precioMax, soloOfertas, orden }
 * orden: 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre'
 */
export function buscarProductos({ texto = '', categoriaId = '', precioMax = '', soloOfertas = false, orden = 'relevancia' } = {}) {
  const buscado = normalizarTexto(texto);
  let resultado = listarProductos().filter((p) => {
    if (buscado) {
      const contenido = normalizarTexto(`${p.nombre} ${p.descripcion} ${p.zonas} ${textoTamano(p)}`);
      if (!contenido.includes(buscado)) return false;
    }
    if (tieneValor(categoriaId) && p.categoriaId !== Number(categoriaId)) return false;
    if (tieneValor(precioMax) && precioFinal(p) > Number(precioMax)) return false;
    if (soloOfertas && !estaEnOferta(p)) return false;
    return true;
  });

  if (orden === 'precio-asc') resultado = [...resultado].sort((a, b) => precioFinal(a) - precioFinal(b));
  if (orden === 'precio-desc') resultado = [...resultado].sort((a, b) => precioFinal(b) - precioFinal(a));
  if (orden === 'nombre') resultado = [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return resultado;
}

