import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import TarjetaProducto from '../src/components/tienda/TarjetaProducto.jsx';
import ListaProductos from '../src/components/tienda/ListaProductos.jsx';
import FiltrosProductos from '../src/components/tienda/FiltrosProductos.jsx';
import FormularioLogin from '../src/components/tienda/FormularioLogin.jsx';
import FormularioContacto from '../src/components/tienda/FormularioContacto.jsx';
import FormularioUsuario from '../src/components/tienda/FormularioUsuario.jsx';
import TablaCarrito from '../src/components/tienda/TablaCarrito.jsx';
import Galeria from '../src/components/tienda/Galeria.jsx';
import BarraNavegacion from '../src/components/tienda/BarraNavegacion.jsx';
import AlertaStockCritico from '../src/components/admin/AlertaStockCritico.jsx';
import CampoFormulario from '../src/components/comunes/CampoFormulario.jsx';
import MensajeVacio from '../src/components/comunes/MensajeVacio.jsx';
import InsigniaEstado from '../src/components/comunes/InsigniaEstado.jsx';
import RutaProtegida from '../src/components/comunes/RutaProtegida.jsx';
import useFormulario from '../src/hooks/useFormulario.js';
import { CLAVE_CARRITO, agregarItem } from '../src/services/carritoService.js';
import { listarProductos, productosCriticos } from '../src/services/productosService.js';
import { listarCategorias } from '../src/services/categoriasService.js';
import { validarFormularioLogin } from '../src/utils/validaciones.js';
import { ADMIN, CLIENTE, conectarComo, productoDePrueba, reiniciarTodo, renderConApp } from './ayudas.jsx';

