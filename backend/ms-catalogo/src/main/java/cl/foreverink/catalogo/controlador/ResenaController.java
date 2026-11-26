package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.ResenaRequest;
import cl.foreverink.catalogo.modelo.Resena;
import cl.foreverink.catalogo.seguridad.UsuarioAutenticado;
import cl.foreverink.catalogo.servicio.ResenaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Resenas: leer es publico; escribir la propia es del Cliente; eliminar es del Administrador. */
@RestController
@RequestMapping("/api/v1/catalogo/resenas")
@Tag(name = "Resenas", description = "Opiniones de los clientes (1 a 5 estrellas).")
public class ResenaController {

    private final ResenaService servicio;

    public ResenaController(ResenaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar resenas (de la mas nueva a la mas antigua)")
    public List<Resena> listar() {
        return servicio.listar();
    }

    @PutMapping("/mia")
    @PreAuthorize("hasRole('CLIENTE')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publicar o actualizar mi resena (Cliente)")
    public Resena guardarMia(@Valid @RequestBody ResenaRequest datos, @AuthenticationPrincipal UsuarioAutenticado yo) {
        return servicio.guardarDe(yo.id(), datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar resena (Administrador)")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
