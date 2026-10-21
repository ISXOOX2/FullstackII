import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Rutas } from '../src/App.jsx';
import FormularioNewsletter from '../src/components/tienda/FormularioNewsletter.jsx';
import { pagosService } from '../src/services/pagosService.js';
import { borrarSesion, guardarSesion, leerSesion } from '../src/services/sesionService.js';
import { construirMailtoBoleta } from '../src/utils/boleta.js';
import { obtenerOrden } from '../src/services/ordenesService.js';
import { listarUsuarios } from '../src/services/usuariosService.js';
import { fechaISO, formatoFecha, formatoFechaLarga, inicial, nombreCompleto, normalizarTexto, sumarDias } from '../src/utils/formato.js';
import { ADMIN, conectarComo, reiniciarTodo, renderConApp } from './ayudas.jsx';

const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

describe('Pasarela de pago simulada (pagosService real con reloj falso)', () => {
  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  it('responde aprobado con una referencia después de un momento', async () => {
    const promesa = pagosService.procesar({ total: 1000, resultado: 'aprobado' });
    jasmine.clock().tick(800);
    const respuesta = await promesa;
    expect(respuesta.aprobado).toBeTrue();
    expect(respuesta.referencia).toMatch(/^PAY-/);
  });

  it('responde rechazado con un motivo cuando se simula el rechazo', async () => {
    const promesa = pagosService.procesar({ total: 1000, resultado: 'rechazado' });
    jasmine.clock().tick(800);
    const respuesta = await promesa;
    expect(respuesta.aprobado).toBeFalse();
    expect(respuesta.motivo).toContain('rechazada');
  });
});

