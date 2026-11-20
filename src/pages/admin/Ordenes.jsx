import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Form, Table } from 'react-bootstrap';
import InsigniaEstado from '../../components/atomos/InsigniaEstado.jsx';
import MensajeVacio from '../../components/moleculas/MensajeVacio.jsx';
import { ESTADOS, NOMBRE_SOLICITUD, listarOrdenes, tieneSolicitudPendiente } from '../../services/ordenesService.js';
import { nombreTatuador } from '../../data/tatuadores.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';

export default function Ordenes() {
  // Si llega desde el aviso del Dashboard, parte filtrando las solicitudes pendientes.
  const { state } = useLocation();
  const [estado, setEstado] = useState(state?.filtro || '');
  // Además de los estados de la orden, se puede filtrar las que tienen una solicitud por revisar.
  const ordenes = listarOrdenes().filter((o) => {
    if (estado === 'solicitud') return tieneSolicitudPendiente(o);
    return !estado || o.estado === estado;
  });

  return (
    <>
      <h1 className="titulo-seccion">Órdenes</h1>
      <Form.Group controlId="filtro-estado" className="mb-3 campo-filtro">
        <Form.Label className="etiqueta-campo">Filtrar por estado</Form.Label>
        <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos</option>
          {Object.values(ESTADOS).map((e) => <option key={e} value={e}>{e}</option>)}
          <option value="solicitud">Con solicitud pendiente</option>
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
                  <td>{o.cita ? `${formatoFecha(o.cita.fecha)} ${o.cita.hora}` : 'Solo tienda'}</td>
                  <td>{o.cita ? nombreTatuador(o.cita.tatuadorId) : '—'}</td>
                  <td className="text-end">{formatoCLP(o.total)}</td>
                  <td>
                    <InsigniaEstado estado={o.estado} />
                    {tieneSolicitudPendiente(o) && (
                      <small className="d-block text-warning-emphasis">{NOMBRE_SOLICITUD[o.solicitud.tipo]} por revisar</small>
                    )}
                  </td>
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
