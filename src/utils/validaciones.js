/**
 * Validaciones de formularios (reglas de negocio de las Evaluaciones 1 y 2).
 *
 * Cada función validarXxx(valor) devuelve:
 *    ''        -> el valor es válido
 *    'mensaje' -> el texto del error que se muestra al usuario
 *
 * Las funciones validarFormulario... reciben el objeto completo del formulario y devuelven
 * un objeto { campo: 'mensaje' } solo con los campos que tienen error.
 * Son funciones "puras" (no tocan la pantalla), por eso son fáciles de probar con Vitest.
 */
import {
  DIAS_ATENCION, DIAS_MAXIMOS_AGENDA, EDAD_MINIMA, HORAS_CITA, LADOS_CUERPO, MAX_IMAGEN_BYTES, TAMANO_MAX_CM, TAMANO_MIN_CM,
  TIPOS_IMAGEN, ZONAS_CUERPO,
} from '../data/estudio.js';
import { fechaISO, sumarDias } from './formato.js';

// RFC 2822 (versión práctica): usuario@dominio.extension
const REGEX_CORREO =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

const REGEX_PASSWORD = /^[A-Za-z0-9!@#$%^&*_\-.]+$/;
const REGEX_TELEFONO = /^(\+?56)?9\d{8}$/;

// ---------------------------------------------------------------------------
// Validaciones por campo
// ---------------------------------------------------------------------------

/** Texto con largo máximo/mínimo y opción de ser obligatorio. */
export function validarTexto(valor, { etiqueta, obligatorio = true, max, min } = {}) {
  const texto = String(valor ?? '').trim();
  if (texto === '') return obligatorio ? `${etiqueta} es obligatorio.` : '';
  if (min !== undefined && texto.length < min) return `${etiqueta} debe tener al menos ${min} caracteres.`;
  if (max !== undefined && texto.length > max) return `${etiqueta} no puede superar los ${max} caracteres.`;
  return '';
}

/** Dígito verificador del RUN chileno (algoritmo módulo 11). */
export function calcularDigitoVerificador(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i), 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return '0';
  if (resto === 10) return 'K';
  return String(resto);
}

/** RUN sin puntos ni guion (ej: 12345678K), entre 7 y 9 caracteres y con dígito verificador. */
export function validarRun(run) {
  const valor = String(run ?? '').trim();
  if (valor === '') return 'El RUN es obligatorio.';
  if (!/^[0-9]+[0-9Kk]$/.test(valor)) return 'Escribe el RUN sin puntos ni guion (ej: 12345678K).';
  if (valor.length < 7 || valor.length > 9) return 'El RUN debe tener entre 7 y 9 caracteres.';
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1).toUpperCase();
  if (calcularDigitoVerificador(cuerpo) !== dv) return 'El RUN no es válido: el dígito verificador no coincide.';
  return '';
}

/** Correo: requerido, máximo 100 caracteres, formato RFC2822 y (opcional) dominios permitidos. */
export function validarCorreo(correo, { restringirDominios = false, obligatorio = true } = {}) {
  const valor = String(correo ?? '').trim();
  if (valor === '') return obligatorio ? 'El correo es obligatorio.' : '';
  if (valor.length > 100) return 'El correo no puede superar los 100 caracteres.';
  if (!REGEX_CORREO.test(valor)) return 'Ingresa un correo válido (ej: nombre@gmail.com).';
  if (restringirDominios) {
    const dominio = valor.split('@')[1].toLowerCase();
    if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
      return 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
  }
  return '';
}

/** Contraseña: 4 a 10 caracteres, alfanumérica (letras y números) con caracteres especiales permitidos. */
export function validarPassword(password) {
  const valor = String(password ?? '');
  if (valor === '') return 'La contraseña es obligatoria.';
  if (valor.length < 4 || valor.length > 10) return 'La contraseña debe tener entre 4 y 10 caracteres.';
  if (!REGEX_PASSWORD.test(valor)) {
    return 'Usa solo letras, números y caracteres especiales (! @ # $ % ^ & * _ - .).';
  }
  if (!/[A-Za-z]/.test(valor) || !/[0-9]/.test(valor)) {
    return 'La contraseña debe combinar letras y números (puede incluir caracteres especiales).';
  }
  return '';
}

