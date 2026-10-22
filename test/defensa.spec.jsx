// ════════════════════════════════════════════════════════════════════════════
// LAS 10 PRUEBAS DE LA DEFENSA
//
// Siguen la "Propuesta de pruebas con Jasmine" del Anexo 1 de la Evaluación 2:
//   renderizado correcto · renderizado condicional · props · estado · eventos
// y los conceptos de las guías 2.3.2 y 2.3.5: hooks personalizados (renderHook), mocks con
// jasmine.createSpy / jasmine.createSpyObj, lógica de validación y rutas protegidas.
// Las comprobaciones usan toBe, toBeTruthy, not y toContain, como en la clase React IV.
//
// Todas usan el patrón AAA:  Arrange (preparar) · Act (actuar) · Assert (verificar).
// ════════════════════════════════════════════════════════════════════════════
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import Boton from '../src/components/atomos/Boton.jsx';
import CampoFormulario from '../src/components/moleculas/CampoFormulario.jsx';
import Galeria from '../src/components/moleculas/Galeria.jsx';
import ListaProductos from '../src/components/organismos/ListaProductos.jsx';
import FormularioContacto from '../src/components/organismos/FormularioContacto.jsx';
import FormularioLogin from '../src/components/organismos/FormularioLogin.jsx';
import RutaProtegida from '../src/components/utilidades/RutaProtegida.jsx';
import useFormulario from '../src/utils/useFormulario.js';
import images from '../src/assets/images.js';
import { validarFormularioLogin, validarRun } from '../src/utils/validaciones.js';
import { listarProductos, obtenerProducto } from '../src/services/productosService.js';
import { pagosService } from '../src/services/pagosService.js';
import { CLAVE_CARRITO, agregarItem, leerCarrito } from '../src/services/carritoService.js';
import { listarOrdenes } from '../src/services/ordenesService.js';
import { productoDePrueba, proximoMiercoles, reiniciarTodo, renderApp, renderConRouter } from './ayudas.jsx';

