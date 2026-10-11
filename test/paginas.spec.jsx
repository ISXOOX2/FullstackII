import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Rutas } from '../src/App.jsx';
import { pagosService } from '../src/services/pagosService.js';
import { CLAVE_CARRITO, agregarItem, leerCarrito } from '../src/services/carritoService.js';
import { listarOrdenes, obtenerOrden } from '../src/services/ordenesService.js';
import { listarProductos, obtenerProducto } from '../src/services/productosService.js';
import { listarMensajes } from '../src/services/contactoService.js';
import { listarUsuarios } from '../src/services/usuariosService.js';
import { fechaISO, sumarDias } from '../src/utils/formato.js';
import { ADMIN, CLIENTE, VENDEDOR, conectarComo, productoDePrueba, reiniciarTodo, renderConApp } from './ayudas.jsx';

/** Próxima fecha (desde mañana) que cae en el día de la semana pedido (3 = miércoles). */
function proximoDia(diaSemana) {
  let fecha = sumarDias(fechaISO(), 1);
  while (new Date(fecha + 'T00:00:00').getDay() !== diaSemana) fecha = sumarDias(fecha, 1);
  return fecha;
}

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

/** Llena el formulario del checkout con datos válidos. */
function completarCheckout(resultadoPago = 'aprobado') {
  escribir('Nombre', 'Ana');
  escribir('Apellidos', 'Pérez');
  escribir('Correo electrónico', 'ana@gmail.com');
  escribir('Teléfono', '+56912345678');
  escribir('Tatuador/a', '1');
  escribir('Fecha', proximoDia(3));
  escribir('Horario', '14:00');
  escribir('Zona del cuerpo', 'Antebrazo');
  escribir('Resultado de la pasarela de pago', resultadoPago);
}

/** El botón "Iniciar sesión" del formulario (la barra superior tiene otro con el mismo nombre). */
const enviarLogin = () =>
  fireEvent.click(screen.getAllByRole('button', { name: 'Iniciar sesión' }).find((b) => b.type === 'submit'));

const cargarCarrito = (id = 1, cantidad = 1) =>
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(agregarItem([], productoDePrueba(id), cantidad).items));

