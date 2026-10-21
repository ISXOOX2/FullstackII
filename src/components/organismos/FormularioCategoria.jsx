import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../hooks/useFormulario.js';
import { validarFormularioCategoria } from '../../utils/validaciones.js';

/** Formulario de categoría (estilo). onEnviar(valores) -> '' o mensaje de error. */
export default function FormularioCategoria({ inicial = null, onEnviar, onCancelar }) {
  const f = useFormulario(
    { nombre: inicial?.nombre ?? '', descripcion: inicial?.descripcion ?? '' },
    validarFormularioCategoria,
  );
  const [errorGeneral, setErrorGeneral] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    setErrorGeneral(onEnviar(f.valores) || '');
  };

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de categoría">
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}
      <CampoFormulario
        id="cat-nombre" etiqueta="Nombre" name="nombre" maxLength={50}
        value={f.valores.nombre} onChange={f.manejarCambio} onBlur={f.manejarBlur} error={f.visibles.nombre}
      />
      <CampoFormulario
        id="cat-descripcion" etiqueta="Descripción" tipo="textarea" rows={3} name="descripcion" maxLength={200} opcional
        value={f.valores.descripcion} onChange={f.manejarCambio} onBlur={f.manejarBlur} error={f.visibles.descripcion}
      />
      <div className="d-flex gap-2">
        <Button type="submit" variant="dark">Guardar</Button>
        {onCancelar && <Button variant="outline-dark" onClick={onCancelar}>Cancelar</Button>}
      </div>
    </Form>
  );
}
