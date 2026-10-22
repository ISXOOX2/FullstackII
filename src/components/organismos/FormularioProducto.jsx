import { useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioProducto } from '../../utils/validaciones.js';
import { IMAGENES_DISENO } from '../../data/imagenes.js';

const VACIO = {
  codigo: '', nombre: '', descripcion: '', categoriaId: '', precio: '', precioOferta: '', stock: '', stockCritico: '',
  tamano: '', duracionHoras: '', zonas: '', nivelDolor: '2', colorTinta: 'Negro', destacado: false,
  imagen: IMAGENES_DISENO[0].valor,
};

/** Formulario del mantenedor de productos (crear y editar). onEnviar(valores) -> '' o mensaje de error. */
export default function FormularioProducto({ inicial = null, categorias, onEnviar }) {
  const partida = inicial
    ? Object.fromEntries(Object.keys(VACIO).map((k) => [k, inicial[k] ?? VACIO[k]]))
    : VACIO;
  const f = useFormulario(
    { ...partida, categoriaId: String(partida.categoriaId ?? '') },
    validarFormularioProducto,
  );
  const [errorGeneral, setErrorGeneral] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    setErrorGeneral(onEnviar(f.valores) || '');
  };

  const p = (campo) => ({
    name: campo, value: f.valores[campo] ?? '', onChange: f.manejarCambio, onBlur: f.manejarBlur, error: f.visibles[campo],
  });

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de diseño">
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}
      <Row>
        <Col md={4}><CampoFormulario id="p-codigo" etiqueta="Código" maxLength={10} {...p('codigo')} /></Col>
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
        <Col md={4}><CampoFormulario id="p-stock" etiqueta="Stock (cupos)" tipo="number" min={0} {...p('stock')} /></Col>
        <Col md={4}><CampoFormulario id="p-critico" etiqueta="Stock crítico" tipo="number" min={0} opcional {...p('stockCritico')} ayuda="Se alerta cuando el stock es igual o menor." /></Col>
        <Col md={4}><CampoFormulario id="p-tamano" etiqueta="Tamaño" placeholder="7 x 6 cm" opcional {...p('tamano')} /></Col>
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
