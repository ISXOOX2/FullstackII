import { Link, Navigate } from 'react-router-dom';
import { Col, Row, Table } from 'react-bootstrap';
import TarjetaResumen from '../../components/moleculas/TarjetaResumen.jsx';
import AlertaStockCritico from '../../components/moleculas/AlertaStockCritico.jsx';
import InsigniaEstado from '../../components/atomos/InsigniaEstado.jsx';
import { useSesion } from '../../context/SesionContext.jsx';
import { resumenGeneral } from '../../services/reportesService.js';
import { productosCriticos } from '../../services/productosService.js';
import { listarOrdenes } from '../../services/ordenesService.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';

export default function Dashboard() {
  const { usuario } = useSesion();
  // El vendedor no ve el dashboard: va directo a las órdenes.
  if (usuario.tipo === 'Vendedor') return <Navigate to="/admin/ordenes" replace />;

  const resumen = resumenGeneral();
  const ultimas = listarOrdenes().slice(0, 5);

  return (
    <>
      <h1 className="titulo-seccion">Dashboard</h1>
      <AlertaStockCritico productos={productosCriticos()} puedeEditar />
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col><TarjetaResumen titulo="Órdenes pagadas" valor={resumen.ordenesPagadas} nota={`${resumen.ordenesTotales} órdenes en total`} /></Col>
        <Col><TarjetaResumen titulo="Ingresos" valor={formatoCLP(resumen.ingresos)} nota={`Ticket promedio ${formatoCLP(resumen.ticketPromedio)}`} /></Col>
        <Col><TarjetaResumen titulo="Diseños" valor={resumen.productos} nota="en el catálogo" /></Col>
        <Col><TarjetaResumen titulo="Stock crítico" valor={resumen.productosCriticos} nota="diseños por reponer" destacada={resumen.productosCriticos > 0} /></Col>
        <Col><TarjetaResumen titulo="Usuarios" valor={resumen.usuarios} nota={`${resumen.clientes} clientes`} /></Col>
      </Row>

      <h2 className="h5">Últimas órdenes</h2>
      <div className="table-responsive">
        <Table hover size="sm" className="align-middle">
          <thead><tr><th scope="col">N° orden</th><th scope="col">Fecha</th><th scope="col">Cliente</th><th scope="col" className="text-end">Total</th><th scope="col">Estado</th></tr></thead>
          <tbody>
            {ultimas.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/admin/ordenes/${o.id}`}>{o.numero}</Link></td>
                <td>{formatoFecha(o.fecha)}</td>
                <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                <td className="text-end">{formatoCLP(o.total)}</td>
                <td><InsigniaEstado estado={o.estado} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
