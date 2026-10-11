import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Table } from 'react-bootstrap';
import InsigniaEstado from '../../components/comunes/InsigniaEstado.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { ESTADOS, listarOrdenes } from '../../services/ordenesService.js';
import { nombreTatuador } from '../../data/tatuadores.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';

export default function Ordenes() {
  const [estado, setEstado] = useState('');
  const ordenes = listarOrdenes().filter((o) => !estado || o.estado === estado);

  return (
    <>
      <h1 className="titulo-seccion">Órdenes</h1>
      <Form.Group controlId="filtro-estado" className="mb-3" style={{ maxWidth: 260 }}>
        <Form.Label className="etiqueta-campo">Filtrar por estado</Form.Label>
        <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos</option>
          {Object.values(ESTADOS).map((e) => <option key={e} value={e}>{e}</option>)}
        </Form.Select>
      </Form.Group>

      {ordenes.length === 0 ? (
        <MensajeVacio titulo="No hay órdenes con ese estado" />
      ) : (
        <div className="table-responsive">
          <Table hover size="sm" className="align-middle">
            <thead>
              <tr><th scope="col">N° orden</th><th scope="col">Emitida</th><th scope="col">Cliente</th><th scope="col">Cita</th><th scope="col">Tatuador/a</th><th scope="col" className="text-end">Total</th><th scope="col">Estado</th><th scope="col" className="position-relative"><span className="visually-hidden">Detalle</span></th></tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{formatoFecha(o.fecha)}</td>
                  <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                  <td>{formatoFecha(o.cita.fecha)} {o.cita.hora}</td>
                  <td>{nombreTatuador(o.cita.tatuadorId)}</td>
                  <td className="text-end">{formatoCLP(o.total)}</td>
                  <td><InsigniaEstado estado={o.estado} /></td>
                  <td><Link to={`/admin/ordenes/${o.id}`}>Ver detalle</Link></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
