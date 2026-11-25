package cl.foreverink.reservas.servicio;

import cl.foreverink.reservas.cliente.CatalogoCliente;
import cl.foreverink.reservas.dto.EstadoRequest;
import cl.foreverink.reservas.dto.ItemRequest;
import cl.foreverink.reservas.dto.OrdenDetalle;
import cl.foreverink.reservas.dto.OrdenRequest;
import cl.foreverink.reservas.dto.RespuestaSolicitudRequest;
import cl.foreverink.reservas.dto.SolicitudRequest;
import cl.foreverink.reservas.excepcion.ReglaNegocioException;
import cl.foreverink.reservas.modelo.CambioEstado;
import cl.foreverink.reservas.modelo.ItemOrden;
import cl.foreverink.reservas.modelo.Orden;
import cl.foreverink.reservas.modelo.Solicitud;
import cl.foreverink.reservas.repositorio.CambioEstadoRepository;
import cl.foreverink.reservas.repositorio.OrdenRepository;
import cl.foreverink.reservas.repositorio.SolicitudRepository;
import cl.foreverink.reservas.seguridad.UsuarioAutenticado;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Reglas de negocio de las ordenes:
 *  - los precios se toman de ms-catalogo; con disenos se exige una cita valida y libre;
 *  - pago simulado: si se aprueba, la hora queda ocupada y se descuenta el stock de la Tienda;
 *  - reembolso hasta 48 h antes de la cita (o 10 dias despues de comprar si solo hay articulos);
 *  - cambio de fecha y hora hasta 24 h antes, con justificativo y a una hora libre;
 *  - el Administrador aprueba o rechaza las solicitudes y puede cambiar el estado a mano.
 */
@Service
public class OrdenService {

    public static final int HORAS_ANTICIPACION_REEMBOLSO = 48;
    public static final int HORAS_ANTICIPACION_CAMBIO = 24;
    public static final int DIAS_RETRACTO_TIENDA = 10;
    private static final DateTimeFormatter FORMATO_NUMERO = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final OrdenRepository ordenes;
    private final SolicitudRepository solicitudes;
    private final CambioEstadoRepository historial;
    private final AgendaService agenda;
    private final CatalogoCliente catalogo;

    public OrdenService(OrdenRepository ordenes, SolicitudRepository solicitudes, CambioEstadoRepository historial,
                        AgendaService agenda, CatalogoCliente catalogo) {
        this.ordenes = ordenes;
        this.solicitudes = solicitudes;
        this.historial = historial;
        this.agenda = agenda;
        this.catalogo = catalogo;
    }

    // ── Crear y pagar ──────────────────────────────────────────────────────

