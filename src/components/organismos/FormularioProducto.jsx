import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioProducto } from '../../utils/validaciones.js';
import { IMAGENES_DISENO } from '../../data/imagenes.js';
import { TAMANO_MAX_CM, TAMANO_MIN_CM } from '../../data/estudio.js';
import { siguienteCodigoProducto } from '../../services/productosService.js';

const VACIO = {
  codigo: '', nombre: '', descripcion: '', categoriaId: '', precio: '', precioOferta: '',
  anchoCm: '', altoCm: '', duracionHoras: '', zonas: '', nivelDolor: '2', colorTinta: 'Negro', destacado: false,
  imagen: IMAGENES_DISENO[0].valor,
};

/** Formulario del mantenedor de productos (crear y editar). onEnviar(valores) -> '' o mensaje de error. */
export default function FormularioProducto({ inicial = null, categorias, onEnviar }) {
  const partida = inicial
    ? Object.fromEntries(Object.keys(VACIO).map((k) => [k, inicial[k] ?? VACIO[k]]))
    : VACIO;
  // El código lo asigna el sistema: al crear se muestra el siguiente; al editar, el que ya tiene.
  const codigo = inicial ? inicial.codigo : siguienteCodigoProducto();
  const f = useFormulario(
    { ...partida, codigo, categoriaId: String(partida.categoriaId ?? '') },
    validarFormularioProducto,
  );
  const [errorGeneral, setErrorGeneral] = useState('');

  const enviar = async (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    setErrorGeneral((await onEnviar(f.valores)) || ''); // await: puede ir a la API
  };

  const p = (campo) => ({
    name: campo, value: f.valores[campo] ?? '', onChange: f.manejarCambio, onBlur: f.manejarBlur, error: f.visibles[campo],
  });

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de diseño">
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}
      <Row>
        <Col md={4}>
          <CampoFormulario
            id="p-codigo" etiqueta="Código" readOnly {...p('codigo')}
            ayuda={inicial ? 'El código no se puede cambiar.' : 'Se asigna automáticamente.'}
          />
        </Col>
        <Col md={8}><CampoFormulario id="p-nombre" etiqueta="Nombre" maxLength={100} {...p('nombre')} /></Col>
        <Col xs={12}><CampoFormulario id="p-descripcion" etiqueta="Descripción" tipo="textarea" rows={3} maxLength={500} opcional {...p('descripcion')} /></Col>
        <Col md={4}>
          <CampoFormulario id="p-categoria" etiqueta="Estilo (categoría)" tipo="select" {...p('categoriaId')}>
            <option value="">Selecciona un estilo</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={4}><CampoFormulario id="p-precio" etiqueta="Precio (CLP)" tipo="number" min={0} {...p('precio')} /></Col>
        <Col md={4}><CampoFormulario id="p-oferta" etiqueta="Precio de oferta" tipo="number" min={0} opcional {...p('precioOferta')} /></Col>
        {/* Tamaño en dos campos numéricos: ancho y alto, siempre en centímetros */}
        <Col xs={6} md={2}><CampoFormulario id="p-ancho" etiqueta="Ancho (cm)" tipo="number" min={TAMANO_MIN_CM} max={TAMANO_MAX_CM} step={0.5} {...p('anchoCm')} /></Col>
        <Col xs={6} md={2}><CampoFormulario id="p-alto" etiqueta="Alto (cm)" tipo="number" min={TAMANO_MIN_CM} max={TAMANO_MAX_CM} step={0.5} {...p('altoCm')} /></Col>
        <Col md={4}><CampoFormulario id="p-duracion" etiqueta="Duración (horas)" tipo="number" min={0.5} step={0.5} opcional {...p('duracionHoras')} /></Col>
        <Col md={4}><CampoFormulario id="p-zonas" etiqueta="Zonas recomendadas" opcional {...p('zonas')} /></Col>
        <Col md={4}>
          <CampoFormulario id="p-dolor" etiqueta="Nivel de dolor" tipo="select" {...p('nivelDolor')}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} de 5</option>)}
          </CampoFormulario>
        </Col>
        <Col md={4}>
          <CampoFormulario id="p-tinta" etiqueta="Tinta" tipo="select" {...p('colorTinta')}>
            {['Negro', 'Gris', 'Color'].map((t) => <option key={t} value={t}>{t}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={8}>
          <CampoFormulario id="p-imagen" etiqueta="Imagen del diseño" tipo="select" {...p('imagen')}>
            {IMAGENES_DISENO.map((i) => <option key={i.valor} value={i.valor}>{i.etiqueta}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <Form.Check
            id="p-destacado" type="switch" label="Mostrar en destacados" name="destacado"
            checked={Boolean(f.valores.destacado)} onChange={f.manejarCambio}
          />
        </Col>
      </Row>
      <Button type="submit" variant="dark">Guardar diseño</Button>
    </Form>
  );
}
