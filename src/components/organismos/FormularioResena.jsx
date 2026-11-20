// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • ORGANISMO: formulario para dejar una reseña con estrellas (1 a 5), comentario y foto opcional.
// • La foto se elige desde el dispositivo con <input type="file">: se valida tipo y peso y se
//   muestra una vista previa antes de publicar.
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import CampoFormulario from '../moleculas/CampoFormulario.jsx';
import SelectorEstrellas from '../moleculas/SelectorEstrellas.jsx';
import useFormulario from '../../utils/useFormulario.js';
import { validarFormularioResena } from '../../utils/validaciones.js';
import { leerImagen } from '../../utils/imagenes.js';

/** Props: inicial (reseña anterior del cliente o null) y onEnviar({ estrellas, comentario, imagen }). */
export default function FormularioResena({ inicial = null, onEnviar }) {
  const f = useFormulario(
    { estrellas: String(inicial?.estrellas ?? ''), comentario: inicial?.comentario ?? '' },
    validarFormularioResena,
  );
  const [imagen, setImagen] = useState(inicial?.imagen?.startsWith('data:') ? inicial.imagen : '');
  const [errorImagen, setErrorImagen] = useState('');

  const elegirImagen = async (evento) => {
    const { dataUrl, error } = await leerImagen(evento.target.files[0]);
    setErrorImagen(error);
    setImagen(dataUrl);
    if (error) evento.target.value = ''; // limpia el archivo inválido
  };

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar() || errorImagen) return;
    onEnviar({ estrellas: f.valores.estrellas, comentario: f.valores.comentario, imagen });
  };

  return (
    <Form onSubmit={enviar} noValidate aria-label="Escribir una reseña">
      <SelectorEstrellas valor={f.valores.estrellas} onChange={f.manejarCambio} error={f.visibles.estrellas} />
      <CampoFormulario
        id="r-comentario" etiqueta="Tu comentario" tipo="textarea" rows={3} maxLength={400} name="comentario"
        value={f.valores.comentario} onChange={f.manejarCambio} onBlur={f.manejarBlur} error={f.visibles.comentario}
        ayuda={`${f.valores.comentario.length}/400`}
      />
      <Form.Group className="mb-3" controlId="r-imagen">
        <Form.Label className="etiqueta-campo">
          Foto de tu tatuaje <span className="text-muted fw-normal">(opcional)</span>
        </Form.Label>
        <Form.Control type="file" accept="image/jpeg,image/png,image/webp" onChange={elegirImagen} isInvalid={Boolean(errorImagen)} />
        {errorImagen
          ? <Form.Control.Feedback type="invalid">{errorImagen}</Form.Control.Feedback>
          : <Form.Text muted>JPG, PNG o WEBP de hasta 1 MB.</Form.Text>}
      </Form.Group>
      {imagen && <img src={imagen} alt="Vista previa de tu foto" className="vista-previa mb-3" />}
      <Button type="submit" variant="dark">{inicial ? 'Actualizar mi reseña' : 'Publicar reseña'}</Button>
    </Form>
  );
}
