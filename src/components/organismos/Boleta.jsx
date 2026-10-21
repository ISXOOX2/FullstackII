import { Table } from 'react-bootstrap';
import InsigniaEstado from '../atomos/InsigniaEstado.jsx';
import Logo from '../atomos/Logo.jsx';
import { ESTUDIO } from '../../data/estudio.js';
import { nombreTatuador } from '../../data/tatuadores.js';
import { formatoCLP, formatoFecha, formatoFechaLarga } from '../../utils/formato.js';

/** Boleta / detalle de una orden. Se usa en la compra exitosa, el pago fallido y el panel admin. */
export default function Boleta({ orden }) {
  const { cliente, cita } = orden;
  return (
    <article className="boleta" aria-label={`Boleta ${orden.numero}`}>
      <header className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <Logo />
          <p className="small text-muted mb-0 mt-2">{ESTUDIO.direccion}<br />{ESTUDIO.telefono}</p>
        </div>
        <div className="text-md-end">
          <p className="mb-1"><strong>Orden N° {orden.numero}</strong></p>
          <p className="mb-1 small">Código: {orden.codigo}</p>
          <p className="mb-1 small">Emitida el {formatoFecha(orden.fecha)}</p>
          <InsigniaEstado estado={orden.estado} />
        </div>
      </header>

      <div className="row g-4 mb-4">
        <section className="col-md-6">
          <h3 className="h6 text-uppercase">Cliente</h3>
          <p className="mb-0">{cliente.nombre} {cliente.apellidos}<br />{cliente.correo}<br />{cliente.telefono}</p>
        </section>
        <section className="col-md-6">
          <h3 className="h6 text-uppercase">Cita</h3>
          <p className="mb-0">
            {formatoFechaLarga(cita.fecha)}, {cita.hora} hrs<br />
            Con {nombreTatuador(cita.tatuadorId)}<br />
            Zona: {cita.zonaCuerpo}
            {cita.indicaciones && <><br />Indicaciones: {cita.indicaciones}</>}
          </p>
        </section>
      </div>

      <div className="table-responsive">
        <Table size="sm" className="align-middle">
          <thead>
            <tr><th scope="col">Diseño</th><th scope="col" className="text-end">Precio</th><th scope="col" className="text-center">Cant.</th><th scope="col" className="text-end">Subtotal</th></tr>
          </thead>
          <tbody>
            {orden.items.map((i) => (
              <tr key={i.productoId}>
                <td>{i.nombre}</td>
                <td className="text-end">{formatoCLP(i.precio)}</td>
                <td className="text-center">{i.cantidad}</td>
                <td className="text-end">{formatoCLP(i.precio * i.cantidad)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><th colSpan={3} className="text-end">Total</th><th className="text-end">{formatoCLP(orden.total)}</th></tr>
          </tfoot>
        </Table>
      </div>
      {orden.metodoPago && <p className="small text-muted mb-0">Método de pago: {orden.metodoPago}</p>}
    </article>
  );
}
