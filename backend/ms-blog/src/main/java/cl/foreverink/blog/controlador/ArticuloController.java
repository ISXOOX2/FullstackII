package cl.foreverink.blog.controlador;

import cl.foreverink.blog.dto.ArticuloRequest;
import cl.foreverink.blog.modelo.Articulo;
import cl.foreverink.blog.servicio.ArticuloService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Blog: leer es publico; publicar, editar y eliminar es del Administrador. */
@RestController
@RequestMapping("/api/v1/blog")
@Tag(name = "Blog", description = "Articulos del blog. El frontend los vuelve a pedir cada cierto tiempo.")
public class ArticuloController {

    private final ArticuloService servicio;

    public ArticuloController(ArticuloService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar articulos (del mas nuevo al mas antiguo)")
    public List<Articulo> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un articulo")
    public Articulo obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publicar articulo (Administrador)")
    public Articulo crear(@Valid @RequestBody ArticuloRequest datos) {
        return servicio.guardar(null, datos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar articulo (Administrador)")
    public Articulo actualizar(@PathVariable Long id, @Valid @RequestBody ArticuloRequest datos) {
        return servicio.guardar(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar articulo (Administrador)")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
