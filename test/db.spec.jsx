import { actualizar, crear, eliminar, listar, obtenerPorId } from '../src/data/db.js';
import { reiniciarTodo } from './ayudas.jsx';

describe('Base de datos simulada (db.js) - CRUD sobre localStorage', () => {
  beforeEach(reiniciarTodo);

  it('listar() devuelve los registros sembrados de una colección', () => {
    expect(listar('productos').length).toBe(12);
    expect(listar('categorias').length).toBe(4);
  });

  it('crear() agrega un registro con el siguiente id y lo persiste', () => {
    const nuevo = crear('categorias', { nombre: 'Tradicional', descripcion: 'Prueba' });
    expect(nuevo.id).toBe(5);
    expect(listar('categorias').length).toBe(5);
    expect(obtenerPorId('categorias', 5).nombre).toBe('Tradicional');
  });

  it('actualizar() modifica solo los campos indicados', () => {
    const cambiado = actualizar('productos', 1, { stock: 99 });
    expect(cambiado.stock).toBe(99);
    expect(obtenerPorId('productos', 1).nombre).toBe('Mariposa lineal');
  });

  it('eliminar() borra el registro y devuelve true; si no existe devuelve false', () => {
    expect(eliminar('productos', 1)).toBeTrue();
    expect(obtenerPorId('productos', 1)).toBeNull();
    expect(eliminar('productos', 1)).toBeFalse();
  });
});
