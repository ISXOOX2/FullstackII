// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • ORGANISMO: el cliente envía su propia idea: nombre, correo, zona (lista desplegable),
//   la descripción y, si quiere, una imagen de referencia desde su dispositivo.
// • Validación en tiempo real con useFormulario + validarFormularioProyecto.
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioProyecto } from '../../utils/validaciones.js';
import { leerImagen } from '../../utils/imagenes.js';
import { LADOS_CUERPO, ZONAS_CUERPO } from '../../data/estudio.js';

/** Props: valoresIniciales ({ nombre, correo } del usuario conectado) y onEnviar(datos). */
export default function FormularioProyecto({ valoresIniciales, onEnviar }) {
  const f = useFormulario({ zonaCuerpo: '', lado: '', idea: '', ...valoresIniciales }, validarFormularioProyecto);
  const [imagen, setImagen] = useState('');
  const [errorImagen, setErrorImagen] = useState('');

  const elegirImagen = async (evento) => {
    const { dataUrl, error } = await leerImagen(evento.target.files[0]);
    setErrorImagen(error);
    setImagen(dataUrl);
    if (error) evento.target.value = '';
  };

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar() || errorImagen) return;
    onEnviar({ ...f.valores, imagen });
  };

  const p = (campo) => ({
    name: campo, value: f.valores[campo], onChange: f.manejarCambio, onBlur: f.manejarBlur, error: f.visibles[campo],
  });

  return (
    <Form onSubmit={enviar} noValidate aria-label="Enviar mi proyecto">
      <Row>
        <Col md={6}><CampoFormulario id="p-nombre" etiqueta="Nombre" autoComplete="name" maxLength={80} {...p('nombre')} /></Col>
        <Col md={6}><CampoFormulario id="p-correo" etiqueta="Correo electrónico" autoComplete="email" tipo="email" {...p('correo')} /></Col>
        <Col md={6}>
          <CampoFormulario id="p-zona" etiqueta="Zona del cuerpo" tipo="select" {...p('zonaCuerpo')}>
            <option value="">Elige la zona</option>
            {ZONAS_CUERPO.map((z) => <option key={z} value={z}>{z}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={6}>
          <CampoFormulario id="p-lado" etiqueta="Lado" tipo="select" opcional {...p('lado')}>
            <option value="">Sin preferencia</option>
            {LADOS_CUERPO.map((l) => <option key={l} value={l}>{l}</option>)}
          </CampoFormulario>
        </Col>
        <Col xs={12}>
          <CampoFormulario
            id="p-idea" etiqueta="Tu idea" tipo="textarea" rows={4} maxLength={600}
            placeholder="Ej: una golondrina con el nombre de mi abuela, en línea fina, de unos 8 cm"
            ayuda={`${f.valores.idea.length}/600`} {...p('idea')}
          />
        </Col>
        <Col xs={12}>
          <Form.Group className="mb-3" controlId="p-imagen">
            <Form.Label className="etiqueta-campo">
              Imagen de referencia <span className="text-muted fw-normal">(opcional)</span>
            </Form.Label>
            <Form.Control type="file" accept="image/jpeg,image/png,image/webp" onChange={elegirImagen} isInvalid={Boolean(errorImagen)} />
            {errorImagen
              ? <Form.Control.Feedback type="invalid">{errorImagen}</Form.Control.Feedback>
              : <Form.Text muted>Un boceto, una foto o una captura. JPG, PNG o WEBP de hasta 1 MB.</Form.Text>}
          </Form.Group>
          {imagen && <img src={imagen} alt="Vista previa de tu referencia" className="vista-previa mb-3" />}
        </Col>
      </Row>
      <Button type="submit" variant="dark" size="lg">Enviar mi proyecto</Button>
    </Form>
  );
}
