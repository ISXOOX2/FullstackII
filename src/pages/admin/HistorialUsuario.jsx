import { Link, useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import InsigniaEstado from '../../components/comunes/InsigniaEstado.jsx';
import MensajeVacio from '../../components/comunes/MensajeVacio.jsx';
import { historialDeCompras, obtenerUsuario } from '../../services/usuariosService.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';

/** Historial de compras (reservas) de un cliente, visto por el administrador. */
export default function HistorialUsuario() {
  const { id } = useParams();
  const usuario = obtenerUsuario(id);
  if (!usuario) {
    return (
      <MensajeVacio titulo="Ese usuario no existe">
        <Link to="/admin/usuarios" className="btn btn-dark">Volver</Link>
      </MensajeVacio>
    );
  }
  const historial = historialDeCompras(usuario.id);
  return (
    <>
      <h1 className="titulo-seccion">Historial de {usuario.nombre} {usuario.apellidos}</h1>
      {historial.length === 0 ? (
        <MensajeVacio titulo="Este cliente aún no tiene reservas" />
      ) : (
        <div className="table-responsive">
          <Table hover size="sm" className="align-middle">
            <thead><tr><th scope="col">N° orden</th><th scope="col">Emitida</th><th scope="col">Cita</th><th scope="col" className="text-end">Total</th><th scope="col">Estado</th><th scope="col"><span className="visually-hidden">Detalle</span></th></tr></thead>
            <tbody>
              {historial.map((o) => (
                <tr key={o.id}>
                  <td>{o.numero}</td>
                  <td>{formatoFecha(o.fecha)}</td>
                  <td>{formatoFecha(o.cita.fecha)} {o.cita.hora}</td>
                  <td className="text-end">{formatoCLP(o.total)}</td>
                  <td><InsigniaEstado estado={o.estado} /></td>
                  <td><Link to={`/admin/ordenes/${o.id}`}>Ver detalle</Link></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <Link to="/admin/usuarios" className="btn btn-outline-dark mt-3">Volver a usuarios</Link>
    </>
  );
}
