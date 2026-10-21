import { Form } from 'react-bootstrap';

/**
 * Campo de formulario reutilizable: etiqueta + control + mensaje de error.
 *
 * Props:
 *  - id, etiqueta : identificador y texto de la etiqueta (accesible: <label for=id>)
 *  - error        : texto del error; si viene vacío no se muestra nada (renderizado condicional)
 *  - tipo         : 'text' (por defecto), 'email', 'password', 'date', 'number', 'select', 'textarea'
 *  - opcional     : agrega "(opcional)" a la etiqueta
 *  - ayuda        : texto de apoyo bajo el campo
 *  - children     : las <option> cuando tipo es 'select'
 */
export default function CampoFormulario({
  id,
  etiqueta,
  error = '',
  tipo = 'text',
  opcional = false,
  ayuda = '',
  children,
  ...resto
}) {
  const Control = tipo === 'select' ? Form.Select : Form.Control;
  const propsControl = tipo === 'select' ? {} : { type: tipo === 'textarea' ? undefined : tipo };
  if (tipo === 'textarea') propsControl.as = 'textarea';

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label className="etiqueta-campo">
        {etiqueta}
        {opcional && <span className="text-muted fw-normal"> (opcional)</span>}
      </Form.Label>
      <Control isInvalid={Boolean(error)} {...propsControl} {...resto}>
        {children}
      </Control>
      {ayuda && !error && <Form.Text muted>{ayuda}</Form.Text>}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
