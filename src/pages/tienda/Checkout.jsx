import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import FormularioCheckout from '../../components/tienda/FormularioCheckout.jsx';
import ResumenOrden from '../../components/tienda/ResumenOrden.jsx';
import Migas from '../../components/comunes/Migas.jsx';
import { useCarrito } from '../../context/CarritoContext.jsx';
import { useSesion } from '../../context/SesionContext.jsx';
import { actualizarDatosOrden, crearOrden, marcarPagada, marcarRechazada, obtenerOrden } from '../../services/ordenesService.js';
import { descontarCupos, obtenerProducto } from '../../services/productosService.js';
import { pagosService } from '../../services/pagosService.js';

/** Valores con los que se pre-llena el formulario: orden anterior (reintento) o datos del usuario. */
function valoresDePartida(usuario, ordenAnterior) {
  if (ordenAnterior) {
    return {
      ...ordenAnterior.cliente,
      ...ordenAnterior.cita,
      tatuadorId: String(ordenAnterior.cita.tatuadorId),
      hora: '',
      resultadoPago: 'aprobado',
    };
  }
  return {
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    telefono: usuario?.telefono ?? '',
    tatuadorId: '',
    fecha: '',
    hora: '',
    zonaCuerpo: '',
    indicaciones: '',
    resultadoPago: 'aprobado',
  };
}

export default function Checkout() {
  const { items, total, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const ordenId = ubicacion.state?.ordenId ?? null; // viene del botón "Volver a realizar el pago"
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [ordenAnterior] = useState(() => (ordenId ? obtenerOrden(ordenId) : null));
  const [inicial] = useState(() => valoresDePartida(usuario, ordenAnterior));

  if (items.length === 0 && !procesando) return <Navigate to="/carrito" replace />;

  const pagar = async (v) => {
    setError('');
    // Regla: se revisa el stock real justo antes de pagar.
    const sinCupos = items.find((i) => {
      const actual = obtenerProducto(i.productoId);
      return !actual || actual.stock < i.cantidad;
    });
    if (sinCupos) {
      setError(`Ya no quedan cupos suficientes de «${sinCupos.nombre}». Ajusta tu reserva e inténtalo de nuevo.`);
      return;
    }

    setProcesando(true);
    const datos = {
      cliente: { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim(), telefono: v.telefono.trim() },
      cita: { fecha: v.fecha, hora: v.hora, tatuadorId: Number(v.tatuadorId), zonaCuerpo: v.zonaCuerpo.trim(), indicaciones: v.indicaciones.trim() },
      items: items.map((i) => ({
        productoId: i.productoId, nombre: i.nombre, imagen: i.imagen, categoriaId: i.categoriaId, precio: i.precio, cantidad: i.cantidad,
      })),
    };
    // Si es un reintento se reutiliza la misma orden; si no, se crea una nueva en estado Pendiente.
    const orden = ordenId ? actualizarDatosOrden(ordenId, datos) : crearOrden({ usuarioId: usuario?.id ?? null, ...datos });

    const respuesta = await pagosService.procesar({ total: orden.total, resultado: v.resultadoPago });
    if (respuesta.aprobado) {
      marcarPagada(orden.id);
      descontarCupos(datos.items);
      vaciar();
      navegar(`/compra-exitosa/${orden.id}`, { replace: true });
    } else {
      marcarRechazada(orden.id);
      navegar(`/pago-fallido/${orden.id}`, { replace: true });
    }
  };

  return (
    <Container className="py-4">
      <Migas items={[{ texto: 'Home', to: '/' }, { texto: 'Mi reserva', to: '/carrito' }, { texto: 'Confirmar y pagar' }]} />
      <h1 className="titulo-seccion">Confirmar y pagar</h1>
      {ordenAnterior && (
        <Alert variant="warning">Estás reintentando el pago de la orden N° {ordenAnterior.numero}. Revisa tus datos y vuelve a pagar.</Alert>
      )}
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Row className="g-5">
        <Col lg={7}>
          <FormularioCheckout valoresIniciales={inicial} total={total} ordenId={ordenId} procesando={procesando} onPagar={pagar} />
        </Col>
        <Col lg={5}>
          <ResumenOrden items={items} total={total} />
        </Col>
      </Row>
    </Container>
  );
}
