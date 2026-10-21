import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../hooks/useFormulario.js';
import { validarFormularioUsuario } from '../../utils/validaciones.js';
import { REGIONES, comunasDeRegion } from '../../data/regiones.js';
import { TIPOS_USUARIO } from '../../services/usuariosService.js';

/**
 * Formulario de usuario reutilizable. El prop "modo" cambia qué campos se piden:
 *  - 'registro'      : cliente nuevo desde la tienda (confirma correo y contraseña).
 *  - 'admin-nuevo'   : el administrador crea un usuario (elige el tipo).
 *  - 'admin-editar'  : el administrador edita (la contraseña en blanco = no se cambia).
 *  - 'perfil'        : el usuario edita sus propios datos (no puede cambiar RUN ni tipo).
 * Props: modo, inicial (datos de partida) y onEnviar(datos) -> '' si salió bien o mensaje de error.
 */
export default function FormularioUsuario({ modo = 'registro', inicial = null, onEnviar, textoBoton }) {
  const esRegistro = modo === 'registro';
  const esEdicion = modo === 'admin-editar' || modo === 'perfil';
  const pedirTipo = modo === 'admin-nuevo' || modo === 'admin-editar';

  const valoresIniciales = {
    run: inicial?.run ?? '',
    nombre: inicial?.nombre ?? '',
    apellidos: inicial?.apellidos ?? '',
    correo: inicial?.correo ?? '',
    ...(esRegistro ? { confirmarCorreo: '', confirmarPassword: '' } : {}),
    password: '',
    telefono: inicial?.telefono ?? '',
    fechaNacimiento: inicial?.fechaNacimiento ?? '',
    region: inicial?.region ?? '',
    comuna: inicial?.comuna ?? '',
    direccion: inicial?.direccion ?? '',
    ...(pedirTipo ? { tipo: inicial?.tipo ?? 'Cliente' } : {}),
  };

  const validar = (datos) =>
    validarFormularioUsuario(datos, { confirmarCorreo: esRegistro, passwordRequerida: !esEdicion, pedirTipo });

  const f = useFormulario(valoresIniciales, validar);
  const [errorGeneral, setErrorGeneral] = useState('');

  const cambiarRegion = (evento) => {
    f.cambiar('region', evento.target.value);
    f.cambiar('comuna', ''); // al cambiar de región, la comuna anterior ya no corresponde
  };

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    setErrorGeneral(onEnviar(f.valores) || '');
  };

  const comunas = comunasDeRegion(f.valores.region);
  const comunPropiedades = (campo) => ({
    name: campo,
    value: f.valores[campo],
    onChange: f.manejarCambio,
    onBlur: f.manejarBlur,
    error: f.visibles[campo],
  });

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de usuario">
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}
      <Row>
        <Col md={6}>
          <CampoFormulario
            id="u-run" etiqueta="RUN" placeholder="Sin puntos ni guion, ej. 190110222"
            maxLength={9} readOnly={modo === 'perfil'} {...comunPropiedades('run')}
            ayuda="De 7 a 9 caracteres, sin puntos ni guion. Si termina en K, escríbela."
          />
        </Col>
        <Col md={6}>
          <CampoFormulario id="u-fecha" etiqueta="Fecha de nacimiento" tipo="date" opcional {...comunPropiedades('fechaNacimiento')} />
        </Col>
        <Col md={6}>
          <CampoFormulario id="u-nombre" etiqueta="Nombre" maxLength={50} {...comunPropiedades('nombre')} />
        </Col>
        <Col md={6}>
          <CampoFormulario id="u-apellidos" etiqueta="Apellidos" maxLength={100} {...comunPropiedades('apellidos')} />
        </Col>
        <Col md={esRegistro ? 6 : 12}>
          <CampoFormulario
            id="u-correo" etiqueta="Correo electrónico" tipo="email" {...comunPropiedades('correo')}
            ayuda="Dominios permitidos: @duoc.cl, @profesor.duoc.cl y @gmail.com"
          />
        </Col>
        {esRegistro && (
          <Col md={6}>
            <CampoFormulario id="u-confirmar-correo" etiqueta="Confirmar correo" tipo="email" {...comunPropiedades('confirmarCorreo')} />
          </Col>
        )}
        <Col md={esRegistro ? 6 : 12}>
          <CampoFormulario
            id="u-password" etiqueta={esEdicion ? 'Nueva contraseña' : 'Contraseña'} tipo="password"
            autoComplete="new-password" opcional={esEdicion} {...comunPropiedades('password')}
            ayuda="Entre 4 y 10 caracteres, con letras y números."
          />
        </Col>
        {esRegistro && (
          <Col md={6}>
            <CampoFormulario id="u-confirmar-password" etiqueta="Confirmar contraseña" tipo="password" autoComplete="new-password" {...comunPropiedades('confirmarPassword')} />
          </Col>
        )}
        <Col md={6}>
          <CampoFormulario id="u-telefono" etiqueta="Teléfono" tipo="tel" opcional placeholder="+56912345678" {...comunPropiedades('telefono')} />
        </Col>
        {pedirTipo && (
          <Col md={6}>
            <CampoFormulario id="u-tipo" etiqueta="Tipo de usuario" tipo="select" {...comunPropiedades('tipo')}>
              {TIPOS_USUARIO.map((t) => <option key={t} value={t}>{t}</option>)}
            </CampoFormulario>
          </Col>
        )}
        <Col md={6}>
          <CampoFormulario
            id="u-region" etiqueta="Región" tipo="select" name="region" value={f.valores.region}
            onChange={cambiarRegion} onBlur={f.manejarBlur} error={f.visibles.region}
          >
            <option value="">Selecciona una región</option>
            {REGIONES.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={6}>
          <CampoFormulario id="u-comuna" etiqueta="Comuna" tipo="select" disabled={!f.valores.region} {...comunPropiedades('comuna')}>
            <option value="">{f.valores.region ? 'Selecciona una comuna' : 'Primero elige una región'}</option>
            {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
          </CampoFormulario>
        </Col>
        <Col xs={12}>
          <CampoFormulario id="u-direccion" etiqueta="Dirección" maxLength={300} {...comunPropiedades('direccion')} />
        </Col>
      </Row>
      <Button type="submit" variant="dark">
        {textoBoton || (esRegistro ? 'Crear mi cuenta' : 'Guardar cambios')}
      </Button>
    </Form>
  );
}