describe('Navegación general de la tienda', () => {
  beforeEach(reiniciarTodo);

  it('la página de inicio muestra los estilos y los diseños destacados', () => {
    renderConApp(<Rutas />, { ruta: '/' });
    expect(screen.getByText('Encuentra tu trazo')).toBeTruthy();
    expect(screen.getByText('Diseños favoritos')).toBeTruthy();
    expect(screen.getAllByText('Fineline').length).toBeGreaterThan(0);
  });

  it('una ruta inexistente muestra la página 404', () => {
    renderConApp(<Rutas />, { ruta: '/no-existe' });
    expect(screen.getByText(/Página no encontrada/)).toBeTruthy();
  });

  it('el catálogo filtra por la búsqueda recibida en la URL (?q=)', () => {
    renderConApp(<Rutas />, { ruta: '/productos?q=lunares' });
    expect(screen.getByText('1 diseño(s) encontrados')).toBeTruthy();
    expect(screen.getAllByText('Fases lunares').length).toBeGreaterThan(0);
    expect(screen.queryByText('Ancla fina')).toBeNull();
  });

  it('el catálogo muestra un mensaje si la búsqueda no encuentra nada', () => {
    renderConApp(<Rutas />, { ruta: '/productos?q=zzzz' });
    expect(screen.getByText('No encontramos diseños')).toBeTruthy();
  });

  it('el detalle muestra la ficha del diseño y un mensaje si no existe', () => {
    const { unmount } = renderConApp(<Rutas />, { ruta: '/productos/1' });
    expect(screen.getByRole('heading', { level: 1, name: 'Mariposa lineal' })).toBeTruthy();
    expect(screen.getByText('TF-001')).toBeTruthy();
    unmount();
    renderConApp(<Rutas />, { ruta: '/productos/999' });
    expect(screen.getByText('Ese diseño no existe')).toBeTruthy();
  });

  it('la página de ofertas solo lista diseños con precio de oferta', () => {
    renderConApp(<Rutas />, { ruta: '/ofertas' });
    expect(screen.getAllByText('Oferta').length).toBe(4);
  });

  it('el detalle de un estilo muestra solo los diseños de esa categoría', () => {
    renderConApp(<Rutas />, { ruta: '/categorias/3' });
    expect(screen.getByRole('heading', { level: 1, name: 'Geométrico' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Añadir a mi reserva' }).length).toBe(3);
  });
});

describe('Carrito de reservas', () => {
  beforeEach(reiniciarTodo);

  it('añadir desde el detalle guarda el diseño en el carrito (localStorage) y avisa', () => {
    renderConApp(<Rutas />, { ruta: '/productos/1' });
    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir a mi reserva' })[0]);
    expect(leerCarrito().length).toBe(1);
    expect(screen.getByTestId('total-carrito').textContent).toBe('$65.000');
    expect(screen.getByText(/se añadió a tu reserva/)).toBeTruthy();
  });

  it('el carrito vacío muestra un mensaje y no el botón de continuar', () => {
    renderConApp(<Rutas />, { ruta: '/carrito' });
    expect(screen.getByText('Tu reserva está vacía')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continuar con la reserva' })).toBeNull();
  });

  it('cambiar la cantidad y eliminar actualizan el total', () => {
    cargarCarrito(1, 1);
    renderConApp(<Rutas />, { ruta: '/carrito' });
    fireEvent.click(screen.getByRole('button', { name: /Agregar una unidad/ }));
    expect(screen.getByTestId('total-carrito-pagina').textContent).toBe('$130.000');
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByText('Tu reserva está vacía')).toBeTruthy();
  });

  it('el checkout sin diseños en el carrito redirige al carrito', () => {
    renderConApp(<Rutas />, { ruta: '/checkout' });
    expect(screen.getByText('Tu reserva está vacía')).toBeTruthy();
  });
});

describe('Checkout con pasarela de pago simulada (mock con spyOn)', () => {
  beforeEach(reiniciarTodo);

  it('con pago APROBADO: crea la orden Pagada, descuenta cupos, vacía el carrito y muestra la boleta', async () => {
    const spy = spyOn(pagosService, 'procesar').and.returnValue(Promise.resolve({ aprobado: true, referencia: 'PAY-1' }));
    cargarCarrito(1, 2);
    renderConApp(<Rutas />, { ruta: '/checkout' });
    completarCheckout('aprobado');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByText(/Reserva confirmada/)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith({ total: 130000, resultado: 'aprobado' });
    const orden = listarOrdenes()[0];
    expect(orden.estado).toBe('Pagada');
    expect(orden.cita.hora).toBe('14:00');
    expect(obtenerProducto(1).stock).toBe(6); // 8 - 2
    expect(leerCarrito()).toEqual([]);
    expect(screen.getByRole('button', { name: /Imprimir boleta/ })).toBeTruthy();
  });

  it('con pago RECHAZADO: la orden queda "Pago rechazado", el stock no cambia y el carrito se conserva', async () => {
    spyOn(pagosService, 'procesar').and.returnValue(Promise.resolve({ aprobado: false, motivo: 'Rechazada' }));
    cargarCarrito(1, 1);
    renderConApp(<Rutas />, { ruta: '/checkout' });
    completarCheckout('rechazado');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByText(/No pudimos procesar tu pago/)).toBeTruthy();
    expect(listarOrdenes()[0].estado).toBe('Pago rechazado');
    expect(obtenerProducto(1).stock).toBe(8);
    expect(leerCarrito().length).toBe(1);
    expect(screen.getByRole('button', { name: 'Volver a realizar el pago' })).toBeTruthy();
  });

  it('reintentar el pago reutiliza la misma orden en vez de crear otra', async () => {
    const spy = spyOn(pagosService, 'procesar').and.returnValues(
      Promise.resolve({ aprobado: false }),
      Promise.resolve({ aprobado: true, referencia: 'PAY-2' }),
    );
    cargarCarrito(1, 1);
    renderConApp(<Rutas />, { ruta: '/checkout' });
    completarCheckout('rechazado');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    await screen.findByText(/No pudimos procesar tu pago/);
    const cantidadAntes = listarOrdenes().length;

    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }));
    expect(await screen.findByText(/reintentando el pago/)).toBeTruthy();
    escribir('Horario', '14:00');
    escribir('Resultado de la pasarela de pago', 'aprobado');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByText(/Reserva confirmada/)).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(listarOrdenes().length).toBe(cantidadAntes); // no se creó una orden nueva
    expect(obtenerOrden(listarOrdenes()[0].id).estado).toBe('Pagada');
  });

  it('no deja pagar si el formulario tiene errores (no llama a la pasarela)', () => {
    const spy = spyOn(pagosService, 'procesar');
    cargarCarrito(1, 1);
    renderConApp(<Rutas />, { ruta: '/checkout' });
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByText('Elige con quién quieres tatuarte.')).toBeTruthy();
    expect(screen.getByText('Elige la fecha de tu cita.')).toBeTruthy();
  });

  it('la hora ya reservada por otro cliente no aparece disponible para el mismo tatuador y fecha', async () => {
    spyOn(pagosService, 'procesar').and.returnValue(Promise.resolve({ aprobado: true }));
    cargarCarrito(1, 1);
    const vista = renderConApp(<Rutas />, { ruta: '/checkout' });
    completarCheckout('aprobado');
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    await screen.findByText(/Reserva confirmada/);
    vista.unmount();

    cargarCarrito(5, 1);
    renderConApp(<Rutas />, { ruta: '/checkout' });
    escribir('Tatuador/a', '1');
    escribir('Fecha', proximoDia(3));
    const opciones = within(screen.getByLabelText('Horario')).getAllByRole('option').map((o) => o.value);
    expect(opciones).not.toContain('14:00');
    expect(opciones).toContain('11:00');
  });
});

