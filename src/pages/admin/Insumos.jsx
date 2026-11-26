import { useState } from 'react';
import { Badge, Button, Card, Form, Table } from 'react-bootstrap';
import AlertaStockCritico from '../../components/moleculas/AlertaStockCritico.jsx';
import ModalConfirmacion from '../../components/moleculas/ModalConfirmacion.jsx';
import FormularioInsumo from '../../components/organismos/FormularioInsumo.jsx';
import {
  actualizarInsumo, crearInsumo, eliminarInsumo, esInsumoCritico, insumosCriticos, listarInsumos,
} from '../../services/insumosService.js';
import { mensajeDeError, USAR_API } from '../../services/api.js';
import { eliminarInsumoApi, guardarInsumoApi } from '../../services/adminApi.js';
import { formatoCLP } from '../../utils/formato.js';

/**
 * Mantenedor de insumos (solo administrador): lo que el estudio usa para tatuar y SÍ se acaba.
 * Muestra la alerta de stock crítico, permite crear, editar y eliminar, y filtrar los críticos.
 */
export default function Insumos({ mostrarAviso }) {
  const [version, setVersion] = useState(0); // al cambiar, la lista se vuelve a leer de la base
  const [editando, setEditando] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [soloCriticos, setSoloCriticos] = useState(false);

  const insumos = listarInsumos().filter((i) => !soloCriticos || esInsumoCritico(i));

  const guardar = async (valores) => {
    if (USAR_API) {
      // Con backend: POST o PUT en ms-catalogo (el código IN-### lo asigna el servidor)
      try {
        await guardarInsumoApi(editando, valores);
      } catch (e) {
        mostrarAviso(mensajeDeError(e), 'danger');
        return;
      }
      mostrarAviso(editando ? `«${valores.nombre}» se actualizó.` : `«${valores.nombre}» se agregó al inventario.`);
    } else if (editando) {
      actualizarInsumo(editando.id, valores);
      mostrarAviso(`«${valores.nombre}» se actualizó.`);
    } else {
      crearInsumo(valores);
      mostrarAviso(`«${valores.nombre}» se agregó al inventario.`);
    }
    setEditando(null);
    setVersion(version + 1);
  };

  const confirmarEliminar = async () => {
    if (USAR_API) {
      try {
        await eliminarInsumoApi(aEliminar.id);
      } catch (e) {
        mostrarAviso(mensajeDeError(e), 'danger');
        setAEliminar(null);
        return;
      }
    } else {
      eliminarInsumo(aEliminar.id);
    }
    mostrarAviso(`«${aEliminar.nombre}» fue eliminado.`, 'secondary');
    setAEliminar(null);
    setVersion(version + 1);
  };

  return (
    <>
      <h1 className="titulo-seccion">Insumos</h1>
      <p className="text-muted">
        Materiales del estudio y artículos de la Tienda. A diferencia de los diseños, los insumos se acaban:
        cuando llegan al stock crítico aparecen en la alerta. Los marcados «A la venta» los compran los clientes
        y su stock baja con cada compra pagada.
      </p>
      <AlertaStockCritico insumos={insumosCriticos()} enlazar={false} />

      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h2" className="h5">{editando ? `Editar «${editando.nombre}»` : 'Nuevo insumo'}</Card.Title>
          {/* key: al cambiar de insumo a editar, el formulario parte con los datos nuevos */}
          <FormularioInsumo
            key={`${editando?.id ?? 'nuevo'}-${version}`}
            inicial={editando}
            onEnviar={guardar}
            onCancelar={() => setEditando(null)}
          />
        </Card.Body>
      </Card>

      <Form.Check
        id="solo-insumos-criticos" type="switch" className="mb-3" label="Mostrar solo stock crítico"
        checked={soloCriticos} onChange={(e) => setSoloCriticos(e.target.checked)}
      />
      <div className="table-responsive">
        <Table hover size="sm" className="align-middle" data-version={version}>
          <thead>
            <tr>
              <th scope="col">Código</th><th scope="col">Insumo</th><th scope="col">Tipo</th>
              <th scope="col" className="text-center">Stock</th><th scope="col" className="text-center">Crítico</th><th scope="col">Venta</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((i) => (
              <tr key={i.id} className={esInsumoCritico(i) ? 'fila-critica' : ''}>
                <td>{i.codigo}</td>
                <td>{i.nombre}</td>
                <td>{i.tipo}</td>
                <td className="text-center">
                  {i.stock} {i.unidad} {esInsumoCritico(i) && <Badge bg="warning" text="dark">Crítico</Badge>}
                </td>
                <td className="text-center">{i.stockCritico}</td>
                <td>{i.aLaVenta ? <Badge bg="dark">{formatoCLP(i.precio)}</Badge> : <span className="text-muted small">Uso interno</span>}</td>
                <td className="text-nowrap">
                  <Button variant="link" className="p-0 me-3 align-baseline" onClick={() => setEditando(i)}>Editar</Button>
                  <Button variant="link" className="text-danger p-0 align-baseline" onClick={() => setAEliminar(i)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ModalConfirmacion
        show={Boolean(aEliminar)}
        titulo="Eliminar insumo"
        mensaje={aEliminar && `¿Seguro que quieres eliminar «${aEliminar.nombre}»?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  );
}
