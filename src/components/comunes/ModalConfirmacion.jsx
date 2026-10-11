import { Button, Modal } from 'react-bootstrap';

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
        <Button variant="outline-dark" onClick={onCancelar}>Cancelar</Button>
        <Button variant={variante} onClick={onConfirmar}>{textoConfirmar}</Button>
      </Modal.Footer>
    </Modal>
  );
}