describe('Inicio de sesión y registro', () => {
  beforeEach(reiniciarTodo);

  it('un cliente con credenciales correctas inicia sesión y vuelve a la tienda', async () => {
    renderConApp(<Rutas />, { ruta: '/login' });
    escribir('Correo electrónico', CLIENTE[0]);
    escribir('Contraseña', CLIENTE[1]);
    enviarLogin();
    expect(await screen.findByText('Encuentra tu trazo')).toBeTruthy();
    expect(screen.getByTestId('saludo').textContent).toBe('Hola, Cliente');
  });

  it('un administrador inicia sesión y entra al panel', async () => {
    renderConApp(<Rutas />, { ruta: '/login' });
    escribir('Correo electrónico', ADMIN[0]);
    escribir('Contraseña', ADMIN[1]);
    enviarLogin();
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeTruthy();
  });

  it('credenciales incorrectas muestran el error y no inician sesión', () => {
    renderConApp(<Rutas />, { ruta: '/login' });
    escribir('Correo electrónico', ADMIN[0]);
    escribir('Contraseña', 'Mala123');
    enviarLogin();
    expect(screen.getByRole('alert').textContent).toContain('incorrectos');
  });

  it('el registro crea un cliente nuevo y deja la sesión iniciada', async () => {
    renderConApp(<Rutas />, { ruta: '/registro' });
    escribir('RUN', '11111112K');
    escribir('Nombre', 'Luz');
    escribir('Apellidos', 'Mora');
    escribir('Correo electrónico', 'luz@gmail.com');
    escribir('Confirmar correo', 'luz@gmail.com');
    escribir('Contraseña', 'Abc123');
    escribir('Confirmar contraseña', 'Abc123');
    escribir('Región', 'Valparaíso');
    escribir('Comuna', 'Quilpué');
    escribir('Dirección', 'Calle 1');
    fireEvent.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));
    expect(await screen.findByText('Encuentra tu trazo')).toBeTruthy();
    expect(listarUsuarios().some((u) => u.correo === 'luz@gmail.com' && u.tipo === 'Cliente')).toBeTrue();
  });

  it('el formulario de contacto guarda el mensaje en la base simulada', () => {
    renderConApp(<Rutas />, { ruta: '/contacto' });
    escribir('Nombre', 'Ana');
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Comentario', 'Quiero cotizar un tatuaje');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(listarMensajes().length).toBe(1);
    expect(screen.getByText(/Mensaje enviado/)).toBeTruthy();
  });
});

