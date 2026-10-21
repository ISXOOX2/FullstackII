// ════════════════════════════════════════════════════════════════════════════
// 5 PRUEBAS COMPLEMENTARIAS  (se ejecutan con npm test junto a las 10 de defensa)
//
// Cubren lo que pide el Anexo 1 además de los componentes (CRUD del archivo de datos y
// flujo de compra) y temas de las guías 2.3.3 y 2.3.5 (conexión con los microservicios, manejo de errores),
// y recorren todas las vistas para que el informe de cobertura sea representativo.
// ════════════════════════════════════════════════════════════════════════════
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LimiteDeErrores from '../src/components/utilidades/LimiteDeErrores.jsx';
import { actualizar, crear, eliminar, listar, obtenerPorId } from '../src/data/db.js';
import { pagosService } from '../src/services/pagosService.js';
import { api } from '../src/services/api.js';
import { CLAVE_CARRITO, agregarItem, leerCarrito } from '../src/services/carritoService.js';
import { horasDisponibles, listarOrdenes } from '../src/services/ordenesService.js';
import { obtenerProducto } from '../src/services/productosService.js';
import {
  iniciarSesionComo, productoDePrueba, proximoMiercoles, reiniciarTodo, renderApp,
} from './ayudas.jsx';

describe('Pruebas complementarias', () => {
  // Se guardan las funciones reales que algunas pruebas reemplazan por un mock.
  let procesarReal;
  let consoleErrorReal;
  beforeEach(() => {
    reiniciarTodo();
    procesarReal = pagosService.procesar;
    consoleErrorReal = console.error;
  });
  afterEach(() => {
    pagosService.procesar = procesarReal;
    console.error = consoleErrorReal;
  });

  // ─── 11 · CRUD del archivo de datos (Anexo 1: "fuente de datos simulada") ───
  it('11. db.js permite crear, leer, actualizar y eliminar registros', () => {
    // Create
    const nuevo = crear('mensajes', { nombre: 'Ana', comentario: 'Hola' });
    expect(nuevo.id).toBeGreaterThan(0);
    // Read
    expect(listar('mensajes').map((m) => m.id)).toContain(nuevo.id);
    expect(obtenerPorId('mensajes', nuevo.id).nombre).toBe('Ana');
    // Update
    expect(actualizar('mensajes', nuevo.id, { nombre: 'Ana María' }).nombre).toBe('Ana María');
    expect(actualizar('mensajes', 9999, { nombre: 'Nadie' })).toBeNull(); // no existe
    // Delete
    expect(eliminar('mensajes', nuevo.id)).toBe(true);
    expect(obtenerPorId('mensajes', nuevo.id)).toBeNull();
    expect(eliminar('mensajes', nuevo.id)).toBe(false); // borrar dos veces no hace nada
  });

  // ─── 12 · Flujo completo de compra APROBADA (integración + mock) ────────────
  it('12. Checkout con pago APROBADO: muestra la boleta, descuenta cupos, vacía el carrito y ocupa la hora', async () => {
    // Arrange: pasarela aprobada (mock) y 2 unidades del diseño 1 en el carrito
    pagosService.procesar = jasmine.createSpy('procesar')
      .and.returnValue(Promise.resolve({ aprobado: true, metodo: 'Tarjeta (simulado)' }));
    const conDos = agregarItem(agregarItem([], productoDePrueba(1)).items, productoDePrueba(1)).items;
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(conDos));
    const fecha = proximoMiercoles();
    renderApp('/checkout');
    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
    escribir('Nombre', 'Ana');
    escribir('Apellidos', 'Pérez');
    escribir('Correo electrónico', 'ana@gmail.com');
    escribir('Teléfono', '+56912345678');
    escribir('Tatuador/a', '1');
    escribir('Fecha', fecha);
    escribir('Horario', '11:00');
    escribir('Zona del cuerpo', 'Antebrazo');

    // Act
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    // Assert
    await waitFor(() => expect(screen.getByText('Compra exitosa')).toBeTruthy());
    expect(listarOrdenes()[0].estado).toBe('Pagada');
    expect(obtenerProducto(1).stock).toBe(6); // 8 - 2
    expect(leerCarrito().length).toBe(0);
    expect(horasDisponibles(fecha, 1)).not.toContain('11:00');
  });

  // ─── 13 · Navegación: todas las vistas de la tienda y del panel se dibujan ──
  it('13. Todas las rutas de la tienda y del panel muestran su título (sin errores)', async () => {
    const vistasTienda = [
      '/', '/productos', '/productos?q=luna', '/productos/1', '/categorias', '/categorias/1', '/ofertas',
      '/carrito', '/login', '/registro', '/nosotros', '/blogs', '/blogs/1', '/contacto', '/ruta-inexistente',
    ];
    for (const ruta of vistasTienda) {
      const vista = renderApp(ruta);
      expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0);
      vista.unmount();
    }

    // El panel requiere sesión de Administrador. Sus páginas son lazy: se espera con waitFor.
    iniciarSesionComo('admin.foreverink@gmail.com', 'Admin#123');
    const vistasPanel = [
      '/admin', '/admin/ordenes', '/admin/ordenes/1', '/admin/productos', '/admin/productos/1',
      '/admin/productos/nuevo', '/admin/productos/1/editar', '/admin/categorias', '/admin/usuarios',
      '/admin/usuarios/nuevo', '/admin/usuarios/1/editar', '/admin/usuarios/1/historial', '/admin/reportes', '/perfil',
    ];
    for (const ruta of vistasPanel) {
      const vista = renderApp(ruta);
      await waitFor(() => expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0));
      vista.unmount();
    }
  });

  // ─── 14 · MOCK de producto-service (axios, React V) ──────────────────────────
  // Se reemplaza la llamada GET /api/productos por un spy que responde una lista controlada:
  // así se prueba que el catálogo muestra lo que entrega el microservicio sin levantar Spring Boot.
  it('14. Productos muestra el catálogo que responde producto-service (mock de la API)', async () => {
    // Arrange: el "microservicio" responde un solo diseño
    const desdeServicio = { ...productoDePrueba(1), id: 99, nombre: 'Diseño desde producto-service' };
    api.listarProductos = jasmine.createSpy('listarProductos')
      .and.returnValue(Promise.resolve([desdeServicio]));

    // Act
    renderApp('/productos');

    // Assert: se llamó a la API y la página muestra el diseño remoto y el origen de los datos
    expect(api.listarProductos).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText('Diseño desde producto-service')).toBeTruthy());
    expect(screen.getByTestId('origen-catalogo').textContent).toContain('producto-service');
    expect(screen.queryByText(productoDePrueba(2).nombre)).toBeNull();
  });

  // ─── 15 · Manejo de errores: Error Boundary (guía 2.3.5) ────────────────────
  it('15. LimiteDeErrores muestra un mensaje amable si un componente falla al dibujarse', () => {
    // Arrange: un componente que siempre falla. console.error se reemplaza por un spy
    // porque React informa el error en la consola aunque esté controlado.
    console.error = jasmine.createSpy('console.error');
    function ComponenteRoto() {
      throw new Error('Falla de prueba');
    }

    // Act
    render(<LimiteDeErrores><ComponenteRoto /></LimiteDeErrores>);

    // Assert: en vez de una pantalla en blanco se ve el mensaje de respaldo
    expect(screen.getByText('Algo salió mal')).toBeTruthy();
  });
});
