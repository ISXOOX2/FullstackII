import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import FormularioCheckout from '../../components/organismos/FormularioCheckout.jsx';
import ResumenOrden from '../../components/moleculas/ResumenOrden.jsx';
import Migas from '../../components/moleculas/Migas.jsx';
import { actualizarDatosOrden, crearOrden, marcarPagada, marcarRechazada, obtenerOrden } from '../../services/ordenesService.js';
import { obtenerProducto } from '../../services/productosService.js';
import { descontarStockArticulos, revisarStockArticulos } from '../../services/insumosService.js';
import { esDiseno, tieneReservas } from '../../services/carritoService.js';
import { pagosService } from '../../services/pagosService.js';
import { mensajeDeError, USAR_API } from '../../services/api.js';
import { crearOrdenApi, pagarOrdenApi } from '../../services/reservasApi.js';
import { sincronizarTodo } from '../../services/sincronizacion.js';

/** Valores con los que se pre-llena el formulario: orden anterior (reintento) o datos del usuario. */
function valoresDePartida(usuario, ordenAnterior) {
  if (ordenAnterior) {
    return {
      ...ordenAnterior.cliente,
      ladoCuerpo: '',
      ...ordenAnterior.cita,
      tatuadorId: ordenAnterior.cita ? String(ordenAnterior.cita.tatuadorId) : '',
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
    ladoCuerpo: '',
    indicaciones: '',
    resultadoPago: 'aprobado',
  };
}

/** carrito y usuario llegan por props desde App.jsx. */
export default function Checkout({ carrito, usuario }) {
  const { items, total, vaciar } = carrito;
  const conCita = tieneReservas(items); // con al menos un diseño hay que agendar
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
    // Regla: justo antes de pagar se revisa que los diseños sigan en el catálogo.
    const retirado = items.find((i) => esDiseno(i) && !obtenerProducto(i.productoId));
    if (retirado) {
      setError(`«${retirado.nombre}» ya no está en el catálogo. Quítalo de tu reserva e inténtalo de nuevo.`);
      return;
    }
    // Y que haya stock de los artículos de la tienda (otro cliente pudo comprar el último).
    const sinStock = revisarStockArticulos(items);
    if (sinStock) {
      setError(sinStock);
      return;
    }

    setProcesando(true);
    const datos = {
      cliente: { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim(), telefono: v.telefono.trim() },
      cita: conCita
        ? {
          fecha: v.fecha, hora: v.hora, tatuadorId: Number(v.tatuadorId),
          zonaCuerpo: v.ladoCuerpo ? `${v.zonaCuerpo} (${v.ladoCuerpo.toLowerCase()})` : v.zonaCuerpo,
          indicaciones: v.indicaciones.trim(),
        }
        : null,
      items: items.map((i) => (esDiseno(i)
        ? {
          clave: `d-${i.productoId}`, tipo: 'diseno', productoId: i.productoId, nombre: i.nombre, imagen: i.imagen,
          categoriaId: i.categoriaId, precio: i.precio, cantidad: i.cantidad, anchoCm: i.anchoCm ?? null, altoCm: i.altoCm ?? null,
        }
        : { clave: i.clave, tipo: 'articulo', articuloId: i.articuloId, nombre: i.nombre, imagen: i.imagen, precio: i.precio, cantidad: i.cantidad })),
    };
    if (USAR_API) {
      // Con backend: ms-reservas crea la orden (precios reales de ms-catalogo), valida la hora y,
      // si el pago se aprueba, ocupa la hora y descuenta el stock de la Tienda.
      if (!usuario) {
        setError('Inicia sesión para confirmar tu reserva.');
        setProcesando(false);
        return;
      }
      try {
        const ordenApi = ordenId ? { id: ordenId, total } : await crearOrdenApi(datos);
        const respuesta = await pagosService.procesar({ total: ordenApi.total, resultado: v.resultadoPago });
        const resultado = await pagarOrdenApi(ordenApi.id, respuesta.aprobado);
        await sincronizarTodo(usuario); // trae la orden nueva y el stock actualizado
        if (resultado.estado === 'Pagada') {
          vaciar();
          navegar(`/compra-exitosa/${resultado.id}`, { replace: true });
        } else {
          navegar(`/pago-fallido/${resultado.id}`, { replace: true });
        }
      } catch (e) {
        setError(mensajeDeError(e));
        setProcesando(false);
      }
      return;
    }

    // Si es un reintento se reutiliza la misma orden; si no, se crea una nueva en estado Pendiente.
    const orden = ordenId ? actualizarDatosOrden(ordenId, datos) : crearOrden({ usuarioId: usuario?.id ?? null, ...datos });

    const respuesta = await pagosService.procesar({ total: orden.total, resultado: v.resultadoPago });
    if (respuesta.aprobado) {
      marcarPagada(orden.id);
      descontarStockArticulos(items); // el stock de la tienda solo baja si el pago fue aprobado
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
      <Row className="g-4 g-md-5">
        <Col lg={7}>
          <FormularioCheckout
            valoresIniciales={inicial} total={total} ordenId={ordenId} procesando={procesando} conCita={conCita} onPagar={pagar}
          />
        </Col>
        <Col lg={5}>
          <ResumenOrden items={items} total={total} />
        </Col>
      </Row>
    </Container>
  );
}