describe('Componentes de presentación: renderizado y props', () => {
  beforeEach(reiniciarTodo);

  it('TarjetaProducto muestra nombre, precio y la insignia de oferta (props)', () => {
    renderConApp(<TarjetaProducto producto={productoDePrueba(2)} nombreCategoria="Fineline" onAgregar={() => {}} />);
    expect(screen.getByText('Ola minimalista')).toBeTruthy();
    expect(screen.getByText('$38.000')).toBeTruthy();
    expect(screen.getByText('$45.000')).toBeTruthy(); // precio tachado
    expect(screen.getByText('Oferta')).toBeTruthy();
    expect(screen.getByText('Fineline')).toBeTruthy();
  });

  it('TarjetaProducto no muestra insignia de oferta si el diseño no está en oferta (render condicional)', () => {
    renderConApp(<TarjetaProducto producto={productoDePrueba(1)} onAgregar={() => {}} />);
    expect(screen.queryByText('Oferta')).toBeNull();
  });

  it('TarjetaProducto: al hacer clic llama a onAgregar con el producto (evento + spy)', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    const producto = productoDePrueba(1);
    renderConApp(<TarjetaProducto producto={producto} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Añadir a mi reserva' }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });

  it('TarjetaProducto deshabilita el botón y avisa cuando no hay cupos (render condicional)', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderConApp(<TarjetaProducto producto={{ ...productoDePrueba(1), stock: 0 }} onAgregar={onAgregar} />);
    const boton = screen.getByRole('button', { name: 'Añadir a mi reserva' });
    expect(boton.disabled).toBeTrue();
    expect(screen.getByText('Sin cupos disponibles')).toBeTruthy();
    fireEvent.click(boton);
    expect(onAgregar).not.toHaveBeenCalled();
  });

  it('TarjetaProducto avisa "últimos cupos" cuando el stock es crítico', () => {
    renderConApp(<TarjetaProducto producto={productoDePrueba(11)} onAgregar={() => {}} />);
    expect(screen.getByText(/Últimos 1 cupos/)).toBeTruthy();
  });

  it('ListaProductos renderiza una tarjeta por cada producto recibido', () => {
    const productos = listarProductos();
    renderConApp(<ListaProductos productos={productos} onAgregar={() => {}} />);
    expect(screen.getAllByRole('button', { name: 'Añadir a mi reserva' }).length).toBe(productos.length);
  });

  it('ListaProductos muestra un mensaje cuando la lista viene vacía (render condicional)', () => {
    renderConApp(<ListaProductos productos={[]} onAgregar={() => {}} vacioTitulo="Sin diseños" />);
    expect(screen.getByText('Sin diseños')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Añadir a mi reserva' })).toBeNull();
  });

  it('MensajeVacio muestra el texto solo si se entrega (render condicional)', () => {
    const { rerender } = render(<MensajeVacio titulo="Nada aquí" />);
    expect(screen.queryByText('Explicación')).toBeNull();
    rerender(<MensajeVacio titulo="Nada aquí" texto="Explicación" />);
    expect(screen.getByText('Explicación')).toBeTruthy();
  });

  it('CampoFormulario muestra el mensaje de error solo cuando hay error', () => {
    const { rerender } = render(<CampoFormulario id="x" etiqueta="Nombre" error="" />);
    expect(screen.queryByText('Campo inválido')).toBeNull();
    rerender(<CampoFormulario id="x" etiqueta="Nombre" error="Campo inválido" />);
    expect(screen.getByText('Campo inválido')).toBeTruthy();
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBeTrue();
  });

  it('InsigniaEstado muestra el estado recibido', () => {
    render(<InsigniaEstado estado="Pago rechazado" />);
    expect(screen.getByText('Pago rechazado').classList.contains('bg-danger')).toBeTrue();
  });

  it('AlertaStockCritico lista los diseños críticos y no muestra nada si no hay', () => {
    const { container, rerender } = renderConApp(<AlertaStockCritico productos={productosCriticos()} />);
    expect(screen.getByText(/Stock crítico: 2 diseño/)).toBeTruthy();
    expect(screen.getByText(/Ancla fina/)).toBeTruthy();
    rerender(
      <MemoryRouter><AlertaStockCritico productos={[]} /></MemoryRouter>,
    );
    expect(container.querySelector('.alerta-critico')).toBeNull();
  });
});

describe('Componentes con estado y eventos', () => {
  beforeEach(reiniciarTodo);

  it('Galeria cambia la imagen principal al hacer clic en una miniatura (useState)', () => {
    render(<Galeria imagenes={['img/a.svg', 'img/b.svg']} nombre="Diseño" />);
    expect(screen.getByAltText(/vista 1 de 2/).getAttribute('src')).toBe('img/a.svg');
    fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 2' }));
    expect(screen.getByAltText(/vista 2 de 2/).getAttribute('src')).toBe('img/b.svg');
  });

  it('FiltrosProductos avisa cada cambio con onCambiar(campo, valor)', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    const filtros = { texto: '', categoriaId: '', precioMax: '', soloOfertas: false, orden: 'relevancia' };
    render(<FiltrosProductos filtros={filtros} categorias={listarCategorias()} onCambiar={onCambiar} onLimpiar={() => {}} />);
    fireEvent.change(screen.getByLabelText('Estilo'), { target: { value: '2' } });
    expect(onCambiar).toHaveBeenCalledWith('categoriaId', '2');
    fireEvent.click(screen.getByLabelText('Solo ofertas'));
    expect(onCambiar).toHaveBeenCalledWith('soloOfertas', true);
  });

  it('FiltrosProductos avisa el texto, el precio máximo, el orden y el botón Limpiar', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    const onLimpiar = jasmine.createSpy('onLimpiar');
    const filtros = { texto: '', categoriaId: '', precioMax: '', soloOfertas: false, orden: 'relevancia' };
    render(<FiltrosProductos filtros={filtros} categorias={listarCategorias()} onCambiar={onCambiar} onLimpiar={onLimpiar} />);
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'luna' } });
    fireEvent.change(screen.getByLabelText('Precio máximo'), { target: { value: '70000' } });
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'nombre' } });
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(onCambiar.calls.allArgs()).toEqual([['texto', 'luna'], ['precioMax', '70000'], ['orden', 'nombre']]);
    expect(onLimpiar).toHaveBeenCalledTimes(1);
  });

  it('TablaCarrito llama a onCambiarCantidad y onQuitar según el botón presionado', () => {
    const items = agregarItem([], productoDePrueba(1)).items;
    const onCambiarCantidad = jasmine.createSpy('onCambiarCantidad');
    const onQuitar = jasmine.createSpy('onQuitar');
    render(<TablaCarrito items={items} onCambiarCantidad={onCambiarCantidad} onQuitar={onQuitar} />);
    fireEvent.click(screen.getByRole('button', { name: /Agregar una unidad/ }));
    expect(onCambiarCantidad).toHaveBeenCalledWith(1, 2);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onQuitar).toHaveBeenCalledWith(1);
  });

  it('TablaCarrito deshabilita "−" en cantidad 1 y "+" al llegar al límite', () => {
    const base = agregarItem([], { ...productoDePrueba(1), stock: 2 }).items;
    const { rerender } = render(<TablaCarrito items={base} onCambiarCantidad={() => {}} onQuitar={() => {}} />);
    expect(screen.getByRole('button', { name: /Quitar una unidad/ }).disabled).toBeTrue();
    rerender(<TablaCarrito items={[{ ...base[0], cantidad: 2 }]} onCambiarCantidad={() => {}} onQuitar={() => {}} />);
    expect(screen.getByRole('button', { name: /Agregar una unidad/ }).disabled).toBeTrue();
  });

  it('FormularioLogin muestra los errores en tiempo real al escribir y salir del campo', () => {
    render(<FormularioLogin onEnviar={() => ''} />);
    expect(screen.queryByText(/correo válido/)).toBeNull(); // todavía no tocó nada
    const correo = screen.getByLabelText('Correo electrónico');
    fireEvent.change(correo, { target: { name: 'correo', value: 'sin-arroba' } });
    expect(screen.getByText(/Ingresa un correo válido/)).toBeTruthy();
    fireEvent.change(correo, { target: { name: 'correo', value: 'ana@gmail.com' } });
    expect(screen.queryByText(/Ingresa un correo válido/)).toBeNull();
  });

  it('FormularioLogin no envía si hay errores y llama a onEnviar si todo es válido', () => {
    const onEnviar = jasmine.createSpy('onEnviar').and.returnValue('');
    render(<FormularioLogin onEnviar={onEnviar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(onEnviar).not.toHaveBeenCalled();
    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'correo', value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'Abc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(onEnviar).toHaveBeenCalledWith({ correo: 'ana@gmail.com', password: 'Abc123' });
  });

  it('FormularioLogin muestra el error general que devuelve onEnviar', () => {
    render(<FormularioLogin onEnviar={() => 'Correo o contraseña incorrectos.'} />);
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'correo', value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { name: 'password', value: 'Abc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByRole('alert').textContent).toContain('incorrectos');
  });

  it('FormularioContacto valida el comentario (máx. 500) y envía los datos válidos', () => {
    const onEnviar = jasmine.createSpy('onEnviar');
    render(<FormularioContacto onEnviar={onEnviar} />);
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { name: 'nombre', value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { name: 'correo', value: 'ana@gmail.com' } });
    fireEvent.change(screen.getByLabelText('Comentario'), { target: { name: 'comentario', value: 'x'.repeat(501) } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(onEnviar).not.toHaveBeenCalled();
    expect(screen.getByText(/no puede superar los 500/)).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Comentario'), { target: { name: 'comentario', value: 'Hola, quiero una cita' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(onEnviar).toHaveBeenCalledTimes(1);
  });

  it('FormularioUsuario actualiza la lista de comunas al elegir una región (estado)', () => {
    render(<FormularioUsuario modo="registro" onEnviar={() => ''} />);
    const comuna = screen.getByLabelText('Comuna');
    expect(comuna.disabled).toBeTrue();
    fireEvent.change(screen.getByLabelText('Región'), { target: { name: 'region', value: 'Valparaíso' } });
    expect(screen.getByLabelText('Comuna').disabled).toBeFalse();
    expect(within(screen.getByLabelText('Comuna')).getByText('Viña del Mar')).toBeTruthy();
  });

  it('FormularioUsuario en modo "registro" pide confirmar correo y contraseña; en "admin-nuevo" pide el tipo', () => {
    const { unmount } = render(<FormularioUsuario modo="registro" onEnviar={() => ''} />);
    expect(screen.getByLabelText('Confirmar correo')).toBeTruthy();
    expect(screen.queryByLabelText('Tipo de usuario')).toBeNull();
    unmount();
    render(<FormularioUsuario modo="admin-nuevo" onEnviar={() => ''} />);
    expect(screen.getByLabelText('Tipo de usuario')).toBeTruthy();
    expect(screen.queryByLabelText('Confirmar correo')).toBeNull();
  });
});

describe('Hook useFormulario', () => {
  it('guarda valores, muestra errores solo en campos tocados y valida al intentar enviar', () => {
    const { result } = renderHook(() => useFormulario({ correo: '', password: '' }, validarFormularioLogin));
    expect(result.current.visibles).toEqual({}); // sin tocar nada no hay errores visibles

    act(() => result.current.cambiar('correo', 'malo'));
    expect(result.current.valores.correo).toBe('malo');
    expect(Object.keys(result.current.visibles)).toEqual(['correo']);

    let valido;
    act(() => { valido = result.current.intentarEnviar(); });
    expect(valido).toBeFalse();
    expect(Object.keys(result.current.visibles)).toEqual(['correo', 'password']);

    act(() => result.current.reiniciar());
    expect(result.current.valores.correo).toBe('');
    expect(result.current.visibles).toEqual({});
  });
});

describe('Contextos y rutas protegidas', () => {
  beforeEach(reiniciarTodo);

  it('BarraNavegacion muestra los botones de sesión cuando no hay usuario conectado', () => {
    renderConApp(<BarraNavegacion />);
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
    expect(screen.getByText('Registrarse')).toBeTruthy();
  });

  it('BarraNavegacion saluda al usuario conectado y ofrece el panel solo al personal (contexto de sesión)', () => {
    conectarComo(...ADMIN);
    renderConApp(<BarraNavegacion />);
    expect(screen.getByTestId('saludo').textContent).toBe('Hola, Administrador');
    expect(screen.queryByText('Iniciar sesión')).toBeNull();
  });

  it('BarraNavegacion muestra el total del carrito guardado (contexto de carrito)', () => {
    const items = agregarItem([], productoDePrueba(1), 2).items; // 2 x $65.000
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    renderConApp(<BarraNavegacion />);
    expect(screen.getByTestId('total-carrito').textContent).toBe('$130.000');
  });

  it('BarraNavegacion: al buscar navega al catálogo con el texto en la URL (?q=)', () => {
    const Ubicacion = () => <p data-testid="ubicacion">{useLocation().pathname + useLocation().search}</p>;
    renderConApp(<><BarraNavegacion /><Ubicacion /></>);
    fireEvent.change(screen.getByLabelText('Buscar diseños'), { target: { value: 'luna llena' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByTestId('ubicacion').textContent).toBe('/productos?q=luna%20llena');
  });

  it('BarraNavegacion: "Cerrar sesión" borra la sesión y vuelve a mostrar los botones de ingreso', () => {
    conectarComo(...CLIENTE);
    renderConApp(<BarraNavegacion />);
    fireEvent.click(screen.getByTestId('saludo'));
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
    expect(sessionStorage.getItem('foreverInk_sesion')).toBeNull();
  });

  const montarRutaProtegida = (roles) => (
    renderConApp(
      <Routes>
        <Route path="/" element={<p>Inicio de la tienda</p>} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/secreto" element={<RutaProtegida roles={roles}><p>Zona privada</p></RutaProtegida>} />
      </Routes>,
      { ruta: '/secreto' },
    )
  );

  it('RutaProtegida manda al login si no hay sesión', () => {
    montarRutaProtegida(['Administrador']);
    expect(screen.getByText('Pantalla de login')).toBeTruthy();
  });

  it('RutaProtegida manda al inicio si el rol no tiene permiso', () => {
    conectarComo(...CLIENTE);
    montarRutaProtegida(['Administrador']);
    expect(screen.getByText('Inicio de la tienda')).toBeTruthy();
  });

  it('RutaProtegida muestra el contenido si el rol tiene permiso', () => {
    conectarComo(...ADMIN);
    montarRutaProtegida(['Administrador']);
    expect(screen.getByText('Zona privada')).toBeTruthy();
  });
});