/** Teléfono chileno móvil: 9XXXXXXXX, con o sin +56. */
export function validarTelefono(telefono, { obligatorio = false } = {}) {
  const valor = String(telefono ?? '').replace(/\s+/g, '');
  if (valor === '') return obligatorio ? 'El teléfono es obligatorio.' : '';
  if (!REGEX_TELEFONO.test(valor)) return 'Ingresa un celular válido (ej: +56 9 1234 5678).';
  return '';
}

/**
 * Fecha de nacimiento: OBLIGATORIA y solo mayores de EDAD_MINIMA (18) años.
 * Regla del estudio: no se tatúa a menores, por eso tampoco pueden tener cuenta.
 */
export function validarFechaNacimiento(valor, ahora = new Date()) {
  if (!valor) return 'La fecha de nacimiento es obligatoria.';
  const fecha = new Date(valor + 'T00:00:00');
  if (Number.isNaN(fecha.getTime())) return 'La fecha de nacimiento no es válida.';
  if (fecha > ahora) return 'La fecha de nacimiento no puede ser futura.';
  if (fecha.getFullYear() < 1900) return 'La fecha de nacimiento no es válida.';
  // Se suman 18 años a la fecha de nacimiento: si ese cumpleaños todavía no llega, es menor de edad.
  const cumpleMayoria = new Date(fecha);
  cumpleMayoria.setFullYear(cumpleMayoria.getFullYear() + EDAD_MINIMA);
  if (cumpleMayoria > ahora) return `Debes tener al menos ${EDAD_MINIMA} años para registrarte.`;
  return '';
}

/** Número con mínimo (y opcionalmente solo enteros). */
export function validarNumero(valor, { etiqueta, obligatorio = true, min = 0, max, entero = false } = {}) {
  const texto = String(valor ?? '').trim();
  if (texto === '') return obligatorio ? `${etiqueta} es obligatorio.` : '';
  const numero = Number(texto);
  if (Number.isNaN(numero)) return `${etiqueta} debe ser un número.`;
  if (entero && !Number.isInteger(numero)) return `${etiqueta} debe ser un número entero.`;
  if (numero < min) return `${etiqueta} no puede ser menor que ${min}.`;
  if (max !== undefined && numero > max) return `${etiqueta} no puede ser mayor que ${max}.`;
  return '';
}

/**
 * Medida de un tatuaje (ancho o alto). Regla del estudio: SIEMPRE en centímetros, entre
 * TAMANO_MIN_CM y TAMANO_MAX_CM. Así nadie puede ingresar metros ni texto como "grande".
 */
export function validarMedidaCm(valor, etiqueta) {
  const texto = String(valor ?? '').trim();
  if (texto === '') return `${etiqueta} es obligatorio.`;
  const numero = Number(texto);
  if (Number.isNaN(numero)) return `${etiqueta} debe ser un número en centímetros (ej: 7).`;
  if (numero < TAMANO_MIN_CM || numero > TAMANO_MAX_CM) {
    return `${etiqueta} debe estar entre ${TAMANO_MIN_CM} y ${TAMANO_MAX_CM} cm.`;
  }
  return '';
}

/** Fecha de la cita: desde mañana, martes a sábado y hasta DIAS_MAXIMOS_AGENDA días. */
export function validarFechaCita(valor, ahora = new Date()) {
  if (!valor) return 'Elige la fecha de tu cita.';
  const fecha = new Date(valor + 'T00:00:00');
  if (Number.isNaN(fecha.getTime())) return 'La fecha no es válida.';
  const hoy = fechaISO(ahora);
  if (valor <= hoy) return 'Elige una fecha desde mañana en adelante.';
  if (valor > sumarDias(hoy, DIAS_MAXIMOS_AGENDA)) {
    return `Solo se puede agendar hasta ${DIAS_MAXIMOS_AGENDA} días hacia adelante.`;
  }
  if (!DIAS_ATENCION.includes(fecha.getDay())) return 'El estudio atiende de martes a sábado.';
  return '';
}

