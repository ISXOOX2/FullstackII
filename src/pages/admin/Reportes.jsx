import { Col, ProgressBar, Row, Table } from 'react-bootstrap';
import {
  ordenesPorEstado, productosMasReservados, resumenGeneral, ventasPorCategoria, ventasPorMes,
} from '../../services/reportesService.js';
import { formatoCLP } from '../../utils/formato.js';

/** Reportes simples calculados con las órdenes pagadas (tablas con barras de proporción de Bootstrap). */
export default function Reportes() {
  const resumen = resumenGeneral();
  const porCategoria = ventasPorCategoria();
  const maxCategoria = Math.max(1, ...porCategoria.map((f) => f.monto));
  const masReservados = productosMasReservados(5);
  const porEstado = ordenesPorEstado();
  const porMes = ventasPorMes();

  return (
    <>
      <h1 className="titulo-seccion">Reportes</h1>
      <p className="text-muted">Ingresos totales: <strong>{formatoCLP(resumen.ingresos)}</strong> en {resumen.ordenesPagadas} órdenes pagadas.</p>
      <Row className="g-4">
        <Col xl={6}>
          <h2 className="h5">Ventas por estilo</h2>
          <Table size="sm" className="align-middle">
            <thead><tr><th scope="col">Estilo</th><th scope="col" className="text-center">Unidades</th><th scope="col" className="columna-monto">Monto</th></tr></thead>
            <tbody>
              {porCategoria.map((f) => (
                <tr key={f.categoriaId}>
                  <td>{f.categoria}</td>
                  <td className="text-center">{f.unidades}</td>
                  <td>
                    <ProgressBar now={(f.monto / maxCategoria) * 100} variant="dark" className="barra-reporte" aria-label={`Proporción de ventas de ${f.categoria}`} />
                    <small>{formatoCLP(f.monto)}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col xl={6}>
          <h2 className="h5">Diseños más reservados</h2>
          <Table size="sm">
            <thead><tr><th scope="col">Diseño</th><th scope="col" className="text-center">Unidades</th><th scope="col" className="text-end">Monto</th></tr></thead>
            <tbody>
              {masReservados.map((f) => (
                <tr key={f.nombre}><td>{f.nombre}</td><td className="text-center">{f.unidades}</td><td className="text-end">{formatoCLP(f.monto)}</td></tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col xl={6}>
          <h2 className="h5">Órdenes por estado</h2>
          <Table size="sm">
            <tbody>
              {Object.entries(porEstado).map(([estado, cantidad]) => (
                <tr key={estado}><td>{estado}</td><td className="text-end">{cantidad}</td></tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col xl={6}>
          <h2 className="h5">Ingresos por mes</h2>
          <Table size="sm">
            <thead><tr><th scope="col">Mes</th><th scope="col" className="text-center">Órdenes</th><th scope="col" className="text-end">Monto</th></tr></thead>
            <tbody>
              {porMes.map((f) => (
                <tr key={f.mes}><td>{f.mes}</td><td className="text-center">{f.ordenes}</td><td className="text-end">{formatoCLP(f.monto)}</td></tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
