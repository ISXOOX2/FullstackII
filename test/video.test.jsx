// Pruebas del video embebido del blog y de las sugerencias del buscador.
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import VideoYoutube from '../src/components/moleculas/VideoYoutube.jsx';
import Header from '../src/components/organismos/Header.jsx';
import { reiniciarTodo } from './ayudas.jsx';

describe('Video y sugerencias', () => {
  it('VideoYoutube inserta el iframe con el ID del video y un título accesible', () => {
    // Arrange + Act
    render(<VideoYoutube idVideo="gX7tSE8b2Bk" titulo="Video de prueba" />);

    // Assert
    const marco = screen.getByTitle('Video de prueba');
    expect(marco.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/gX7tSE8b2Bk');
    expect(screen.getByRole('link', { name: 'Ver en YouTube' }).getAttribute('href')).toContain('gX7tSE8b2Bk');
  });

  it('El buscador del Header ofrece sugerencias con los nombres de los diseños', () => {
    // Arrange
    reiniciarTodo();

    // Act
    const { container } = render(
      <MemoryRouter><Header usuario={null} onCerrarSesion={() => {}} total={0} cantidad={0} /></MemoryRouter>,
    );

    // Assert: el input está ligado a un <datalist> con una opción por diseño
    const buscador = screen.getByLabelText('Buscar diseños');
    const lista = container.querySelector(`#${buscador.getAttribute('list')}`);
    expect(lista.querySelectorAll('option').length).toBeGreaterThanOrEqual(30);
    expect(lista.querySelector('option[value="Panda con globo"]')).toBeTruthy();
  });
});
