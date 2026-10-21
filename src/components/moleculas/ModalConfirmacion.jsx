import { Modal } from 'react-bootstrap';
import Boton from '../atomos/Boton.jsx';

/** Ventana de confirmación (por ejemplo antes de eliminar). Solo se muestra si show es true. */
export default function ModalConfirmacion({
  show,
  titulo = 'Confirmar acción',
  mensaje,
  textoConfirmar = 'Confirmar',
  variante = 'danger',
  onConfirmar,
  onCancelar,
}) {
  return (
    <Modal show={show} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensaje}</Modal.Body>
      <Modal.Footer>
        <Boton variante="outline-dark" etiqueta="Cancelar" onClick={onCancelar} />
        <Boton variante={variante} etiqueta={textoConfirmar} onClick={onConfirmar} />
      </Modal.Footer>
    </Modal>
  );
}