describe('Las 10 pruebas de la defensa', () => {
  // Antes de CADA prueba se reinician los datos, así ninguna depende de otra.
  // También se guarda la pasarela de pago real para devolverla después del mock (prueba 8).
  let procesarReal;
  beforeEach(() => {
    reiniciarTodo();
    procesarReal = pagosService.procesar;
  });
  afterEach(() => {
    pagosService.procesar = procesarReal;
  });

  // ─── 1 · RENDERIZADO CORRECTO ───────────────────────────────────────────────
  // Tarea del Anexo 1: "los componentes de lista rendericen todos los elementos".
  it('1. ListaProductos dibuja una tarjeta por cada diseño del catálogo', () => {
    // Arrange: los 12 diseños de la base de datos simulada
    const productos = listarProductos();

    // Act
    renderConRouter(<ListaProductos productos={productos} onAgregar={() => {}} />);

    // Assert: hay tantas tarjetas como diseños, y cada nombre está en pantalla
    expect(screen.getAllByRole('button', { name: 'Añadir a mi reserva' }).length).toBe(productos.length);
    productos.forEach((p) => {
      expect(screen.getAllByRole('link', { name: p.nombre }).length).toBeGreaterThan(0);
    });
  });

  // ─── 2 · RENDERIZADO CONDICIONAL ────────────────────────────────────────────
  // Tarea del Anexo 1: "un mensaje de error solo se muestre cuando hay un error".
  it('2. CampoFormulario muestra el mensaje de error solo cuando recibe un error', () => {
    // Caso 1: sin la prop "error" no hay mensaje
    const sinError = render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} />);
    expect(screen.queryByText('El nombre es obligatorio')).toBeNull();
    sinError.unmount();

    // Caso 2: el padre le pasa un error por props
    render(<CampoFormulario id="nombre" etiqueta="Nombre" value="" onChange={() => {}} error="El nombre es obligatorio" />);

    // Assert: el mensaje aparece y el campo queda marcado como inválido (clase de Bootstrap)
    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy();
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBe(true);
  });

  // ─── 3 · PROPIEDADES (PROPS) ────────────────────────────────────────────────
  // Tarea del Anexo 1: "un componente de botón recibe la etiqueta y la función onClick".
  it('3. El átomo Boton muestra la etiqueta recibida y llama a onClick al hacer clic', () => {
    // Arrange: un espía (spy) registra cada vez que se llama a la función
    const alHacerClic = jasmine.createSpy('alHacerClic');
    render(<Boton etiqueta="Agendar cita" onClick={alHacerClic} />);
    const boton = screen.getByText('Agendar cita');
    expect(boton).toBeTruthy(); // la prop "etiqueta" llegó

    // Act
    fireEvent.click(boton);

    // Assert: la prop "onClick" se ejecutó una vez
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  // ─── 4 · ESTADO (STATE) ─────────────────────────────────────────────────────
  // Tarea del Anexo 1: "el estado de un formulario cambia cuando el usuario introduce texto".
  it('4. FormularioContacto actualiza su estado (valor y contador) cuando el usuario escribe', () => {
    // Arrange
    render(<FormularioContacto onEnviar={() => {}} />);
    const comentario = screen.getByLabelText('Comentario');
    expect(screen.getByText('0/500 caracteres')).toBeTruthy();

    // Act: el usuario escribe en el textarea
    fireEvent.change(comentario, { target: { name: 'comentario', value: 'Hola Forever Ink' } });

    // Assert: el input controlado muestra el nuevo valor y el contador se recalculó
    expect(comentario.value).toBe('Hola Forever Ink');
    expect(screen.getByText('16/500 caracteres')).toBeTruthy();
  });

  // ─── 5 · EVENTOS ────────────────────────────────────────────────────────────
  // Tarea del Anexo 1: "simula un clic en un botón y comprueba que el estado cambie".
  it('5. Galeria cambia la imagen principal al hacer clic en una miniatura', () => {
    // Arrange: estado inicial = primera imagen
    render(<Galeria imagenes={['neko-chibi', 'neko-chibi-cuerpo']} nombre="Neko chibi" />);
    expect(screen.getByAltText(/vista 1 de 2/).getAttribute('src')).toBe(images['neko-chibi']);

    // Act: clic en la segunda miniatura
    fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 2' }));

    // Assert: el estado cambió y React volvió a dibujar la imagen grande
    expect(screen.getByAltText(/vista 2 de 2/).getAttribute('src')).toBe(images['neko-chibi-cuerpo']);
  });

  // ─── 6 · HOOK PERSONALIZADO (renderHook + act, guía 2.3.2 paso 11) ──────────
  it('6. useFormulario valida en tiempo real y no deja enviar un formulario con errores', () => {
    // Arrange: el hook se prueba solo, sin dibujar ningún formulario
    const { result } = renderHook(() => useFormulario({ correo: '', password: '' }, validarFormularioLogin));
    expect(result.current.visibles.correo).toBeUndefined(); // aún no toca el campo

    // Act 1: escribe un correo inválido
    act(() => result.current.cambiar('correo', 'sin-arroba'));
    // Assert 1: el error aparece en "visibles"
    expect(result.current.visibles.correo).toContain('correo válido');

    // Act 2: corrige el correo e intenta enviar sin contraseña
    act(() => result.current.cambiar('correo', 'ana@gmail.com'));
    let sePuedeEnviar;
    act(() => { sePuedeEnviar = result.current.intentarEnviar(); });

    // Assert 2: el correo ya no tiene error, pero falta la contraseña
    expect(result.current.visibles.correo).toBeUndefined();
    expect(result.current.visibles.password).toBeTruthy();
    expect(sePuedeEnviar).toBe(false);
  });

  // ─── 7 · MOCK CON jasmine.createSpyObj (guía 2.3.2 paso 8) ──────────────────
  it('7. FormularioLogin envía los datos al servicio (mock) y muestra el error que este responde', () => {
    // Arrange: un servicio "de mentira" que responde que la contraseña es incorrecta
    const servicioSesion = jasmine.createSpyObj('ServicioSesion', ['iniciar']);
    servicioSesion.iniciar.and.returnValue('Correo o contraseña incorrectos.');
    render(<FormularioLogin onEnviar={servicioSesion.iniciar} />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'correo', value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'Clave#12' } });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    // Assert: se llamó al servicio con lo que escribió el usuario y se muestra su respuesta
    expect(servicioSesion.iniciar).toHaveBeenCalledWith({ correo: 'ana@gmail.com', password: 'Clave#12' });
    expect(screen.getByRole('alert').textContent).toContain('Correo o contraseña incorrectos.');
  });

  // ─── 8 · MOCK de la pasarela de pago (jasmine.createSpy, guía 2.3.5) ────────
  // Se reemplaza la pasarela por una respuesta controlada para probar el caso "rechazado"
  // sin esperar ni depender de un servicio externo.
  it('8. Checkout con pago RECHAZADO: la orden queda rechazada, el stock no cambia y el carrito se conserva', async () => {
    // Arrange: el mock responde "rechazado" y el carrito tiene 1 diseño (stock inicial 8)
    pagosService.procesar = jasmine.createSpy('procesar')
      .and.returnValue(Promise.resolve({ aprobado: false, motivo: 'Rechazada' }));
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(agregarItem([], productoDePrueba(1)).items));
    renderApp('/checkout');
    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
    escribir('Nombre', 'Ana');
    escribir('Apellidos', 'Pérez');
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Teléfono', '+56912345678');
    escribir('Tatuador/a', '1');
    escribir('Fecha', proximoMiercoles());
    escribir('Horario', '14:00');
    escribir('Zona del cuerpo', 'Antebrazo');
    escribir('Resultado de la pasarela de pago', 'rechazado');

    // Act: el cliente presiona "Pagar ahora"
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    // Assert: mensaje de error, orden rechazada, stock intacto y carrito conservado
    await waitFor(() => expect(screen.getByText(/No pudimos procesar tu pago/)).toBeTruthy());
    expect(pagosService.procesar).toHaveBeenCalledTimes(1);
    expect(listarOrdenes()[0].estado).toBe('Pago rechazado');
    expect(obtenerProducto(1).stock).toBe(8);
    expect(leerCarrito().length).toBe(1);
  });

  // ─── 9 · LÓGICA: validación del RUN (válido, inválido y entradas fuera del negocio) ──
  it('9. validarRun acepta un RUN correcto y rechaza dígito verificador, largo y vacío', () => {
    // Como en React IV: no basta con probar el caso correcto, también los datos inválidos.
    expect(validarRun('190110222')).toBe('');                        // válido
    expect(validarRun('190110221')).toContain('dígito verificador');  // dígito incorrecto
    expect(validarRun('12345')).not.toBe('');                         // muy corto (mín. 7)
    expect(validarRun('')).not.toBe('');                              // requerido
  });

  // ─── 10 · RUTAS PROTEGIDAS (MemoryRouter, React IV) ─────────────────────────
  it('10. RutaProtegida manda al login sin sesión y al inicio si el rol no tiene permiso', () => {
    // La ruta /admin solo deja entrar a un Administrador. "usuario" llega por props.
    const rutas = (usuario) => (
      <Routes>
        <Route path="/" element={<p>Inicio de la tienda</p>} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/admin" element={<RutaProtegida usuario={usuario} roles={['Administrador']}><p>Zona privada</p></RutaProtegida>} />
      </Routes>
    );

    // Caso 1 · sin sesión (usuario = null) -> login
    const primero = renderConRouter(rutas(null), { ruta: '/admin' });
    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.queryByText('Zona privada')).toBeNull();
    primero.unmount();

    // Caso 2 · con sesión de Cliente -> inicio (no tiene permiso)
    renderConRouter(rutas({ nombre: 'Ana', tipo: 'Cliente' }), { ruta: '/admin' });
    expect(screen.getByText('Inicio de la tienda')).toBeTruthy();
    expect(screen.queryByText('Zona privada')).toBeNull();
  });
});
