import { Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioInsumo } from '../../utils/validaciones.js';
import { TIPOS_INSUMO, siguienteCodigoInsumo } from '../../services/insumosService.js';

const VACIO = { nombre: '', tipo: '', unidad: '', stock: '', stockCritico: '' };

/**
 * ORGANISMO: formulario para crear o editar un insumo del estudio.
 * Props: inicial (insumo a editar o null), onEnviar(valores), onCancelar.
 */
export default function FormularioInsumo({ inicial = null, onEnviar, onCancelar }) {
  const partida = inicial
    ? Object.fromEntries(Object.keys(VACIO).map((k) => [k, String(inicial[k] ?? '')]))
    : VACIO;
  const f = useFormulario(partida, validarFormularioInsumo);
  const codigo = inicial ? inicial.codigo : siguienteCodigoInsumo();

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    onEnviar(f.valores);
  };

  const p = (campo) => ({
    name: campo, value: f.valores[campo], onChange: f.manejarCambio, onBlur: f.manejarBlur, error: f.visibles[campo],
  });

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de insumo">
      <Row className="g-2">
        <Col md={2}>
          <CampoFormulario id="i-codigo" etiqueta="Código" value={codigo} readOnly ayuda="Automático" />
        </Col>
        <Col md={5}><CampoFormulario id="i-nombre" etiqueta="Nombre" maxLength={100} {...p('nombre')} /></Col>
        <Col md={3}>
          <CampoFormulario id="i-tipo" etiqueta="Tipo" tipo="select" {...p('tipo')}>
            <option value="">Selecciona</option>
            {TIPOS_INSUMO.map((t) => <option key={t} value={t}>{t}</option>)}
          </CampoFormulario>
        </Col>
        <Col md={2}><CampoFormulario id="i-unidad" etiqueta="Unidad" placeholder="cajas" maxLength={30} {...p('unidad')} /></Col>
        <Col xs={6} md={3}><CampoFormulario id="i-stock" etiqueta="Stock" tipo="number" min={0} step={1} {...p('stock')} /></Col>
        <Col xs={6} md={3}>
          <CampoFormulario
            id="i-critico" etiqueta="Stock crítico" tipo="number" min={0} step={1}
            ayuda="Se alerta cuando el stock es igual o menor." {...p('stockCritico')}
          />
        </Col>
      </Row>
      <div className="d-flex gap-2">
        <Button type="submit" variant="dark">{inicial ? 'Guardar cambios' : 'Agregar insumo'}</Button>
        {inicial && <Button variant="outline-dark" onClick={onCancelar}>Cancelar</Button>}
      </div>
    </Form>
  );
}
