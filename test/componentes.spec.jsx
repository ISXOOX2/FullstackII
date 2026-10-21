// PRUEBAS 4 a 8 · Componentes React: props, renderizado condicional, estado, eventos y rutas.
// Testing Library dibuja el componente y simula al usuario (clics, escribir).
import { fireEvent, render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import TarjetaProducto from '../src/components/tienda/TarjetaProducto.jsx';
import ListaProductos from '../src/components/tienda/ListaProductos.jsx';
import Galeria from '../src/components/tienda/Galeria.jsx';
import FormularioLogin from '../src/components/tienda/FormularioLogin.jsx';
import RutaProtegida from '../src/components/comunes/RutaProtegida.jsx';
import { productoDePrueba, reiniciarTodo, renderConApp } from './ayudas.jsx';

describe('Componentes React', () => {
  beforeEach(reiniciarTodo);

  // PRUEBA 4 · Props + evento + spy
  it('TarjetaProducto: al hacer clic llama a onAgregar con el producto (evento + spy)', () => {
    const onAgregar = jasmine.createSpy('onAgregar');     // Arrange: un "espía" que registra llamadas
    const producto = productoDePrueba(1);
    renderConApp(<TarjetaProducto producto={producto} onAgregar={onAgregar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Añadir a mi reserva' })); // Act: clic

    expect(onAgregar).toHaveBeenCalledTimes(1);           // Assert: se llamó una vez...
    expect(onAgregar).toHaveBeenCalledWith(producto);     // ...con el producto correcto
  });

  // PRUEBA 5 · Renderizado condicional
  it('ListaProductos muestra un mensaje cuando la lista viene vacía (render condicional)', () => {
    renderConApp(<ListaProductos productos={[]} onAgregar={() => {}} vacioTitulo="Sin diseños" />);

    expect(screen.getByText('Sin diseños')).toBeTruthy();  // aparece el mensaje
    expect(screen.queryByRole('button', { name: 'Añadir a mi reserva' })).toBeNull(); // y no hay tarjetas
  });

  // PRUEBA 6 · Estado con useState
  it('Galeria cambia la imagen principal al hacer clic en una miniatura (useState)', () => {
    render(<Galeria imagenes={['img/a.svg', 'img/b.svg']} nombre="Diseño" />);
    expect(screen.getByAltText(/vista 1 de 2/).getAttribute('src')).toBe('img/a.svg'); // estado inicial

    fireEvent.click(screen.getByRole('button', { name: 'Ver imagen 2' }));             // Act

    expect(screen.getByAltText(/vista 2 de 2/).getAttribute('src')).toBe('img/b.svg'); // el estado cambió
  });

  // PRUEBA 7 · Formulario controlado + hook personalizado useFormulario
  it('FormularioLogin muestra los errores en tiempo real al escribir y salir del campo', () => {
    render(<FormularioLogin onEnviar={() => ''} />);
    const correo = screen.getByLabelText('Correo electrónico');
    expect(screen.queryByText(/correo válido/)).toBeNull();          // aún no escribe nada

    fireEvent.change(correo, { target: { name: 'correo', value: 'sin-arroba' } });
    expect(screen.getByText(/Ingresa un correo válido/)).toBeTruthy(); // aparece el error

    fireEvent.change(correo, { target: { name: 'correo', value: 'ana@gmail.com' } });
    expect(screen.queryByText(/Ingresa un correo válido/)).toBeNull(); // y desaparece al corregir
  });

  // PRUEBA 8 · Contexto de sesión + rutas protegidas
  it('RutaProtegida manda al login si no hay sesión', () => {
    renderConApp(                                          // Arrange: sin sesión, entro a /secreto
      <Routes>
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/secreto" element={<RutaProtegida roles={['Administrador']}><p>Zona privada</p></RutaProtegida>} />
      </Routes>,
      { ruta: '/secreto' },
    );

    expect(screen.getByText('Pantalla de login')).toBeTruthy(); // Assert: me redirigió al login
    expect(screen.queryByText('Zona privada')).toBeNull();
  });
});