describe('Sesión y utilidades de formato', () => {
  beforeEach(reiniciarTodo);

  it('guardarSesion / leerSesion / borrarSesion usan sessionStorage', () => {
    guardarSesion({ id: 1, nombre: 'Ana' });
    expect(leerSesion().nombre).toBe('Ana');
    borrarSesion();
    expect(leerSesion()).toBeNull();
  });

  it('formatea fechas legibles', () => {
    expect(formatoFecha('2026-10-23')).toBe('23-10-2026');
    expect(formatoFechaLarga('2026-10-23')).toBe('viernes 23 de octubre de 2026');
    expect(sumarDias('2026-10-30', 3)).toBe('2026-11-02');
    expect(fechaISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('formatea nombres y normaliza texto para buscar', () => {
    expect(nombreCompleto({ nombre: 'Ana', apellidos: 'Pérez' })).toBe('Ana Pérez');
    expect(inicial({ nombre: 'ana' })).toBe('A');
    expect(normalizarTexto('MontAña')).toBe('montana');
  });

  it('la boleta por correo arma un enlace mailto con el número de orden', () => {
    const enlace = construirMailtoBoleta(obtenerOrden(1));
    expect(enlace.startsWith('mailto:camila.fuentes%40gmail.com')).toBeTrue();
    expect(decodeURIComponent(enlace)).toContain('2026081401');
  });
});

describe('Boletín del pie de página', () => {
  it('valida el correo antes de suscribir y confirma con un aviso', () => {
    renderConApp(<FormularioNewsletter />);
    fireEvent.click(screen.getByRole('button', { name: 'Suscribirme' }));
    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy();
    escribir('Recibe novedades y diseños nuevos', 'ana@gmail.com');
    fireEvent.click(screen.getByRole('button', { name: 'Suscribirme' }));
    expect(screen.getByText(/te suscribiste al boletín/i)).toBeTruthy();
  });
});

describe('Páginas informativas', () => {
  beforeEach(reiniciarTodo);

  it('Nosotros muestra al equipo de tatuadores y a las desarrolladoras', () => {
    renderConApp(<Rutas />, { ruta: '/nosotros' });
    expect(screen.getByText('Cami Reyes')).toBeTruthy();
    expect(screen.getByText('Isabel Cántaro')).toBeTruthy();
  });

  it('el blog lista los artículos y el detalle muestra su contenido', () => {
    const { unmount } = renderConApp(<Rutas />, { ruta: '/blogs' });
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(2);
    unmount();
    renderConApp(<Rutas />, { ruta: '/blogs/1' });
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Cuidados después de tatuarte');
  });

  it('un artículo inexistente muestra un mensaje', () => {
    renderConApp(<Rutas />, { ruta: '/blogs/99' });
    expect(screen.getByText('Ese artículo no existe')).toBeTruthy();
  });

  it('la página de estilos muestra las 4 categorías', () => {
    renderConApp(<Rutas />, { ruta: '/categorias' });
    ['Fineline', 'Botánico', 'Geométrico', 'Celestial'].forEach((n) => {
      expect(screen.getAllByText(n).length).toBeGreaterThan(0);
    });
  });

  it('en el catálogo el filtro "Solo ofertas" reduce los resultados', () => {
    renderConApp(<Rutas />, { ruta: '/productos' });
    expect(screen.getByText('12 diseño(s) encontrados')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Solo ofertas'));
    expect(screen.getByText('4 diseño(s) encontrados')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(screen.getByText('12 diseño(s) encontrados')).toBeTruthy();
  });
});

describe('Más pantallas del panel de administración', () => {
  beforeEach(reiniciarTodo);

  it('Órdenes: se pueden filtrar por estado', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/ordenes' });
    expect(screen.getAllByText('Ver detalle').length).toBe(9);
    escribir('Filtrar por estado', 'Pago rechazado');
    expect(screen.getAllByText('Ver detalle').length).toBe(1);
  });

  it('el detalle de una orden muestra la boleta con cliente, cita y total', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/ordenes/1' });
    expect(screen.getByText('Orden N° 2026081401')).toBeTruthy();
    expect(screen.getByText(/Camila Fuentes Rojas/)).toBeTruthy();
  });

  it('el detalle de un diseño muestra su ficha completa', () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/productos/3' });
    expect(screen.getByRole('heading', { name: 'Ancla fina' })).toBeTruthy();
    expect(screen.getByText('2 (crítico)')).toBeTruthy();
  });

  it('Usuarios: lista todos los usuarios y no deja eliminarse a sí mismo', async () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/usuarios' });
    expect(screen.getAllByRole('row').length).toBe(listarUsuarios().length + 1);
    const fila = screen.getByText('admin.foreverink@gmail.com').closest('tr');
    fireEvent.click(within(fila).getByText('Eliminar'));
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Eliminar' }));
    expect(await screen.findByText('No puedes eliminar tu propia cuenta.')).toBeTruthy();
  });

  it('el administrador crea un usuario nuevo de tipo Vendedor', async () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/usuarios/nuevo' });
    escribir('RUN', '11111112K');
    escribir('Nombre', 'Vera');
    escribir('Apellidos', 'Lagos');
    escribir('Correo electrónico', 'vera@duoc.cl');
    escribir('Contraseña', 'Abc123');
    escribir('Tipo de usuario', 'Vendedor');
    escribir('Región', 'Valparaíso');
    escribir('Comuna', 'Quilpué');
    escribir('Dirección', 'Calle 2');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(listarUsuarios().some((u) => u.correo === 'vera@duoc.cl' && u.tipo === 'Vendedor')).toBeTrue());
  });

  it('el administrador edita un usuario sin cambiar su contraseña', async () => {
    conectarComo(...ADMIN);
    renderConApp(<Rutas />, { ruta: '/admin/usuarios/3/editar' });
    escribir('Nombre', 'Cliente Editado');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    await waitFor(() => expect(listarUsuarios().find((u) => u.id === 3).nombre).toBe('Cliente Editado'));
    expect(listarUsuarios().find((u) => u.id === 3).password).toBe('Cliente#1');
  });
});
