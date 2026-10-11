import {
  validarCorreo, validarFechaCita, validarFormularioCheckout, validarFormularioLogin,
  validarFormularioUsuario, validarPassword, validarRun, validarTelefono,
} from '../src/utils/validaciones.js';

describe('Validaciones de formularios', () => {
  describe('RUN', () => {
    it('acepta un RUN con dígito verificador correcto', () => {
      expect(validarRun('190110222')).toBe('');
    });
    it('acepta un RUN cuyo dígito verificador es K', () => {
      expect(validarRun('11111112K')).toBe('');
    });
    it('rechaza un RUN con dígito verificador incorrecto', () => {
      expect(validarRun('190110221')).toContain('dígito verificador');
    });
    it('rechaza un RUN con puntos o guion, o vacío', () => {
      expect(validarRun('19.011.022-2')).not.toBe('');
      expect(validarRun('')).toBe('El RUN es obligatorio.');
    });
  });

  describe('Correo', () => {
    it('acepta los dominios permitidos', () => {
      expect(validarCorreo('ana@duoc.cl', { restringirDominios: true })).toBe('');
      expect(validarCorreo('ana@profesor.duoc.cl', { restringirDominios: true })).toBe('');
      expect(validarCorreo('ana@gmail.com', { restringirDominios: true })).toBe('');
    });
    it('rechaza dominios no permitidos cuando se restringe', () => {
      expect(validarCorreo('ana@hotmail.com', { restringirDominios: true })).toContain('Solo se permiten');
    });
    it('rechaza formatos inválidos y correos de más de 100 caracteres', () => {
      expect(validarCorreo('sin-arroba')).toContain('correo válido');
      expect(validarCorreo('a'.repeat(95) + '@gmail.com')).toContain('100 caracteres');
    });
  });

  describe('Contraseña', () => {
    it('acepta de 4 a 10 caracteres combinando letras y números', () => {
      expect(validarPassword('Abc#1')).toBe('');
      expect(validarPassword('abcd1234')).toBe('');
    });
    it('rechaza largos fuera de rango y contraseñas sin números o sin letras', () => {
      expect(validarPassword('a1')).toContain('entre 4 y 10');
      expect(validarPassword('abcdefghij1')).toContain('entre 4 y 10');
      expect(validarPassword('solo letras')).not.toBe('');
      expect(validarPassword('abcdef')).toContain('letras y números');
    });
  });

  describe('Teléfono', () => {
    it('acepta celulares chilenos con o sin +56', () => {
      expect(validarTelefono('+56912345678')).toBe('');
      expect(validarTelefono('912345678')).toBe('');
    });
    it('rechaza números mal formados', () => {
      expect(validarTelefono('12345')).not.toBe('');
    });
  });

  describe('Fecha de la cita (regla de la agenda)', () => {
    // "Hoy" fijo para que la prueba no dependa del día en que se ejecute: lunes 12-10-2026.
    const hoy = new Date(2026, 9, 12);

    it('acepta un día hábil del estudio (martes a sábado) desde mañana', () => {
      expect(validarFechaCita('2026-10-14', hoy)).toBe('');
    });
    it('rechaza hoy y fechas pasadas', () => {
      expect(validarFechaCita('2026-10-12', hoy)).toContain('desde mañana');
      expect(validarFechaCita('2026-10-01', hoy)).toContain('desde mañana');
    });
    it('rechaza domingos y lunes (el estudio no atiende)', () => {
      expect(validarFechaCita('2026-10-18', hoy)).toContain('martes a sábado'); // domingo
      expect(validarFechaCita('2026-10-19', hoy)).toContain('martes a sábado'); // lunes
    });
    it('rechaza fechas a más de 180 días', () => {
      expect(validarFechaCita('2027-06-02', hoy)).toContain('180');
    });
  });

  describe('Formularios completos', () => {
    it('el login devuelve errores por campo cuando está vacío', () => {
      const errores = validarFormularioLogin({ correo: '', password: '' });
      expect(Object.keys(errores)).toEqual(['correo', 'password']);
    });
    it('el login válido no devuelve errores', () => {
      expect(validarFormularioLogin({ correo: 'a@gmail.com', password: 'Abc123' })).toEqual({});
    });
    it('el registro exige que los correos y las contraseñas coincidan', () => {
      const datos = {
        run: '190110222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', confirmarCorreo: 'otra@gmail.com',
        password: 'Abc123', confirmarPassword: 'Abc124', telefono: '', fechaNacimiento: '',
        region: 'Valparaíso', comuna: 'Quilpué', direccion: 'Calle 1',
      };
      const errores = validarFormularioUsuario(datos, { confirmarCorreo: true });
      expect(errores.confirmarCorreo).toBe('Los correos no coinciden.');
      expect(errores.confirmarPassword).toBe('Las contraseñas no coinciden.');
    });
    it('al editar un usuario la contraseña en blanco es válida (se conserva la anterior)', () => {
      const datos = {
        run: '190110222', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', password: '',
        region: 'Valparaíso', comuna: 'Quilpué', direccion: 'Calle 1',
      };
      expect(validarFormularioUsuario(datos, { passwordRequerida: false })).toEqual({});
    });
    it('el checkout pide todos los datos de la cita', () => {
      const errores = validarFormularioCheckout({}, new Date(2026, 9, 12));
      ['nombre', 'apellidos', 'correo', 'telefono', 'fecha', 'hora', 'tatuadorId', 'zonaCuerpo'].forEach((c) => {
        expect(errores[c]).toBeDefined();
      });
    });
  });
});
