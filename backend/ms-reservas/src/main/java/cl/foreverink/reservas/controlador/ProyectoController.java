package cl.foreverink.reservas.controlador;

import cl.foreverink.reservas.dto.EstadoProyectoRequest;
import cl.foreverink.reservas.dto.MensajeRequest;
import cl.foreverink.reservas.dto.ProyectoRequest;
import cl.foreverink.reservas.modelo.Mensaje;
import cl.foreverink.reservas.modelo.Proyecto;
import cl.foreverink.reservas.seguridad.UsuarioAutenticado;
import cl.foreverink.reservas.servicio.ProyectoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Enviar una idea o un mensaje es publico (no hace falta cuenta).
 * Verlos y cambiar el estado es del personal (Administrador y Vendedor).
 */
@RestController
@RequestMapping("/api/v1/reservas")
@Tag(name = "Proyectos y contacto", description = "Ideas propias de los clientes (Mi proyecto) y mensajes de contacto.")
public class ProyectoController {

    private final ProyectoService servicio;

    public ProyectoController(ProyectoService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/proyectos")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Enviar mi proyecto (publico; si hay sesion, queda ligado al cliente)")
    public Proyecto crearProyecto(@Valid @RequestBody ProyectoRequest datos, @AuthenticationPrincipal UsuarioAutenticado yo) {
        return servicio.crearProyecto(datos, yo == null ? null : yo.id());
    }

    @GetMapping("/proyectos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar proyectos de clientes (personal)")
    public List<Proyecto> listarProyectos() {
        return servicio.listarProyectos();
    }

    @PutMapping("/proyectos/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar el estado de un proyecto (personal)")
    public Proyecto cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoProyectoRequest datos) {
        return servicio.cambiarEstado(id, datos.estado());
    }

    @PostMapping("/mensajes")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Enviar un mensaje de contacto (publico)")
    public Mensaje enviarMensaje(@Valid @RequestBody MensajeRequest datos) {
        return servicio.guardarMensaje(datos);
    }

    @GetMapping("/mensajes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar mensajes de contacto (personal)")
    public List<Mensaje> listarMensajes() {
        return servicio.listarMensajes();
    }
}
