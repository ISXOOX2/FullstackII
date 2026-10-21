import {
  agregarItem, cambiarCantidad, cantidadTotal, quitarItem, totalCarrito,
} from '../src/services/carritoService.js';
import {
  actualizarProducto, buscarProductos, crearProducto, descontarCupos, esStockCritico, estaEnOferta,
  obtenerProducto, precioFinal, productosCriticos, productosEnOferta,
} from '../src/services/productosService.js';
import { crearOrden, ESTADOS, horasDisponibles, marcarPagada } from '../src/services/ordenesService.js';
import { autenticar, eliminarUsuario, registrarCliente } from '../src/services/usuariosService.js';
import { eliminarCategoria } from '../src/services/categoriasService.js';
import { resumenGeneral } from '../src/services/reportesService.js';
import { formatoCLP } from '../src/utils/formato.js';
import { productoDePrueba, reiniciarTodo } from './ayudas.jsx';

describe('Reglas del carrito (reserva)', () => {
  beforeEach(reiniciarTodo);

  it('agrega un diseño nuevo con el precio vigente (oferta incluida)', () => {
    const enOferta = productoDePrueba(2); // tiene precioOferta
    const { items, mensaje } = agregarItem([], enOferta);
    expect(mensaje).toBe('');
    expect(items[0].precio).toBe(enOferta.precioOferta);
  });

  it('suma la cantidad si el diseño ya estaba en el carrito', () => {
    const p = productoDePrueba(1);
    const { items } = agregarItem(agregarItem([], p).items, p);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(2);
  });

  it('no permite más de 5 unidades del mismo diseño', () => {
    const p = { ...productoDePrueba(1), stock: 20 };
    let items = [];
    for (let i = 0; i < 5; i++) items = agregarItem(items, p).items;
    const resultado = agregarItem(items, p);
    expect(resultado.mensaje).toContain('hasta 5');
    expect(resultado.items).toBe(items); // el carrito no cambió
  });

  it('no permite superar los cupos (stock) disponibles', () => {
    const p = { ...productoDePrueba(1), stock: 2 };
    const dos = agregarItem(agregarItem([], p).items, p).items;
    expect(agregarItem(dos, p).mensaje).toContain('hasta 2');
  });

  it('no deja agregar un diseño sin cupos', () => {
    const agotado = { ...productoDePrueba(1), stock: 0 };
    expect(agregarItem([], agotado).mensaje).toContain('no tiene cupos');
  });

  it('cambiarCantidad respeta el mínimo (1) y el máximo permitido', () => {
    const base = agregarItem([], { ...productoDePrueba(1), stock: 3 }).items;
    expect(cambiarCantidad(base, 1, 0)[0].cantidad).toBe(1);
    expect(cambiarCantidad(base, 1, 99)[0].cantidad).toBe(3);
  });

  it('calcula total y cantidad, y quitarItem elimina el diseño', () => {
    const items = agregarItem(agregarItem([], productoDePrueba(1)).items, productoDePrueba(5)).items;
    expect(cantidadTotal(items)).toBe(2);
    expect(totalCarrito(items)).toBe(precioFinal(productoDePrueba(1)) + precioFinal(productoDePrueba(5)));
    expect(quitarItem(items, 1).length).toBe(1);
  });
});

describe('Productos: ofertas, stock crítico y búsqueda', () => {
  beforeEach(reiniciarTodo);

  it('precioFinal usa el precio de oferta cuando existe', () => {
    const p = productoDePrueba(2);
    expect(estaEnOferta(p)).toBeTrue();
    expect(precioFinal(p)).toBe(p.precioOferta);
    expect(productosEnOferta().length).toBe(4);
  });

  it('detecta stock crítico cuando el stock es igual o menor al crítico', () => {
    expect(esStockCritico({ stock: 3, stockCritico: 3 })).toBeTrue();
    expect(esStockCritico({ stock: 2, stockCritico: 3 })).toBeTrue();
    expect(esStockCritico({ stock: 4, stockCritico: 3 })).toBeFalse();
    expect(productosCriticos().map((p) => p.id)).toEqual([3, 11]);
  });

  it('buscarProductos filtra por texto sin importar tildes ni mayúsculas', () => {
    const resultado = buscarProductos({ texto: 'MONTANA' });
    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe('Montaña geométrica');
  });

  it('buscarProductos filtra por estilo, precio máximo y ordena por precio', () => {
    const delEstilo = buscarProductos({ categoriaId: 1 });
    expect(delEstilo.every((p) => p.categoriaId === 1)).toBeTrue();
    const baratos = buscarProductos({ precioMax: 50000, orden: 'precio-asc' });
    expect(baratos.every((p) => precioFinal(p) <= 50000)).toBeTrue();
    const precios = baratos.map(precioFinal);
    expect(precios).toEqual([...precios].sort((a, b) => a - b));
  });

  it('crearProducto rechaza un código repetido', () => {
    const existente = productoDePrueba(1);
    const resultado = crearProducto({ ...existente, codigo: existente.codigo.toLowerCase() });
    expect(resultado.ok).toBeFalse();
    expect(resultado.error).toContain('código');
  });

  it('actualizarProducto guarda los cambios', () => {
    const p = productoDePrueba(1);
    const resultado = actualizarProducto(1, { ...p, nombre: 'Mariposa nueva', precio: 70000 });
    expect(resultado.ok).toBeTrue();
    expect(obtenerProducto(1).nombre).toBe('Mariposa nueva');
  });

  it('descontarCupos resta el stock y nunca deja valores negativos', () => {
    descontarCupos([{ productoId: 1, cantidad: 2 }, { productoId: 11, cantidad: 50 }]);
    expect(obtenerProducto(1).stock).toBe(6);
    expect(obtenerProducto(11).stock).toBe(0);
  });
});

