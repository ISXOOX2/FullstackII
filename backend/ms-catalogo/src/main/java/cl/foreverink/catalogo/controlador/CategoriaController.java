package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.CategoriaRequest;
import cl.foreverink.catalogo.modelo.Categoria;
import cl.foreverink.catalogo.servicio.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/catalogo/categorias")
@Tag(name = "Estilos", description = "Estilos de tatuaje (categorias de los disenos).")
public class CategoriaController {

    private final CatalogoService servicio;

    public CategoriaController(CatalogoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar estilos")
    public List<Categoria> listar() {
        return servicio.listarCategorias();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un estilo")
    public Categoria obtener(@PathVariable Long id) {
        return servicio.obtenerCategoria(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear estilo (Administrador)")
    public Categoria crear(@Valid @RequestBody CategoriaRequest datos) {
        return servicio.guardarCategoria(null, datos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar estilo (Administrador)")
    public Categoria actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest datos) {
        return servicio.guardarCategoria(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar estilo sin disenos (Administrador)")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminarCategoria(id);
    }
}