    @Transactional
    public Orden crear(OrdenRequest datos, UsuarioAutenticado yo) {
        List<ItemOrden> items = new ArrayList<>();
        List<Map<String, Object>> tienda = null;
        for (ItemRequest item : datos.items()) {
            ItemOrden linea = new ItemOrden();
            linea.setTipo(item.tipo());
            linea.setCantidad(item.cantidad());
            if ("diseno".equals(item.tipo())) {
                if (item.productoId() == null) {
                    throw new ReglaNegocioException("Falta el diseno de una de las lineas.");
                }
                if (item.cantidad() > 5) {
                    throw new ReglaNegocioException("Solo puedes reservar hasta 5 unidades de un mismo diseno.");
                }
                Map<String, Object> diseno = catalogo.diseno(item.productoId());
                Object oferta = diseno.get("precioOferta");
                Object precio = oferta != null ? oferta : diseno.get("precio");
                linea.setProductoId(item.productoId());
                linea.setNombre(String.valueOf(diseno.get("nombre")));
                linea.setPrecio(((Number) precio).intValue());
                linea.setAnchoCm(validarMedida(item.anchoCm(), diseno.get("anchoCm"), "ancho"));
                linea.setAltoCm(validarMedida(item.altoCm(), diseno.get("altoCm"), "alto"));
            } else {
                if (item.articuloId() == null) {
                    throw new ReglaNegocioException("Falta el producto de una de las lineas.");
                }
                if (tienda == null) {
                    tienda = catalogo.tienda();
                }
                Map<String, Object> articulo = tienda.stream()
                        .filter(a -> a.get("id") instanceof Number n && n.longValue() == item.articuloId())
                        .findFirst()
                        .orElseThrow(() -> new ReglaNegocioException("Uno de los productos ya no esta a la venta."));
                linea.setArticuloId(item.articuloId());
                linea.setNombre(String.valueOf(articulo.get("nombre")));
                linea.setPrecio(((Number) articulo.get("precio")).intValue());
            }
            items.add(linea);
        }

        boolean conCita = items.stream().anyMatch(i -> "diseno".equals(i.getTipo()));
        Orden orden = new Orden();
        if (conCita) {
            agenda.validarCita(datos.citaFecha(), datos.citaHora(), datos.tatuadorId(), null);
            if (datos.zonaCuerpo() == null || datos.zonaCuerpo().isBlank()) {
                throw new ReglaNegocioException("Elige la zona del cuerpo.");
            }
            orden.setCitaFecha(datos.citaFecha());
            orden.setCitaHora(datos.citaHora());
            orden.setTatuadorId(datos.tatuadorId());
            orden.setZonaCuerpo(datos.zonaCuerpo());
            orden.setIndicaciones(datos.indicaciones());
        }
        LocalDateTime ahora = LocalDateTime.now();
        orden.setNumero(siguienteNumero(ahora));
        orden.setUsuarioId(yo.id());
        orden.setClienteNombre(datos.nombre().trim());
        orden.setClienteApellidos(datos.apellidos().trim());
        orden.setClienteCorreo(datos.correo().trim());
        orden.setClienteTelefono(datos.telefono().replace(" ", ""));
        orden.setFecha(ahora);
        orden.setEstado(EstadosOrden.PENDIENTE);
        orden.setItems(items);
        orden.setTotal(items.stream().mapToInt(i -> i.getPrecio() * i.getCantidad()).sum());
        Orden guardada = ordenes.save(orden);
        registrar(guardada, null, EstadosOrden.PENDIENTE, "Orden creada", yo);
        return guardada;
    }

    @Transactional
    public Orden pagar(Long id, boolean aprobado, UsuarioAutenticado yo, String token) {
        Orden orden = buscar(id);
        soloDuenoOPersonal(orden, yo);
        if (!EstadosOrden.PENDIENTE.equals(orden.getEstado()) && !EstadosOrden.RECHAZADA.equals(orden.getEstado())) {
            throw ReglaNegocioException.conflicto("Esta orden ya fue " + orden.getEstado().toLowerCase() + ".");
        }
        String anterior = orden.getEstado();
        if (aprobado) {
            if (orden.getCitaFecha() != null) {
                // otra persona pudo pagar la misma hora mientras tanto
                agenda.validarCita(orden.getCitaFecha(), orden.getCitaHora(), orden.getTatuadorId(), orden.getId());
            }
            catalogo.descontar(movimientos(orden), token); // si no hay stock, lanza error y no se cobra
            orden.setEstado(EstadosOrden.PAGADA);
        } else {
            orden.setEstado(EstadosOrden.RECHAZADA);
        }
        Orden guardada = ordenes.save(orden);
        registrar(guardada, anterior, guardada.getEstado(), aprobado ? "Pago aprobado" : "Pago rechazado por el banco", yo);
        return guardada;
    }

    // ── Consultas ──────────────────────────────────────────────────────────

    public List<Orden> mias(UsuarioAutenticado yo) {
        return ordenes.findByUsuarioIdOrderByFechaDesc(yo.id());
    }

    public List<Orden> todas(String estado) {
        return estado == null || estado.isBlank()
                ? ordenes.findAllByOrderByFechaDesc()
                : ordenes.findByEstadoOrderByFechaDesc(estado);
    }

    public OrdenDetalle detalle(Long id, UsuarioAutenticado yo) {
        Orden orden = buscar(id);
        soloDuenoOPersonal(orden, yo);
        return new OrdenDetalle(orden, solicitudes.findByOrdenIdOrderByFechaDesc(id), historial.findByOrdenIdOrderByFechaAsc(id));
    }