describe('Órdenes y agenda de citas', () => {
  beforeEach(reiniciarTodo);

  const datosOrden = (fecha, hora, tatuadorId) => ({
    cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', telefono: '+56912345678' },
    cita: { fecha, hora, tatuadorId, zonaCuerpo: 'Antebrazo', indicaciones: '' },
    items: [{ productoId: 1, nombre: 'Mariposa lineal', imagen: '', categoriaId: 1, precio: 65000, cantidad: 1 }],
  });

  it('crearOrden deja la orden Pendiente con número y código generados', () => {
    const orden = crearOrden(datosOrden('2026-12-02', '11:00', 1), new Date(2026, 9, 12, 10, 0));
    expect(orden.estado).toBe(ESTADOS.PENDIENTE);
    expect(orden.numero).toMatch(/^20261012\d{2}$/);
    expect(orden.codigo).toMatch(/^ORDER\d+$/);
    expect(orden.total).toBe(65000);
  });

  it('una hora solo queda ocupada cuando la orden está pagada', () => {
    const orden = crearOrden(datosOrden('2026-12-02', '11:00', 1));
    expect(horasDisponibles('2026-12-02', 1)).toContain('11:00'); // pendiente: sigue libre
    marcarPagada(orden.id);
    expect(horasDisponibles('2026-12-02', 1)).not.toContain('11:00');
  });

  it('la misma hora sigue libre para otro tatuador', () => {
    const orden = crearOrden(datosOrden('2026-12-02', '11:00', 1));
    marcarPagada(orden.id);
    expect(horasDisponibles('2026-12-02', 2)).toContain('11:00');
  });

  it('en un reintento la orden no bloquea su propia hora', () => {
    const orden = crearOrden(datosOrden('2026-12-02', '11:00', 1));
    marcarPagada(orden.id);
    expect(horasDisponibles('2026-12-02', 1, orden.id)).toContain('11:00');
  });
});

describe('Usuarios, categorías y reportes', () => {
  beforeEach(reiniciarTodo);

  it('autenticar devuelve el usuario sin contraseña si las credenciales son correctas', () => {
    const usuario = autenticar('ADMIN.foreverink@gmail.com', 'Admin#123');
    expect(usuario.tipo).toBe('Administrador');
    expect(usuario.password).toBeUndefined();
    expect(autenticar('admin.foreverink@gmail.com', 'incorrecta')).toBeNull();
  });

  it('registrarCliente crea un Cliente y rechaza un correo repetido', () => {
    const datos = {
      run: '11111112K', nombre: 'Luz', apellidos: 'Mora', correo: 'luz@gmail.com', password: 'Abc123',
      region: 'Valparaíso', comuna: 'Quilpué', direccion: 'Calle 1',
    };
    const primero = registrarCliente(datos);
    expect(primero.ok).toBeTrue();
    expect(primero.usuario.tipo).toBe('Cliente');
    expect(registrarCliente({ ...datos, run: '190110222' }).error).toContain('correo');
  });

  it('no se puede eliminar al último administrador ni a uno mismo', () => {
    expect(eliminarUsuario(1, 1).error).toContain('propia cuenta');
    expect(eliminarUsuario(1, 2).error).toContain('al menos un administrador');
  });

  it('no se puede eliminar una categoría que tiene productos', () => {
    expect(eliminarCategoria(1).ok).toBeFalse();
  });

  it('resumenGeneral cuenta solo las órdenes pagadas para los ingresos', () => {
    const resumen = resumenGeneral();
    expect(resumen.ordenesTotales).toBe(9);
    expect(resumen.ordenesPagadas).toBe(8);
    expect(resumen.productosCriticos).toBe(2);
  });
});

describe('Formato', () => {
  it('formatoCLP usa punto como separador de miles', () => {
    expect(formatoCLP(65000)).toBe('$65.000');
    expect(formatoCLP(1250000)).toBe('$1.250.000');
  });
});
