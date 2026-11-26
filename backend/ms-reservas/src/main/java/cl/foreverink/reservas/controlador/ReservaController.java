package cl.foreverink.reservas.controlador;

import cl.foreverink.reservas.dto.AgendaTatuador;
import cl.foreverink.reservas.dto.EstadoRequest;
import cl.foreverink.reservas.dto.OrdenDetalle;
import cl.foreverink.reservas.dto.OrdenRequest;
import cl.foreverink.reservas.dto.OrdenRespuesta;
import cl.foreverink.reservas.dto.PagoRequest;
import cl.foreverink.reservas.dto.RespuestaSolicitudRequest;
import cl.foreverink.reservas.dto.SolicitudRequest;
import cl.foreverink.reservas.dto.SolicitudRespuesta;
import cl.foreverink.reservas.seguridad.UsuarioAutenticado;
import cl.foreverink.reservas.servicio.AgendaService;
import cl.foreverink.reservas.servicio.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservas")
@Tag(name = "Reservas", description = "Agenda, ordenes, pago simulado, reembolsos y cambios de hora.")
public class ReservaController {

    private static final Logger log = LoggerFactory.getLogger(ReservaController.class);

    private final OrdenService ordenes;
    private final AgendaService agenda;

    public ReservaController(OrdenService ordenes, AgendaService agenda) {
        this.ordenes = ordenes;
        this.agenda = agenda;
    }

    @GetMapping("/horas")
    @Operation(summary = "Horas libres de un tatuador en una fecha (publico)")
    public ResponseEntity<List<String>> horas(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
                              @RequestParam Long tatuadorId) {
        log.info("Horas libres de un tatuador en una fecha (publico)");
        return ResponseEntity.ok(agenda.horasDisponibles(fecha, tatuadorId, null));
    }

    @GetMapping("/agenda")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Alerta de agenda: horas libres por tatuador en los proximos 6 dias de atencion")
    public ResponseEntity<List<AgendaTatuador>> agenda() {
        log.info("Alerta de agenda: horas libres por tatuador en los proximos 6 dias de atencion");
        return ResponseEntity.ok(agenda.agendaPorTatuador());
    }

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear una orden (checkout)",
            description = "Con disenos exige cita valida y libre. Los precios se toman de ms-catalogo. Queda Pendiente hasta pagar.")
    public ResponseEntity<OrdenRespuesta> crear(@Valid @RequestBody OrdenRequest datos, @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Crear una orden (checkout)");
        return ResponseEntity.status(HttpStatus.CREATED).body(OrdenRespuesta.de(ordenes.crear(datos, yo)));
    }

    @PostMapping("/{id}/pago")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Registrar el resultado del pago simulado",
            description = "Aprobado: ocupa la hora y descuenta el stock de la Tienda en ms-catalogo.")
    public ResponseEntity<OrdenRespuesta> pagar(@PathVariable Long id, @Valid @RequestBody PagoRequest datos,
                       @AuthenticationPrincipal UsuarioAutenticado yo,
                       @RequestHeader(value = "Authorization", required = false) String token) {
        log.info("Registrar el resultado del pago simulado (id={})", id);
        return ResponseEntity.ok(OrdenRespuesta.de(ordenes.pagar(id, datos.aprobado(), yo, token)));
    }

    @GetMapping("/mias")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mis ordenes (historial de compras del cliente)")
    public ResponseEntity<List<OrdenRespuesta>> mias(@AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Mis ordenes (historial de compras del cliente)");
        return ResponseEntity.ok(ordenes.mias(yo).stream().map(OrdenRespuesta::de).toList());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Todas las ordenes (Administrador y Vendedor)", description = "Filtro opcional por estado.")
    public ResponseEntity<List<OrdenRespuesta>> todas(@RequestParam(required = false) String estado) {
        log.info("Todas las ordenes (Administrador y Vendedor)");
        return ResponseEntity.ok(ordenes.todas(estado).stream().map(OrdenRespuesta::de).toList());
    }

    @GetMapping("/solicitudes/pendientes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Solicitudes de reembolso o cambio sin responder")
    public ResponseEntity<List<SolicitudRespuesta>> pendientes() {
        log.info("Solicitudes de reembolso o cambio sin responder");
        return ResponseEntity.ok(ordenes.solicitudesPendientes().stream().map(SolicitudRespuesta::de).toList());
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Detalle de una orden con solicitudes e historial (dueno o personal)")
    public ResponseEntity<OrdenDetalle> detalle(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Detalle de una orden con solicitudes e historial (dueno o personal) (id={})", id);
        return ResponseEntity.ok(ordenes.detalle(id, yo));
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar el estado a mano (Administrador)",
            description = "Pendiente -> Pagada o Pago rechazado; Pagada -> Pago rechazado o Reembolsada; "
                    + "Pago rechazado -> Pagada o Pendiente; Reembolsada no cambia mas.")
    public ResponseEntity<OrdenRespuesta> cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest datos,
                               @AuthenticationPrincipal UsuarioAutenticado yo,
                               @RequestHeader(value = "Authorization", required = false) String token) {
        log.info("Cambiar el estado a mano (Administrador) (id={})", id);
        return ResponseEntity.ok(OrdenRespuesta.de(ordenes.cambiarEstado(id, datos, yo, token)));
    }

    @PostMapping("/{id}/solicitudes")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Pedir reembolso o cambio de fecha y hora (dueno de la orden)",
            description = "Reembolso hasta 48 h antes (compras de la tienda: 10 dias); cambio hasta 24 h antes.")
    public ResponseEntity<SolicitudRespuesta> solicitar(@PathVariable Long id, @Valid @RequestBody SolicitudRequest datos,
                               @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Pedir reembolso o cambio de fecha y hora (dueno de la orden) (id={})", id);
        return ResponseEntity.status(HttpStatus.CREATED).body(SolicitudRespuesta.de(ordenes.solicitar(id, datos, yo)));
    }

    @PutMapping("/{id}/solicitudes/{solicitudId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Aprobar o rechazar una solicitud (Administrador)")
    public ResponseEntity<OrdenDetalle> responder(@PathVariable Long id, @PathVariable Long solicitudId,
                                  @Valid @RequestBody RespuestaSolicitudRequest datos,
                                  @AuthenticationPrincipal UsuarioAutenticado yo,
                                  @RequestHeader(value = "Authorization", required = false) String token) {
        log.info("Aprobar o rechazar una solicitud (Administrador) (id={}, solicitudId={})", id, solicitudId);
        return ResponseEntity.ok(ordenes.responder(id, solicitudId, datos, yo, token));
    }
}