    public List<Solicitud> solicitudesPendientes() {
        return solicitudes.findByEstadoOrderByFechaAsc("Pendiente");
    }

    // ── Cambio manual de estado (Administrador) ────────────────────────────

    @Transactional
    public Orden cambiarEstado(Long id, EstadoRequest datos, UsuarioAutenticado yo, String token) {
        Orden orden = buscar(id);
        List<String> permitidos = EstadosOrden.TRANSICIONES.getOrDefault(orden.getEstado(), List.of());
        if (!permitidos.contains(datos.estado())) {
            throw new ReglaNegocioException("Una orden \"" + orden.getEstado() + "\" no puede pasar a \"" + datos.estado() + "\".");
        }
        if (solicitudes.existsByOrdenIdAndEstado(id, "Pendiente")) {
            throw ReglaNegocioException.conflicto("Primero responde la solicitud pendiente de esta orden.");
        }
        if (EstadosOrden.PAGADA.equals(datos.estado()) && orden.getCitaFecha() != null
                && !agenda.horasDisponibles(orden.getCitaFecha(), orden.getTatuadorId(), orden.getId()).contains(orden.getCitaHora())) {
            throw ReglaNegocioException.conflicto("La hora de esta cita ya la tomo otra persona.");
        }
        if (EstadosOrden.REEMBOLSADA.equals(datos.estado())) {
            catalogo.reponer(movimientos(orden), token);
        }
        String anterior = orden.getEstado();
        orden.setEstado(datos.estado());
        Orden guardada = ordenes.save(orden);
        registrar(guardada, anterior, datos.estado(), datos.motivo().trim(), yo);
        return guardada;
    }

    // ── Solicitudes de reembolso o cambio de hora ──────────────────────────

    /** Devuelve "" si se puede pedir, o el motivo por el que no. */
    public String puedeSolicitar(Orden orden, String tipo) {
        if (!EstadosOrden.PAGADA.equals(orden.getEstado())) {
            return "Solo se pueden modificar ordenes pagadas.";
        }
        if (solicitudes.existsByOrdenIdAndEstado(orden.getId(), "Pendiente")) {
            return "Esta orden ya tiene una solicitud en revision.";
        }
        if (orden.getCitaFecha() == null) {
            if ("cambio".equals(tipo)) {
                return "Una compra de la tienda no tiene cita que cambiar.";
            }
            long dias = Duration.between(orden.getFecha(), LocalDateTime.now()).toDays();
            return dias > DIAS_RETRACTO_TIENDA
                    ? "El reembolso de productos se puede pedir hasta " + DIAS_RETRACTO_TIENDA + " dias despues de la compra."
                    : "";
        }
        long horas = Duration.between(LocalDateTime.now(),
                LocalDateTime.of(orden.getCitaFecha(), LocalTime.parse(orden.getCitaHora()))).toHours();
        int minimo = "reembolso".equals(tipo) ? HORAS_ANTICIPACION_REEMBOLSO : HORAS_ANTICIPACION_CAMBIO;
        return horas < minimo
                ? "Se puede pedir hasta " + minimo + " horas antes de la cita."
                : "";
    }

    @Transactional
    public Solicitud solicitar(Long id, SolicitudRequest datos, UsuarioAutenticado yo) {
        Orden orden = buscar(id);
        if (!orden.getUsuarioId().equals(yo.id())) {
            throw ReglaNegocioException.prohibido("Solo puedes hacer solicitudes sobre tus propias reservas.");
        }
        String bloqueo = puedeSolicitar(orden, datos.tipo());
        if (!bloqueo.isEmpty()) {
            throw new ReglaNegocioException(bloqueo);
        }
        Solicitud solicitud = new Solicitud();
        if ("cambio".equals(datos.tipo())) {
            agenda.validarCita(datos.nuevaFecha(), datos.nuevaHora(), orden.getTatuadorId(), orden.getId());
            solicitud.setNuevaFecha(datos.nuevaFecha());
            solicitud.setNuevaHora(datos.nuevaHora());
        }
        solicitud.setOrdenId(id);
        solicitud.setTipo(datos.tipo());
        solicitud.setMotivo(datos.motivo());
        solicitud.setJustificativo(datos.justificativo().trim());
        solicitud.setEstado("Pendiente");
        solicitud.setFecha(LocalDateTime.now());
        return solicitudes.save(solicitud);
    }

