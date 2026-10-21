import { Spinner } from 'react-bootstrap';

/** ÁTOMO · Indicador de carga (se muestra mientras se descarga una página del panel). */
export default function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className="text-center py-5" role="status">
      <Spinner animation="border" size="sm" className="me-2" />
      {texto}
    </div>
  );
}
