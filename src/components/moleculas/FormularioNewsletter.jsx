import { Button, Form, InputGroup } from 'react-bootstrap';
import useFormulario from '../../hooks/useFormulario.js';
import { validarCorreo } from '../../utils/validaciones.js';
import { useAvisos } from '../../context/AvisosContext.jsx';

const validar = (datos) => {
  const error = validarCorreo(datos.correo);
  return error ? { correo: error } : {};
};

/** Suscripción al boletín (solo valida el correo y muestra un aviso; no envía nada). */
export default function FormularioNewsletter() {
  const f = useFormulario({ correo: '' }, validar);
  const { mostrar } = useAvisos();

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    mostrar('¡Listo! Te suscribiste al boletín de Forever Ink.');
    f.reiniciar();
  };

  return (
    <Form onSubmit={enviar} noValidate aria-label="Suscripción al boletín">
      <Form.Label htmlFor="correo-boletin" className="etiqueta-campo">Recibe novedades y diseños nuevos</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          id="correo-boletin"
          name="correo"
          type="email"
          placeholder="tucorreo@gmail.com"
          value={f.valores.correo}
          onChange={f.manejarCambio}
          onBlur={f.manejarBlur}
          isInvalid={Boolean(f.visibles.correo)}
        />
        <Button type="submit" variant="dark">Suscribirme</Button>
        {f.visibles.correo && <Form.Control.Feedback type="invalid">{f.visibles.correo}</Form.Control.Feedback>}
      </InputGroup>
    </Form>
  );
}