// ---------------------------------------------------------------------------
// Validaciones de formularios completos
// ---------------------------------------------------------------------------

/** Elimina del objeto los campos sin error (''), dejando solo los que fallaron. */
function soloErrores(errores) {
  const resultado = {};
  Object.keys(errores).forEach((campo) => {
    if (errores[campo]) resultado[campo] = errores[campo];
  });
  return resultado;
}

export function hayErrores(errores) {
  return Object.keys(errores || {}).length > 0;
}

/** Inicio de sesión: correo y contraseña. */
export function validarFormularioLogin(datos) {
  return soloErrores({
    correo: validarCorreo(datos.correo),
    password: validarPassword(datos.password),
  });
}

/**
 * Registro / crear usuario / editar usuario / perfil.
 * opciones:
 *   confirmarCorreo  : pide repetir el correo (registro de la tienda)
 *   passwordRequerida: false al EDITAR (si se deja en blanco se conserva la actual)
 *   pedirTipo        : true en la vista del administrador
 */
export function validarFormularioUsuario(
  datos,
  { confirmarCorreo = false, passwordRequerida = true, pedirTipo = false } = {},
) {
  const errores = {
    run: validarRun(datos.run),
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 50 }),
    apellidos: validarTexto(datos.apellidos, { etiqueta: 'Los apellidos', max: 100 }),
    correo: validarCorreo(datos.correo, { restringirDominios: true }),
    telefono: validarTelefono(datos.telefono, { obligatorio: true }),
    fechaNacimiento: validarFechaNacimiento(datos.fechaNacimiento),
    region: datos.region ? '' : 'Debes seleccionar una región.',
    comuna: datos.comuna ? '' : 'Debes seleccionar una comuna.',
    direccion: validarTexto(datos.direccion, { etiqueta: 'La dirección', max: 300 }),
  };

  if (confirmarCorreo) {
    if (!datos.confirmarCorreo) errores.confirmarCorreo = 'Debes confirmar el correo.';
    else if (datos.confirmarCorreo.trim().toLowerCase() !== String(datos.correo).trim().toLowerCase()) {
      errores.confirmarCorreo = 'Los correos no coinciden.';
    }
  }

  const hayPassword = String(datos.password ?? '') !== '';
  if (passwordRequerida || hayPassword) {
    errores.password = validarPassword(datos.password);
    // La confirmación solo se pide en el registro de la tienda (en el admin viene undefined).
    if (!errores.password && datos.confirmarPassword !== undefined) {
      if (datos.confirmarPassword === '') errores.confirmarPassword = 'Debes confirmar la contraseña.';
      else if (datos.confirmarPassword !== datos.password) errores.confirmarPassword = 'Las contraseñas no coinciden.';
    }
  }

  if (pedirTipo && !['Administrador', 'Vendedor', 'Cliente'].includes(datos.tipo)) {
    errores.tipo = 'Selecciona el tipo de usuario.';
  }
  return soloErrores(errores);
}

/** Formulario de contacto: nombre, correo y comentario. */
export function validarFormularioContacto(datos) {
  return soloErrores({
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 100 }),
    correo: validarCorreo(datos.correo),
    comentario: validarTexto(datos.comentario, { etiqueta: 'El comentario', max: 500 }),
  });
}

