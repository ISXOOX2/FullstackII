package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.DisenoRequest;
import cl.foreverink.catalogo.dto.DisenoRespuesta;
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

/** Disenos: la lectura es publica; crear, editar y eliminar es solo del Administrador. */
@RestController
@RequestMapping("/api/v1/catalogo/disenos")
@Tag(name = "Disenos", description = "Catalogo de disenos para reservar (sin stock).")
public class DisenoController {

    private static final Logger log = LoggerFactory.getLogger(DisenoController.class);

    private final CatalogoService servicio;

    public DisenoController(CatalogoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar disenos", description = "Filtros opcionales: categoriaId (estilo) y q (texto).")
    public ResponseEntity<List<DisenoRespuesta>> listar(@RequestParam(required = false) Long categoriaId,
                               @RequestParam(required = false) String q) {
        log.info("Listar disenos");
        return ResponseEntity.ok(servicio.listarDisenos(categoriaId, q).stream().map(DisenoRespuesta::de).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un diseno")
    public ResponseEntity<DisenoRespuesta> obtener(@PathVariable Long id) {
        log.info("Obtener un diseno (id={})", id);
        return ResponseEntity.ok(DisenoRespuesta.de(servicio.obtenerDiseno(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear diseno (Administrador)", description = "El codigo FI-### se asigna automaticamente.")
    public ResponseEntity<DisenoRespuesta> crear(@Valid @RequestBody DisenoRequest datos) {
        log.info("Crear diseno (Administrador)");
        return ResponseEntity.status(HttpStatus.CREATED).body(DisenoRespuesta.de(servicio.crearDiseno(datos)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar diseno (Administrador)")
    public ResponseEntity<DisenoRespuesta> actualizar(@PathVariable Long id, @Valid @RequestBody DisenoRequest datos) {
        log.info("Editar diseno (Administrador) (id={})", id);
        return ResponseEntity.ok(DisenoRespuesta.de(servicio.actualizarDiseno(id, datos)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar diseno (Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("Eliminar diseno (Administrador) (id={})", id);
        servicio.eliminarDiseno(id);
        return ResponseEntity.noContent().build();
    }
}
