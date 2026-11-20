import { Link, Navigate } from 'react-router-dom';
import { Col, Row, Table } from 'react-bootstrap';
import TarjetaResumen from '../../components/moleculas/TarjetaResumen.jsx';
import AlertaStockCritico from '../../components/moleculas/AlertaStockCritico.jsx';
import InsigniaEstado from '../../components/atomos/InsigniaEstado.jsx';
import { resumenGeneral } from '../../services/reportesService.js';
import { insumosCriticos } from '../../services/insumosService.js';
import { agendaPorTatuador, listarOrdenes, ordenesConSolicitudPendiente } from '../../services/ordenesService.js';
import { DIAS_ALERTA_AGENDA } from '../../data/estudio.js';
import { formatoCLP, formatoFecha } from '../../utils/formato.js';

export default function Dashboard({ usuario }) {
  // El vendedor no ve el dashboard: va directo a las órdenes.
  if (usuario.tipo === 'Vendedor') return <Navigate to="/admin/ordenes" replace />;

  const resumen = resumenGeneral();
  const ultimas = listarOrdenes().slice(0, 5);
  const solicitudes = ordenesConSolicitudPendiente();
  const agenda = agendaPorTatuador();
  const conPocasHoras = agenda.filter((a) => a.pocas);

  return (
    <>
      <h1 className="titulo-seccion">Dashboard</h1>
      <AlertaStockCritico insumos={insumosCriticos()} />
      {conPocasHoras.length > 0 && (
        <div className="alert alert-warning" role="status">
          <strong>Pocas horas disponibles</strong> en los próximos {DIAS_ALERTA_AGENDA} días de atención:{' '}
          {conPocasHoras.map((a) => `${a.nombre} (${a.libres} libres)`).join(', ')}.
        </div>
      )}
      {solicitudes.length > 0 && (
        <div className="alert alert-warning" role="status">
          Tienes <strong>{solicitudes.length}</strong> solicitud(es) de reembolso o cambio de fecha por revisar.{' '}
          <Link to="/admin/ordenes" state={{ filtro: 'solicitud' }}>Ver órdenes</Link>
        </div>
      )}
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        <Col><TarjetaResumen titulo="Órdenes pagadas" valor={resumen.ordenesPagadas} nota={`${resumen.ordenesTotales} órdenes en total`} /></Col>
        <Col><TarjetaResumen titulo="Ingresos" valor={formatoCLP(resumen.ingresos)} nota={`Ticket promedio ${formatoCLP(resumen.ticketPromedio)}`} /></Col>
        <Col><TarjetaResumen titulo="Diseños" valor={resumen.productos} nota="en el catálogo" /></Col>
        <Col><TarjetaResumen titulo="Insumos críticos" valor={resumen.insumosCriticos} nota="por reponer" destacada={resumen.insumosCriticos > 0} /></Col>
        <Col><TarjetaResumen titulo="Usuarios" valor={resumen.usuarios} nota={`${resumen.clientes} clientes`} /></Col>
      </Row>

      <h2 className="h5">Agenda de los próximos {DIAS_ALERTA_AGENDA} días de atención</h2>
      <div className="table-responsive mb-4">
        <Table size="sm" className="align-middle">
          <thead><tr><th scope="col">Tatuador/a</th><th scope="col" className="text-end">Horas libres</th><th scope="col" className="text-end">Ocupación</th></tr></thead>
          <tbody>
            {agenda.map((a) => (
              <tr key={a.tatuadorId} className={a.pocas ? 'fila-critica' : ''}>
                <td>{a.nombre}</td>
                <td className="text-end">{a.libres} de {a.total}</td>
                <td className="text-end">{Math.round(((a.total - a.libres) / a.total) * 100)} %</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

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