/** Mantenedor de productos (diseños). */
export function validarFormularioProducto(datos) {
  const errores = {
    codigo: validarTexto(datos.codigo, { etiqueta: 'El código', min: 3 }),
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 100 }),
    descripcion: validarTexto(datos.descripcion, { etiqueta: 'La descripción', obligatorio: false, max: 500 }),
    precio: validarNumero(datos.precio, { etiqueta: 'El precio', min: 0 }),
    categoriaId: datos.categoriaId ? '' : 'Debes seleccionar una categoría.',
    anchoCm: validarMedidaCm(datos.anchoCm, 'El ancho'),
    altoCm: validarMedidaCm(datos.altoCm, 'El alto'),
    zonas: validarTexto(datos.zonas, { etiqueta: 'Las zonas', obligatorio: false, max: 100 }),
    duracionHoras: validarNumero(datos.duracionHoras, {
      etiqueta: 'La duración', obligatorio: false, min: 0.5,
    }),
    precioOferta: validarNumero(datos.precioOferta, {
      etiqueta: 'El precio de oferta', obligatorio: false, min: 0,
    }),
  };
  if (!errores.precioOferta && String(datos.precioOferta ?? '').trim() !== '' &&
      !errores.precio && Number(datos.precioOferta) >= Number(datos.precio)) {
    errores.precioOferta = 'El precio de oferta debe ser menor que el precio normal.';
  }
  return soloErrores(errores);
}

export function validarFormularioCategoria(datos) {
  return soloErrores({
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 50 }),
    descripcion: validarTexto(datos.descripcion, { etiqueta: 'La descripción', obligatorio: false, max: 200 }),
  });
}

/** Checkout: datos del cliente y datos de la cita. */
/** La zona tiene que ser una de la lista del estudio (se elige en un select, no se escribe). */
export function validarZona(valor) {
  if (!valor) return 'Elige la zona del cuerpo.';
  return ZONAS_CUERPO.includes(valor) ? '' : 'Elige una zona de la lista.';
}

/**
 * Datos del checkout. Si conCita es false (el carrito solo tiene artículos de la tienda),
 * no se piden tatuador, fecha, hora ni zona.
 */
export function validarFormularioCheckout(datos, ahora = new Date(), { conCita = true } = {}) {
  const errores = {
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 50 }),
    apellidos: validarTexto(datos.apellidos, { etiqueta: 'Los apellidos', max: 100 }),
    correo: validarCorreo(datos.correo),
    telefono: validarTelefono(datos.telefono, { obligatorio: true }),
  };
  if (conCita) {
    Object.assign(errores, {
      fecha: validarFechaCita(datos.fecha, ahora),
      hora: HORAS_CITA.includes(datos.hora) ? '' : 'Elige un horario disponible.',
      tatuadorId: datos.tatuadorId ? '' : 'Elige con quién quieres tatuarte.',
      zonaCuerpo: validarZona(datos.zonaCuerpo),
      ladoCuerpo: datos.ladoCuerpo && !LADOS_CUERPO.includes(datos.ladoCuerpo) ? 'Elige un lado de la lista.' : '',
      indicaciones: validarTexto(datos.indicaciones, { etiqueta: 'Las indicaciones', obligatorio: false, max: 300 }),
    });
  }
  return soloErrores(errores);
}

/** Tamaño que pide el cliente en el detalle del diseño: ancho y alto en centímetros. */
export function validarTamanoPersonalizado(datos) {
  return soloErrores({
    anchoCm: validarMedidaCm(datos.anchoCm, 'El ancho'),
    altoCm: validarMedidaCm(datos.altoCm, 'El alto'),
  });
}

/**
 * Formulario de solicitud sobre una reserva pagada: reembolso o cambio de fecha y hora.
 *  - motivo: obligatorio (se elige de una lista).
 *  - justificativo: obligatorio, entre 10 y 300 caracteres (explica la razón).
 *  - Si es un cambio: la nueva fecha sigue las reglas de la agenda y la hora es obligatoria.
 * Que la hora esté libre y el plazo de anticipación los revisa ordenesService (necesitan la agenda).
 */
