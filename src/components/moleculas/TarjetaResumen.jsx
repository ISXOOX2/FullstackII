import { Card } from 'react-bootstrap';

/** Tarjeta de una cifra del dashboard (título, valor grande y nota opcional). */
export default function TarjetaResumen({ titulo, valor, nota, destacada = false }) {
  return (
    <Card className={`tarjeta-resumen h-100 ${destacada ? 'tarjeta-resumen-alerta' : ''}`}>
      <Card.Body>
        <p className="small text-uppercase text-muted mb-1">{titulo}</p>
        <p className="valor-resumen mb-0">{valor}</p>
        {nota && <small className="text-muted">{nota}</small>}
      </Card.Body>
    </Card>
  );
}
