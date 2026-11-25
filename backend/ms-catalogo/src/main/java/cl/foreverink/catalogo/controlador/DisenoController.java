package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.DisenoRequest;
import cl.foreverink.catalogo.modelo.Diseno;
import cl.foreverink.catalogo.servicio.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Disenos: la lectura es publica; crear, editar y eliminar es solo del Administrador. */
@RestController
@RequestMapping("/api/v1/catalogo/disenos")
@Tag(name = "Disenos", description = "Catalogo de disenos para reservar (sin stock).")
public class DisenoController {

    private final CatalogoService servicio;

    public DisenoController(CatalogoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar disenos", description = "Filtros opcionales: categoriaId (estilo) y q (texto).")
    public List<Diseno> listar(@RequestParam(required = false) Long categoriaId,
                               @RequestParam(required = false) String q) {
        return servicio.listarDisenos(categoriaId, q);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un diseno")
    public Diseno obtener(@PathVariable Long id) {
        return servicio.obtenerDiseno(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear diseno (Administrador)", description = "El codigo FI-### se asigna automaticamente.")
    public Diseno crear(@Valid @RequestBody DisenoRequest datos) {
        return servicio.crearDiseno(datos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar diseno (Administrador)")
    public Diseno actualizar(@PathVariable Long id, @Valid @RequestBody DisenoRequest datos) {
        return servicio.actualizarDiseno(id, datos);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar diseno (Administrador)")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminarDiseno(id);
    }
}
