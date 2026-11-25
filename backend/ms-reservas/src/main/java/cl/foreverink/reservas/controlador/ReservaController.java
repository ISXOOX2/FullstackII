package cl.foreverink.reservas.controlador;

import cl.foreverink.reservas.dto.AgendaTatuador;
import cl.foreverink.reservas.dto.EstadoRequest;
import cl.foreverink.reservas.dto.OrdenDetalle;
import cl.foreverink.reservas.dto.OrdenRequest;
import cl.foreverink.reservas.dto.PagoRequest;
import cl.foreverink.reservas.dto.RespuestaSolicitudRequest;
import cl.foreverink.reservas.dto.SolicitudRequest;
import cl.foreverink.reservas.modelo.Orden;
import cl.foreverink.reservas.modelo.Solicitud;
import cl.foreverink.reservas.seguridad.UsuarioAutenticado;
import cl.foreverink.reservas.servicio.AgendaService;
import cl.foreverink.reservas.servicio.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reservas")
@Tag(name = "Reservas", description = "Agenda, ordenes, pago simulado, reembolsos y cambios de hora.")
public class ReservaController {

    private final OrdenService ordenes;
    private final AgendaService agenda;

    public ReservaController(OrdenService ordenes, AgendaService agenda) {
        this.ordenes = ordenes;
        this.agenda = agenda;
    }

    @GetMapping("/horas")
    @Operation(summary = "Horas libres de un tatuador en una fecha (publico)")
    public List<String> horas(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
                              @RequestParam Long tatuadorId) {
        return agenda.horasDisponibles(fecha, tatuadorId, null);
    }

    @GetMapping("/agenda")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Alerta de agenda: horas libres por tatuador en los proximos 6 dias de atencion")
    public List<AgendaTatuador> agenda() {
        return agenda.agendaPorTatuador();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear una orden (checkout)",
            description = "Con disenos exige cita valida y libre. Los precios se toman de ms-catalogo. Queda Pendiente hasta pagar.")
    public Orden crear(@Valid @RequestBody OrdenRequest datos, @AuthenticationPrincipal UsuarioAutenticado yo) {
        return ordenes.crear(datos, yo);
    }

    @PostMapping("/{id}/pago")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Registrar el resultado del pago simulado",
            description = "Aprobado: ocupa la hora y descuenta el stock de la Tienda en ms-catalogo.")
    public Orden pagar(@PathVariable Long id, @Valid @RequestBody PagoRequest datos,
                       @AuthenticationPrincipal UsuarioAutenticado yo,
                       @RequestHeader(value = "Authorization", required = false) String token) {
        return ordenes.pagar(id, datos.aprobado(), yo, token);
    }

    @GetMapping("/mias")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mis ordenes (historial de compras del cliente)")
    public List<Orden> mias(@AuthenticationPrincipal UsuarioAutenticado yo) {
        return ordenes.mias(yo);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Todas las ordenes (Administrador y Vendedor)", description = "Filtro opcional por estado.")
    public List<Orden> todas(@RequestParam(required = false) String estado) {
        return ordenes.todas(estado);
    }

    @GetMapping("/solicitudes/pendientes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Solicitudes de reembolso o cambio sin responder")
    public List<Solicitud> pendientes() {
        return ordenes.solicitudesPendientes();
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Detalle de una orden con solicitudes e historial (dueno o personal)")
    public OrdenDetalle detalle(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado yo) {
        return ordenes.detalle(id, yo);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar el estado a mano (Administrador)",
            description = "Pendiente -> Pagada o Pago rechazado; Pagada -> Pago rechazado o Reembolsada; "
                    + "Pago rechazado -> Pagada o Pendiente; Reembolsada no cambia mas.")
    public Orden cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoRequest datos,
                               @AuthenticationPrincipal UsuarioAutenticado yo,
                               @RequestHeader(value = "Authorization", required = false) String token) {
        return ordenes.cambiarEstado(id, datos, yo, token);
    }

    @PostMapping("/{id}/solicitudes")
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Pedir reembolso o cambio de fecha y hora (dueno de la orden)",
            description = "Reembolso hasta 48 h antes (compras de la tienda: 10 dias); cambio hasta 24 h antes.")
    public Solicitud solicitar(@PathVariable Long id, @Valid @RequestBody SolicitudRequest datos,
                               @AuthenticationPrincipal UsuarioAutenticado yo) {
        return ordenes.solicitar(id, datos, yo);
    }

    @PutMapping("/{id}/solicitudes/{solicitudId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Aprobar o rechazar una solicitud (Administrador)")
    public OrdenDetalle responder(@PathVariable Long id, @PathVariable Long solicitudId,
                                  @Valid @RequestBody RespuestaSolicitudRequest datos,
                                  @AuthenticationPrincipal UsuarioAutenticado yo,
                                  @RequestHeader(value = "Authorization", required = false) String token) {
        return ordenes.responder(id, solicitudId, datos, yo, token);
    }
}
