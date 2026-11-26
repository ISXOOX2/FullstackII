package cl.foreverink.reservas.controlador;

import cl.foreverink.reservas.dto.EstadoProyectoRequest;
import cl.foreverink.reservas.dto.MensajeRequest;
import cl.foreverink.reservas.dto.MensajeRespuesta;
import cl.foreverink.reservas.dto.ProyectoRequest;
import cl.foreverink.reservas.dto.ProyectoRespuesta;
import cl.foreverink.reservas.seguridad.UsuarioAutenticado;
import cl.foreverink.reservas.servicio.ProyectoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    private static final Logger log = LoggerFactory.getLogger(ProyectoController.class);

    private final ProyectoService servicio;

    public ProyectoController(ProyectoService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/proyectos")
    @Operation(summary = "Enviar mi proyecto (publico; si hay sesion, queda ligado al cliente)")
    public ResponseEntity<ProyectoRespuesta> crearProyecto(@Valid @RequestBody ProyectoRequest datos, @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Enviar mi proyecto (publico; si hay sesion, queda ligado al cliente)");
        return ResponseEntity.status(HttpStatus.CREATED).body(ProyectoRespuesta.de(servicio.crearProyecto(datos, yo == null ? null : yo.id())));
    }

    @GetMapping("/proyectos")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar proyectos de clientes (personal)")
    public ResponseEntity<List<ProyectoRespuesta>> listarProyectos() {
        log.info("Listar proyectos de clientes (personal)");
        return ResponseEntity.ok(servicio.listarProyectos().stream().map(ProyectoRespuesta::de).toList());
    }

    @PutMapping("/proyectos/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar el estado de un proyecto (personal)")
    public ResponseEntity<ProyectoRespuesta> cambiarEstado(@PathVariable Long id, @Valid @RequestBody EstadoProyectoRequest datos) {
        log.info("Cambiar el estado de un proyecto (personal) (id={})", id);
        return ResponseEntity.ok(ProyectoRespuesta.de(servicio.cambiarEstado(id, datos.estado())));
    }

    @PostMapping("/mensajes")
    @Operation(summary = "Enviar un mensaje de contacto (publico)")
    public ResponseEntity<MensajeRespuesta> enviarMensaje(@Valid @RequestBody MensajeRequest datos) {
        log.info("Enviar un mensaje de contacto (publico)");
        return ResponseEntity.status(HttpStatus.CREATED).body(MensajeRespuesta.de(servicio.guardarMensaje(datos)));
    }

    @GetMapping("/mensajes")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'VENDEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar mensajes de contacto (personal)")
    public ResponseEntity<List<MensajeRespuesta>> listarMensajes() {
        log.info("Listar mensajes de contacto (personal)");
        return ResponseEntity.ok(servicio.listarMensajes().stream().map(MensajeRespuesta::de).toList());
    }
}
