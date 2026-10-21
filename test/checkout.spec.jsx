// PRUEBA 9 · Mock con spyOn: se reemplaza la pasarela de pago por una respuesta controlada.
// Así se prueba el caso "pago rechazado" sin esperar ni depender de un servicio externo.
import { fireEvent, screen } from '@testing-library/react';
import { Rutas } from '../src/App.jsx';
import { pagosService } from '../src/services/pagosService.js';
import { CLAVE_CARRITO, agregarItem, leerCarrito } from '../src/services/carritoService.js';
import { listarOrdenes } from '../src/services/ordenesService.js';
import { obtenerProducto } from '../src/services/productosService.js';
import { fechaISO, sumarDias } from '../src/utils/formato.js';
import { productoDePrueba, reiniciarTodo, renderConApp } from './ayudas.jsx';

/** Próximo miércoles desde mañana (el estudio atiende de martes a sábado). */
function proximoMiercoles() {
  let fecha = sumarDias(fechaISO(), 1);
  while (new Date(fecha + 'T00:00:00').getDay() !== 3) fecha = sumarDias(fecha, 1);
  return fecha;
}

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe('Checkout con pasarela de pago simulada (mock)', () => {
  beforeEach(reiniciarTodo);

  it('con pago RECHAZADO: la orden queda "Pago rechazado", el stock no cambia y el carrito se conserva', async () => {
    // Arrange: el mock responde "rechazado" y el carrito tiene 1 diseño (stock inicial 8)
    spyOn(pagosService, 'procesar').and.returnValue(Promise.resolve({ aprobado: false, motivo: 'Rechazada' }));
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(agregarItem([], productoDePrueba(1)).items));
    renderConApp(<Rutas />, { ruta: '/checkout' });
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
    expect(await screen.findByText(/No pudimos procesar tu pago/)).toBeTruthy();
    expect(listarOrdenes()[0].estado).toBe('Pago rechazado');
    expect(obtenerProducto(1).stock).toBe(8);
    expect(leerCarrito().length).toBe(1);
  });
});
