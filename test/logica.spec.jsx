// PRUEBAS 1, 2, 3 y 10 · Lógica pura y reglas de negocio (sin dibujar pantallas).
// Cada prueba sigue el patrón AAA: Arrange (preparar), Act (ejecutar), Assert (verificar).
import { validarRun } from '../src/utils/validaciones.js';
import { agregarItem } from '../src/services/carritoService.js';
import { esStockCritico } from '../src/services/productosService.js';
import { crearOrden, horasDisponibles, marcarPagada } from '../src/services/ordenesService.js';
import { productoDePrueba, reiniciarTodo } from './ayudas.jsx';

describe('Lógica y reglas de negocio', () => {
  // Antes de CADA prueba se reinician los datos, así ninguna depende de otra.
  beforeEach(reiniciarTodo);

  // PRUEBA 1 · Validación con un caso inválido
  it('rechaza un RUN con dígito verificador incorrecto', () => {
    const runInvalido = '190110221';                      // Arrange: el dígito correcto sería 2
    const mensaje = validarRun(runInvalido);              // Act
    expect(mensaje).toContain('dígito verificador');      // Assert: devuelve un mensaje de error
  });

  // PRUEBA 2 · Regla del carrito: máximo 5 unidades por diseño
  it('no permite más de 5 unidades del mismo diseño', () => {
    const producto = { ...productoDePrueba(1), stock: 20 }; // Arrange: hay cupos de sobra
    let items = [];
    for (let i = 0; i < 5; i++) items = agregarItem(items, producto).items;

    const resultado = agregarItem(items, producto);       // Act: intento agregar la 6.ª unidad

    expect(resultado.mensaje).toContain('hasta 5');       // Assert: avisa la regla...
    expect(resultado.items).toBe(items);                  // ...y el carrito no cambió
  });

  // PRUEBA 3 · Valores límite del stock crítico
  it('detecta stock crítico cuando el stock es igual o menor al crítico', () => {
    expect(esStockCritico({ stock: 3, stockCritico: 3 })).toBeTrue();   // igual al límite
    expect(esStockCritico({ stock: 2, stockCritico: 3 })).toBeTrue();   // bajo el límite
    expect(esStockCritico({ stock: 4, stockCritico: 3 })).toBeFalse();  // sobre el límite
  });

  // PRUEBA 10 · Agenda: una hora se ocupa solo cuando la orden está pagada
  it('una hora solo queda ocupada cuando la orden está pagada', () => {
    const orden = crearOrden({                            // Arrange: orden Pendiente para el 2/12 a las 11:00
      cliente: { nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', telefono: '+56912345678' },
      cita: { fecha: '2026-12-02', hora: '11:00', tatuadorId: 1, zonaCuerpo: 'Antebrazo', indicaciones: '' },
      items: [{ productoId: 1, nombre: 'Mariposa lineal', imagen: '', categoriaId: 1, precio: 65000, cantidad: 1 }],
    });
    expect(horasDisponibles('2026-12-02', 1)).toContain('11:00');     // pendiente: sigue libre

    marcarPagada(orden.id);                               // Act: se paga la orden

    expect(horasDisponibles('2026-12-02', 1)).not.toContain('11:00'); // Assert: la hora ya no está
  });
});
