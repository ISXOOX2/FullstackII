package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.CategoriaRequest;
import cl.foreverink.catalogo.dto.CategoriaRespuesta;
import cl.foreverink.catalogo.servicio.CatalogoService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/catalogo/categorias")
@Tag(name = "Estilos", description = "Estilos de tatuaje (categorias de los disenos).")
public class CategoriaController {

    private static final Logger log = LoggerFactory.getLogger(CategoriaController.class);

    private final CatalogoService servicio;

    public CategoriaController(CatalogoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar estilos")
    public ResponseEntity<List<CategoriaRespuesta>> listar() {
        log.info("Listar estilos");
        return ResponseEntity.ok(servicio.listarCategorias().stream().map(CategoriaRespuesta::de).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un estilo")
    public ResponseEntity<CategoriaRespuesta> obtener(@PathVariable Long id) {
        log.info("Obtener un estilo (id={})", id);
        return ResponseEntity.ok(CategoriaRespuesta.de(servicio.obtenerCategoria(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear estilo (Administrador)")
    public ResponseEntity<CategoriaRespuesta> crear(@Valid @RequestBody CategoriaRequest datos) {
        log.info("Crear estilo (Administrador)");
        return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaRespuesta.de(servicio.guardarCategoria(null, datos)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar estilo (Administrador)")
    public ResponseEntity<CategoriaRespuesta> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest datos) {
        log.info("Editar estilo (Administrador) (id={})", id);
        return ResponseEntity.ok(CategoriaRespuesta.de(servicio.guardarCategoria(id, datos)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar estilo sin disenos (Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("Eliminar estilo sin disenos (Administrador) (id={})", id);
        servicio.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