describe('Panel de administración y permisos por rol', () => {
  beforeEach(reiniciarTodo);

  it('sin sesión, entrar a /admin redirige al login', () => {
    renderConApp(<Rutas />, { ruta: '/admin' });
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
  });

  it('un cliente no puede entrar al panel (vuelve al inicio)', () => {
    conectarComo(...CLIENTE);
    renderConApp(<Rutas />, { ruta: '/admin/usuarios' });
    expect(screen.getByText('Encuentra tu trazo')).toBeTruthy();
  });

  it('el vendedor ve solo Órdenes y Productos, y /admin lo lleva a las órdenes', () => {
    conectarComo(...VENDEDOR);
    renderConApp(<Rutas />, { ruta: '/admin' });
    expect(screen.getByRole('heading', { name: 'Órdenes' })).toBeTruthy();
    const menu = screen.getByRole('navigation', { name: 'Menú del panel' });
    expect(within(menu).getByText('Productos')).toBeTruthy();
    expect(within(menu).queryByText('Usuarios')).toBeNull();
    expect(within(menu).queryByText('Reportes')).toBeNull();
  });

  it('el vendedor ve los productos en modo lectura (sin crear, editar ni eliminar)', () => {
    conectarComo(...VENDEDOR);
    renderConApp(<Rutas />, { ruta: '/admin/productos' });
    expect(screen.queryByText('Nuevo diseño')).toBeNull();
    expect(screen.queryByText('Eliminar')).toBeNull();
    expect(screen.getAllByText('Ver').length).toBe(12);
  });

  it('el vendedor no puede abrir pantallas exclusivas del administrador', () => {
    conectarComo(...VENDEDOR);
    renderConApp(<Rutas />, { ruta: '/admin/categorias' });
    expect(screen.getByText('Encuentra tu trazo')).toBeTruthy();
  });

  it('el dashboard del administrador muestra la alerta de stock crítico', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin' });
    expect(screen.getByText(/Stock crítico: 2 diseño/)).toBeTruthy();
  });

  it('el administrador elimina un diseño tras confirmar en la ventana modal', async () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/productos' });
    const antes = listarProductos().length;
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    expect(await screen.findByText(/Esta acción no se puede deshacer/)).toBeTruthy();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }));
    await waitFor(() => expect(listarProductos().length).toBe(antes - 1));
  });

  it('el administrador crea un diseño nuevo con el formulario del mantenedor', async () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/productos/nuevo' });
    escribir('Código', 'TF-099');
    escribir('Nombre', 'Diseño de prueba');
    escribir('Estilo (categoría)', '1');
    escribir('Precio (CLP)', '50000');
    escribir('Stock (cupos)', '5');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar diseño' }));
    expect(await screen.findByRole('heading', { name: 'Productos' })).toBeTruthy();
    expect(listarProductos().some((p) => p.codigo === 'TF-099')).toBeTrue();
  });

  it('el formulario de diseño valida que el precio de oferta sea menor al precio normal', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/productos/nuevo' });
    escribir('Precio (CLP)', '50000');
    escribir(/Precio de oferta/, '60000');
    expect(screen.getByText(/precio de oferta debe ser menor/)).toBeTruthy();
  });

  it('el administrador crea una categoría y no puede eliminar una con productos', async () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/categorias' });
    fireEvent.click(screen.getByRole('button', { name: 'Nueva categoría' }));
    escribir('Nombre', 'Tradicional');
    fireEvent.click(await screen.findByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText('Tradicional')).toBeTruthy();

    fireEvent.click(screen.getAllByText('Eliminar')[0]); // Fineline tiene productos
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Eliminar' }));
    expect(await screen.findByText(/No se puede eliminar: tiene 3 producto/)).toBeTruthy();
  });

  it('el administrador ve el historial de compras de un cliente', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/usuarios/4/historial' });
    expect(screen.getByRole('heading', { name: /Historial de Camila/ })).toBeTruthy();
    expect(screen.getAllByText('Ver detalle').length).toBeGreaterThan(0);
  });

  it('los reportes muestran las ventas por estilo', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/reportes' });
    expect(screen.getByText('Ventas por estilo')).toBeTruthy();
    expect(screen.getByText('Diseños más reservados')).toBeTruthy();
  });
});

describe('Perfil del usuario', () => {
  beforeEach(reiniciarTodo);

  it('el cliente ve sus datos y su historial de reservas', () => {
    conectarComo(...CLIENTE);
    renderConApp(<Rutas />, { ruta: '/perfil' });
    expect(screen.getByRole('heading', { name: 'Mi perfil' })).toBeTruthy();
    expect(screen.getByLabelText('Nombre').value).toBe('Cliente');
    expect(screen.getAllByText('Ver boleta').length).toBeGreaterThan(0);
  });

  it('el cliente puede actualizar su teléfono', () => {
    conectarComo(...CLIENTE);
    renderConApp(<Rutas />, { ruta: '/perfil' });
    escribir(/^Teléfono/, '+56988887777');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByText(/se actualizaron correctamente/)).toBeTruthy();
    expect(listarUsuarios().find((u) => u.id === 3).telefono).toBe('+56988887777');
  });
});
