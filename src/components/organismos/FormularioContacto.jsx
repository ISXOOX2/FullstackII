import { Form } from 'react-bootstrap';
import Boton from '../atomos/Boton.jsx';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioContacto } from '../../utils/validaciones.js';

/** Formulario de contacto. Props: onEnviar(valores) se llama solo si todo es válido. */
export default function FormularioContacto({ onEnviar }) {
  const f = useFormulario({ nombre: '', correo: '', comentario: '' }, validarFormularioContacto);

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    onEnviar(f.valores);
    f.reiniciar();
  };

  return (
    <Form onSubmit={enviar} noValidate aria-label="Formulario de contacto">
      <CampoFormulario
        id="contacto-nombre" etiqueta="Nombre" name="nombre" maxLength={100}
        value={f.valores.nombre} onChange={f.manejarCambio} onBlur={f.manejarBlur} error={f.visibles.nombre}
      />
      <CampoFormulario
        id="contacto-correo" etiqueta="Correo electrónico" tipo="email" name="correo"
        value={f.valores.correo} onChange={f.manejarCambio} onBlur={f.manejarBlur} error={f.visibles.correo}
      />
      <CampoFormulario
        id="contacto-comentario" etiqueta="Comentario" tipo="textarea" name="comentario" rows={5} maxLength={500}
        value={f.valores.comentario} onChange={f.manejarCambio} onBlur={f.manejarBlur} error={f.visibles.comentario}
        ayuda={`${f.valores.comentario.length}/500 caracteres`}
      />
      <Boton tipo="submit" etiqueta="Enviar mensaje" />
    </Form>
  );
}