/** Cambio manual del estado de una orden (panel): nuevo estado y motivo obligatorios. */
export function validarCambioEstado(datos) {
  return soloErrores({
    estado: datos.estado ? '' : 'Elige el nuevo estado.',
    motivo: validarTexto(datos.motivo, { etiqueta: 'El motivo', min: 10, max: 300 }),
  });
}

export function validarFormularioSolicitud(datos, ahora = new Date()) {
  const errores = {
    motivo: datos.motivo ? '' : 'Elige el motivo de tu solicitud.',
    justificativo: validarTexto(datos.justificativo, { etiqueta: 'El justificativo', min: 10, max: 300 }),
  };
  if (datos.tipo === 'cambio') {
    errores.fecha = validarFechaCita(datos.fecha, ahora);
    errores.hora = datos.hora ? '' : 'Elige la nueva hora.';
  }
  return soloErrores(errores);
}

/** Insumo del estudio (tinta, agujas, guantes…). El stock crítico es el nivel que dispara la alerta. */
export function validarFormularioInsumo(datos) {
  return soloErrores({
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 100 }),
    tipo: datos.tipo ? '' : 'Elige el tipo de insumo.',
    unidad: validarTexto(datos.unidad, { etiqueta: 'La unidad', max: 30 }),
    stock: validarNumero(datos.stock, { etiqueta: 'El stock', min: 0, entero: true }),
    stockCritico: validarNumero(datos.stockCritico, { etiqueta: 'El stock crítico', min: 0, entero: true }),
    // Si se vende en la Tienda, el precio y la descripción son obligatorios.
    precio: datos.aLaVenta ? validarNumero(datos.precio, { etiqueta: 'El precio', min: 1000, entero: true }) : '',
    descripcion: datos.aLaVenta ? validarTexto(datos.descripcion, { etiqueta: 'La descripción', max: 200 }) : '',
    imagen: datos.aLaVenta && !datos.imagen ? 'Elige una imagen para la Tienda.' : '',
  });
}

// ---------------------------------------------------------------------------
// Imágenes que suben los clientes, reseñas y "Mi proyecto"
// ---------------------------------------------------------------------------

/** Revisa un archivo de imagen ANTES de leerlo: tipo (JPG, PNG o WEBP) y peso (máx. 1 MB). */
export function validarArchivoImagen(archivo) {
  if (!archivo) return '';
  if (!TIPOS_IMAGEN.includes(archivo.type)) return 'La imagen debe ser JPG, PNG o WEBP.';
  if (archivo.size > MAX_IMAGEN_BYTES) return 'La imagen no puede pesar más de 1 MB.';
  return '';
}

/** Reseña: estrellas de 1 (la peor) a 5 (la mejor) y un comentario de 10 a 400 caracteres. */
export function validarFormularioResena(datos) {
  const estrellas = Number(datos.estrellas);
  const comentario = String(datos.comentario ?? '').trim();
  return soloErrores({
    estrellas: Number.isInteger(estrellas) && estrellas >= 1 && estrellas <= 5 ? '' : 'Elige de 1 a 5 estrellas.',
    comentario: !comentario
      ? 'Cuéntanos cómo te fue.'
      : comentario.length < 10
        ? 'El comentario debe tener al menos 10 caracteres.'
        : comentario.length > 400 ? 'El comentario no puede superar los 400 caracteres.' : '',
  });
}

/** Mi proyecto: nombre, correo, zona (de la lista) y la idea (20 a 600 caracteres). */
export function validarFormularioProyecto(datos) {
  const idea = String(datos.idea ?? '').trim();
  return soloErrores({
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 80 }),
    correo: validarCorreo(datos.correo),
    zonaCuerpo: validarZona(datos.zonaCuerpo),
    lado: datos.lado && !LADOS_CUERPO.includes(datos.lado) ? 'Elige un lado de la lista.' : '',
    idea: !idea
      ? 'Describe tu idea.'
      : idea.length < 20
        ? 'Cuéntanos un poco más (mínimo 20 caracteres).'
        : idea.length > 600 ? 'La idea no puede superar los 600 caracteres.' : '',
  });
}
