package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.ArticuloRequest;
import cl.foreverink.catalogo.dto.ArticuloRespuesta;
import cl.foreverink.catalogo.servicio.ArticuloService;
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

/** Blog: leer es publico; publicar, editar y eliminar es del Administrador. */
@RestController
@RequestMapping("/api/v1/blog")
@Tag(name = "Blog", description = "Articulos del blog. El frontend los vuelve a pedir cada cierto tiempo.")
public class ArticuloController {

    private static final Logger log = LoggerFactory.getLogger(ArticuloController.class);

    private final ArticuloService servicio;

    public ArticuloController(ArticuloService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar articulos (del mas nuevo al mas antiguo)")
    public ResponseEntity<List<ArticuloRespuesta>> listar() {
        log.info("Listar articulos (del mas nuevo al mas antiguo)");
        return ResponseEntity.ok(servicio.listar().stream().map(ArticuloRespuesta::de).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un articulo")
    public ResponseEntity<ArticuloRespuesta> obtener(@PathVariable Long id) {
        log.info("Obtener un articulo (id={})", id);
        return ResponseEntity.ok(ArticuloRespuesta.de(servicio.obtener(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publicar articulo (Administrador)")
    public ResponseEntity<ArticuloRespuesta> crear(@Valid @RequestBody ArticuloRequest datos) {
        log.info("Publicar articulo (Administrador)");
        return ResponseEntity.status(HttpStatus.CREATED).body(ArticuloRespuesta.de(servicio.guardar(null, datos)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar articulo (Administrador)")
    public ResponseEntity<ArticuloRespuesta> actualizar(@PathVariable Long id, @Valid @RequestBody ArticuloRequest datos) {
        log.info("Editar articulo (Administrador) (id={})", id);
        return ResponseEntity.ok(ArticuloRespuesta.de(servicio.guardar(id, datos)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar articulo (Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("Eliminar articulo (Administrador) (id={})", id);
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
