/**
 * Validaciones de formularios (reglas de negocio de las Evaluaciones 1 y 2).
 *
 * Cada función validarXxx(valor) devuelve:
 *    ''        -> el valor es válido
 *    'mensaje' -> el texto del error que se muestra al usuario
 *
 * Las funciones validarFormulario... reciben el objeto completo del formulario y devuelven
 * un objeto { campo: 'mensaje' } solo con los campos que tienen error.
 * Son funciones "puras" (no tocan la pantalla), por eso son fáciles de probar con Jasmine.
 */
import { DIAS_ATENCION, DIAS_MAXIMOS_AGENDA, HORAS_CITA } from '../data/estudio.js';
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

/** Fecha de nacimiento: opcional, no puede ser futura. */
export function validarFechaNacimiento(valor, ahora = new Date()) {
  if (!valor) return '';
  const fecha = new Date(valor + 'T00:00:00');
  if (Number.isNaN(fecha.getTime())) return 'La fecha de nacimiento no es válida.';
  if (fecha > ahora) return 'La fecha de nacimiento no puede ser futura.';
  if (fecha.getFullYear() < 1900) return 'La fecha de nacimiento no es válida.';
  return '';
}

/** Número con mínimo (y opcionalmente solo enteros). */
export function validarNumero(valor, { etiqueta, obligatorio = true, min = 0, entero = false } = {}) {
  const texto = String(valor ?? '').trim();
  if (texto === '') return obligatorio ? `${etiqueta} es obligatorio.` : '';
  const numero = Number(texto);
  if (Number.isNaN(numero)) return `${etiqueta} debe ser un número.`;
  if (entero && !Number.isInteger(numero)) return `${etiqueta} debe ser un número entero.`;
  if (numero < min) return `${etiqueta} no puede ser menor que ${min}.`;
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
    telefono: validarTelefono(datos.telefono),
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
    stock: validarNumero(datos.stock, { etiqueta: 'El stock', min: 0, entero: true }),
    stockCritico: validarNumero(datos.stockCritico, {
      etiqueta: 'El stock crítico', obligatorio: false, min: 0, entero: true,
    }),
    categoriaId: datos.categoriaId ? '' : 'Debes seleccionar una categoría.',
    tamano: validarTexto(datos.tamano, { etiqueta: 'El tamaño', obligatorio: false, max: 30 }),
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
export function validarFormularioCheckout(datos, ahora = new Date()) {
  return soloErrores({
    nombre: validarTexto(datos.nombre, { etiqueta: 'El nombre', max: 50 }),
    apellidos: validarTexto(datos.apellidos, { etiqueta: 'Los apellidos', max: 100 }),
    correo: validarCorreo(datos.correo),
    telefono: validarTelefono(datos.telefono, { obligatorio: true }),
    fecha: validarFechaCita(datos.fecha, ahora),
    hora: HORAS_CITA.includes(datos.hora) ? '' : 'Elige un horario disponible.',
    tatuadorId: datos.tatuadorId ? '' : 'Elige con quién quieres tatuarte.',
    zonaCuerpo: validarTexto(datos.zonaCuerpo, { etiqueta: 'La zona del cuerpo', max: 60 }),
    indicaciones: validarTexto(datos.indicaciones, { etiqueta: 'Las indicaciones', obligatorio: false, max: 300 }),
  });
}
