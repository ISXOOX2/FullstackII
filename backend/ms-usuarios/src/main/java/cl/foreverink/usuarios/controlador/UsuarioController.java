package cl.foreverink.usuarios.controlador;

import cl.foreverink.usuarios.dto.UsuarioRequest;
import cl.foreverink.usuarios.dto.UsuarioRespuesta;
import cl.foreverink.usuarios.seguridad.UsuarioAutenticado;
import cl.foreverink.usuarios.servicio.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Mantenedor de usuarios. Todas las rutas necesitan token. */
@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Mantenedor de usuarios (rol Administrador) y datos de la cuenta propia.")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Listar todos los usuarios (Administrador)")
    public List<UsuarioRespuesta> listar() {
        return servicio.listar();
    }

    @GetMapping("/yo")
    @Operation(summary = "Datos de la cuenta que inicio sesion")
    public UsuarioRespuesta yo(@AuthenticationPrincipal UsuarioAutenticado yo) {
        return servicio.obtener(yo.id(), yo);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario (Administrador o el mismo usuario)")
    public UsuarioRespuesta obtener(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado yo) {
        return servicio.obtener(id, yo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Crear un usuario con cualquier rol (Administrador)")
    public UsuarioRespuesta crear(@Valid @RequestBody UsuarioRequest datos) {
        return servicio.crear(datos);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar un usuario (Administrador o el mismo usuario; solo el Administrador cambia el rol)")
    public UsuarioRespuesta actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequest datos,
                                       @AuthenticationPrincipal UsuarioAutenticado yo) {
        return servicio.actualizar(id, datos, yo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Operation(summary = "Eliminar un usuario (Administrador)")
    public void eliminar(@PathVariable Long id, @AuthenticationPrincipal UsuarioAutenticado yo) {
        servicio.eliminar(id, yo);
    }
}