    @Transactional
    public OrdenDetalle responder(Long id, Long solicitudId, RespuestaSolicitudRequest datos, UsuarioAutenticado yo,
                                  String token) {
        Orden orden = buscar(id);
        Solicitud solicitud = solicitudes.findById(solicitudId)
                .filter(s -> s.getOrdenId().equals(id))
                .orElseThrow(() -> ReglaNegocioException.noEncontrado("La solicitud no existe."));
        if (!"Pendiente".equals(solicitud.getEstado())) {
            throw ReglaNegocioException.conflicto("Esta solicitud ya fue respondida.");
        }
        if (Boolean.TRUE.equals(datos.aprobada())) {
            if ("reembolso".equals(solicitud.getTipo())) {
                catalogo.reponer(movimientos(orden), token);
                String anterior = orden.getEstado();
                orden.setEstado(EstadosOrden.REEMBOLSADA);
                registrar(orden, anterior, EstadosOrden.REEMBOLSADA, "Reembolso aprobado: " + solicitud.getMotivo(), yo);
            } else {
                agenda.validarCita(solicitud.getNuevaFecha(), solicitud.getNuevaHora(), orden.getTatuadorId(), orden.getId());
                orden.setCitaFecha(solicitud.getNuevaFecha());
                orden.setCitaHora(solicitud.getNuevaHora());
            }
            ordenes.save(orden);
        }
        solicitud.setEstado(Boolean.TRUE.equals(datos.aprobada()) ? "Aprobada" : "Rechazada");
        solicitud.setRespuesta(datos.respuesta());
        solicitudes.save(solicitud);
        return detalle(id, yo);
    }

    // ── Apoyo ──────────────────────────────────────────────────────────────

    private Orden buscar(Long id) {
        return ordenes.findById(id).orElseThrow(() -> ReglaNegocioException.noEncontrado("La orden no existe."));
    }

    private void soloDuenoOPersonal(Orden orden, UsuarioAutenticado yo) {
        if (!yo.esPersonal() && !orden.getUsuarioId().equals(yo.id())) {
            throw ReglaNegocioException.prohibido("No puedes ver ordenes de otras personas.");
        }
    }

    private Double validarMedida(Double pedida, Object original, String lado) {
        Double valor = pedida != null ? pedida : (original instanceof Number n ? n.doubleValue() : null);
        if (valor == null || valor < 1 || valor > 20) {
            throw new ReglaNegocioException("El " + lado + " debe estar entre 1 y 20 cm.");
        }
        return valor;
    }

    /** Articulos de la Tienda de una orden, en el formato que espera ms-catalogo. */
    private List<Map<String, Object>> movimientos(Orden orden) {
        return orden.getItems().stream()
                .filter(i -> "articulo".equals(i.getTipo()))
                .map(i -> Map.<String, Object>of("insumoId", i.getArticuloId(), "cantidad", i.getCantidad()))
                .toList();
    }

    /** Numero visible: fecha (AAAAMMDD) + correlativo del dia de 2 digitos. */
    private String siguienteNumero(LocalDateTime ahora) {
        LocalDate hoy = ahora.toLocalDate();
        long delDia = ordenes.countByFechaBetween(hoy.atStartOfDay(), hoy.plusDays(1).atStartOfDay());
        return hoy.format(FORMATO_NUMERO) + String.format("%02d", delDia + 1);
    }

    private void registrar(Orden orden, String de, String a, String motivo, UsuarioAutenticado yo) {
        CambioEstado cambio = new CambioEstado();
        cambio.setOrdenId(orden.getId());
        cambio.setDe(de);
        cambio.setA(a);
        cambio.setMotivo(motivo);
        cambio.setResponsable(yo.correo());
        cambio.setFecha(LocalDateTime.now());
        historial.save(cambio);
    }
}
