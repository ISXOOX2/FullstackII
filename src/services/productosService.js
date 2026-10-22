/**
 * Servicio de productos (diseños de tatuaje).
 * Usa el CRUD genérico de db.js y agrega las reglas propias del catálogo:
 * ofertas, stock crítico, búsqueda con filtros y descuento de cupos al pagar.
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

/** Regla de stock crítico: se alerta cuando el stock es IGUAL O INFERIOR al stock crítico. */
export function esStockCritico(producto) {
  return tieneValor(producto.stockCritico) && Number(producto.stock) <= Number(producto.stockCritico);
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
    stock: Number(datos.stock),
    stockCritico: aNumeroONulo(datos.stockCritico),
    tamano: String(datos.tamano || '').trim(),
    duracionHoras: aNumeroONulo(datos.duracionHoras),
    zonas: String(datos.zonas || '').trim(),
    nivelDolor: aNumeroONulo(datos.nivelDolor),
    colorTinta: String(datos.colorTinta || 'Negro').trim(),
    destacado: Boolean(datos.destacado),
    imagen: String(datos.imagen || 'neko-chibi').trim(),
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

function codigoRepetido(codigo, idActual = null) {
  return listarProductos().some(
    (p) => p.codigo.toUpperCase() === String(codigo).trim().toUpperCase() && p.id !== Number(idActual),
  );
}

/** Crea un producto. Devuelve { ok, producto } o { ok:false, error }. */
export function crearProducto(datos) {
  const producto = normalizarProducto(datos);
  if (codigoRepetido(producto.codigo)) return { ok: false, error: 'Ya existe un producto con ese código.' };
  const imagenes = [producto.imagen];
  return { ok: true, producto: crear(COLECCION, { ...producto, imagenes }) };
}

export function actualizarProducto(id, datos) {
  const producto = normalizarProducto(datos);
  if (codigoRepetido(producto.codigo, id)) return { ok: false, error: 'Ya existe otro producto con ese código.' };
  const existente = obtenerProducto(id);
  if (!existente) return { ok: false, error: 'El producto no existe.' };
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
      const contenido = normalizarTexto(`${p.nombre} ${p.descripcion} ${p.zonas} ${p.tamano}`);
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

/** Productos cuyo stock llegó al nivel crítico (o menos). */
export function productosCriticos() {
  return listarProductos().filter(esStockCritico);
}

/** Resta cupos al pagar una reserva. items: [{ productoId, cantidad }] */
export function descontarCupos(items) {
  items.forEach((item) => {
    const producto = obtenerProducto(item.productoId);
    if (producto) {
      actualizar(COLECCION, producto.id, { stock: Math.max(0, producto.stock - item.cantidad) });
    }
  });
}
