package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.ResenaRequest;
import cl.foreverink.catalogo.dto.ResenaRespuesta;
import cl.foreverink.catalogo.seguridad.UsuarioAutenticado;
import cl.foreverink.catalogo.servicio.ResenaService;
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

/** Resenas: leer es publico; escribir la propia es del Cliente; eliminar es del Administrador. */
@RestController
@RequestMapping("/api/v1/catalogo/resenas")
@Tag(name = "Resenas", description = "Opiniones de los clientes (1 a 5 estrellas).")
public class ResenaController {

    private static final Logger log = LoggerFactory.getLogger(ResenaController.class);

    private final ResenaService servicio;

    public ResenaController(ResenaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar resenas (de la mas nueva a la mas antigua)")
    public ResponseEntity<List<ResenaRespuesta>> listar() {
        log.info("Listar resenas (de la mas nueva a la mas antigua)");
        return ResponseEntity.ok(servicio.listar().stream().map(ResenaRespuesta::de).toList());
    }

    @PutMapping("/mia")
    @PreAuthorize("hasRole('CLIENTE')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publicar o actualizar mi resena (Cliente)")
    public ResponseEntity<ResenaRespuesta> guardarMia(@Valid @RequestBody ResenaRequest datos, @AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Publicar o actualizar mi resena (Cliente)");
        return ResponseEntity.ok(ResenaRespuesta.de(servicio.guardarDe(yo.id(), datos)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar resena (Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("Eliminar resena (Administrador) (id={})", id);
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
