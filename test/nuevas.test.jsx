// ════════════════════════════════════════════════════════════════════════════
// PRUEBAS DE LAS REGLAS NUEVAS (retroalimentación del 20 de noviembre)
// Tienda con stock, zonas de la lista, reseñas de 1 a 5 estrellas y "Mi proyecto" a 3 días hábiles.
// ════════════════════════════════════════════════════════════════════════════
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SelectorEstrellas from '../src/components/moleculas/SelectorEstrellas.jsx';
import { agregarArticulo, agregarItem, tieneReservas } from '../src/services/carritoService.js';
import { descontarStockArticulos, obtenerInsumo } from '../src/services/insumosService.js';
import { crearProyecto } from '../src/services/proyectosService.js';
import {
  ESTADOS, TIPOS_SOLICITUD, crearOrden, crearSolicitud, marcarPagada, puedeSolicitar, responderSolicitud,
} from '../src/services/ordenesService.js';
import { validarFormularioResena, validarZona } from '../src/utils/validaciones.js';
import { sumarDiasHabiles } from '../src/utils/formato.js';
import { productoDePrueba, reiniciarTodo } from './ayudas.jsx';

describe('Reglas nuevas', () => {
  beforeEach(() => reiniciarTodo());

  it('16. Un artículo de la tienda no se puede agregar más allá de su stock y al pagar se descuenta', () => {
    // Arrange: el film de segunda piel (id 10) tiene stock 3
    const film = obtenerInsumo(10);

    // Act
    const conTres = agregarArticulo([], film, 3);
    const conCuatro = agregarArticulo(conTres.items, film, 1);
    descontarStockArticulos(conTres.items);

    // Assert
    expect(conTres.mensaje).toBe('');
    expect(conCuatro.mensaje).toContain('Solo puedes llevar hasta 3');
    expect(tieneReservas(conTres.items)).toBe(false); // solo artículos: no se pide cita
    expect(tieneReservas(agregarItem(conTres.items, productoDePrueba(1)).items)).toBe(true);
    expect(obtenerInsumo(10).stock).toBe(0);
  });

  it('17. La zona solo puede ser una de la lista y la reseña va de 1 a 5 estrellas', () => {
    expect(validarZona('Antebrazo')).toBe('');
    expect(validarZona('la frente')).toBe('Elige una zona de la lista.');
    expect(validarFormularioResena({ estrellas: '6', comentario: 'Muy buen trabajo, lo recomiendo' }).estrellas).toBeTruthy();
    expect(validarFormularioResena({ estrellas: '5', comentario: 'Muy buen trabajo, lo recomiendo' })).toEqual({});
  });

  it('18. SelectorEstrellas avisa la nota elegida al hacer clic', () => {
    let elegida = '';
    render(<SelectorEstrellas valor="" onChange={(e) => { elegida = e.target.value; }} />);
    fireEvent.click(screen.getByLabelText('4 estrella(s): Bueno'));
    expect(elegida).toBe('4');
  });

  it('19. Mi proyecto: el plazo de contacto son 3 días hábiles (sin sábado ni domingo)', () => {
    expect(sumarDiasHabiles('2026-11-20', 3)).toBe('2026-11-25'); // viernes -> miércoles
    const proyecto = crearProyecto(
      { nombre: 'Ana', correo: 'ana@gmail.com', zonaCuerpo: 'Muñeca', idea: 'Una golondrina pequeña en línea fina' },
      null, '2026-11-20',
    );
    expect(proyecto.contactarAntesDe).toBe('2026-11-25');
    expect(proyecto.estado).toBe('Nuevo');
  });

  it('20. Compra de la tienda: reembolso hasta 10 días después; al aprobarlo el stock vuelve a bodega', () => {
    // Arrange: compra pagada de 2 cremas (id 8, stock 12) sin cita
    const crema = obtenerInsumo(8);
    const { items } = agregarArticulo([], crema, 2);
    const compra = crearOrden({ cliente: { nombre: 'Ana' }, cita: null, items }, new Date('2026-11-20T12:00:00'));
    marcarPagada(compra.id);
    descontarStockArticulos(items);

    // Assert de plazos: no hay cambio de fecha, y al día 11 ya no se puede reembolsar
    expect(puedeSolicitar({ ...compra, estado: ESTADOS.PAGADA }, TIPOS_SOLICITUD.CAMBIO)).toContain('no tiene cita');
    expect(puedeSolicitar({ ...compra, estado: ESTADOS.PAGADA }, TIPOS_SOLICITUD.REEMBOLSO, new Date('2026-12-01T12:00:00')))
      .toContain('10 días');

    // Act: el cliente se arrepiente al día 3 y el administrador aprueba
    const solicitud = crearSolicitud(compra.id, {
      tipo: TIPOS_SOLICITUD.REEMBOLSO, motivo: 'Me arrepentí de la compra', justificativo: 'Ya tenía una crema en casa',
    }, new Date('2026-11-23T12:00:00'));
    const respuesta = responderSolicitud(compra.id, true, 'Se devuelve el dinero');

    // Assert
    expect(solicitud.ok).toBe(true);
    expect(respuesta.orden.estado).toBe(ESTADOS.REEMBOLSADA);
    expect(obtenerInsumo(8).stock).toBe(12);
  });
});
