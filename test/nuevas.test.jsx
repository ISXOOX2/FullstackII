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
});
