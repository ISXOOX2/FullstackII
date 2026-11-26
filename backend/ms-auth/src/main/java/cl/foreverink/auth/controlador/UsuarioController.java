package cl.foreverink.auth.controlador;

import cl.foreverink.auth.dto.UsuarioRequest;
import cl.foreverink.auth.dto.UsuarioRespuesta;
import cl.foreverink.auth.seguridad.UsuarioAutenticado;
import cl.foreverink.auth.servicio.UsuarioService;
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

/** Mantenedor de usuarios. Todas las rutas necesitan token. */
@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Mantenedor de usuarios (rol Administrador) y datos de la cuenta propia.")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Listar todos los usuarios (Administrador)")
    public ResponseEntity<List<UsuarioRespuesta>> listar() {
        log.info("Listar todos los usuarios (Administrador)");
        return ResponseEntity.ok(servicio.listar());
    }

    @GetMapping("/yo")
    @Operation(summary = "Datos de la cuenta que inicio sesion")
    public ResponseEntity<UsuarioRespuesta> yo(@AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Datos de la cuenta que inicio sesion");
        return ResponseEntity.ok(servicio.obtener(yo.id(), yo));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario (Administrador o el mismo usuario)")
    public ResponseEntity<UsuarioRespuesta> obtener(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Obtener un usuario (Administrador o el mismo usuario) (id={})", id);
        return ResponseEntity.ok(servicio.obtener(id, yo));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Crear un usuario con cualquier rol (Administrador)")
    public ResponseEntity<UsuarioRespuesta> crear(@Valid @RequestBody UsuarioRequest datos) {
        log.info("Crear un usuario con cualquier rol (Administrador)");
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(datos));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar un usuario (Administrador o el mismo usuario; solo el Administrador cambia el rol)")
    public ResponseEntity<UsuarioRespuesta> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest datos,
                                       @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Editar un usuario (Administrador o el mismo usuario; solo el Administrador cambia el rol) (id={})", id);
        return ResponseEntity.ok(servicio.actualizar(id, datos, yo));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Eliminar un usuario (Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Eliminar un usuario (Administrador) (id={})", id);
        servicio.eliminar(id, yo);
        return ResponseEntity.noContent().build();
    }
}
