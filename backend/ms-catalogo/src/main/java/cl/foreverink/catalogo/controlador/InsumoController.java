package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.InsumoRequest;
import cl.foreverink.catalogo.dto.InsumoRespuesta;
import cl.foreverink.catalogo.dto.MovimientoStock;
import cl.foreverink.catalogo.servicio.InsumoService;
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

/** Insumos del estudio (solo personal) y Tienda publica con los que estan a la venta. */
@RestController
@RequestMapping("/api/v1/catalogo")
@Tag(name = "Insumos y Tienda", description = "Stock de insumos, alerta de stock critico y articulos a la venta.")
public class InsumoController {

    private static final Logger log = LoggerFactory.getLogger(InsumoController.class);

    private final InsumoService servicio;

    public InsumoController(InsumoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/tienda")
    @Operation(summary = "Articulos a la venta (publico)", description = "Cuidado del tatuaje y gift cards.")
    public ResponseEntity<List<InsumoRespuesta>> tienda() {
        log.info("Articulos a la venta (publico)");
        return ResponseEntity.ok(servicio.tienda().stream().map(InsumoRespuesta::de).toList());
    }

    @PostMapping("/tienda/descontar")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Descontar stock de una venta pagada",
            description = "Lo llama ms-reservas cuando un pago se aprueba. Devuelve los insumos que quedaron en stock critico.")
    public ResponseEntity<List<InsumoRespuesta>> descontar(@Valid @RequestBody List<MovimientoStock> movimientos) {
        log.info("Descontar stock de una venta pagada");
        return ResponseEntity.ok(servicio.descontar(movimientos).stream().map(InsumoRespuesta::de).toList());
    }

    @PostMapping("/tienda/reponer")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Reponer stock por un reembolso (Administrador)")
    public ResponseEntity<Void> reponer(@Valid @RequestBody List<MovimientoStock> movimientos) {
        log.info("Reponer stock por un reembolso (Administrador)");
        servicio.reponer(movimientos);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/insumos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar insumos (Administrador)")
    public ResponseEntity<List<InsumoRespuesta>> listar() {
        log.info("Listar insumos (Administrador)");
        return ResponseEntity.ok(servicio.listar().stream().map(InsumoRespuesta::de).toList());
    }

    @GetMapping("/insumos/criticos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Insumos en stock critico (Administrador)", description = "stock <= stockCritico")
    public ResponseEntity<List<InsumoRespuesta>> criticos() {
        log.info("Insumos en stock critico (Administrador)");
        return ResponseEntity.ok(servicio.criticos().stream().map(InsumoRespuesta::de).toList());
    }

    @PostMapping("/insumos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear insumo (Administrador)", description = "El codigo IN-### es automatico.")
    public ResponseEntity<InsumoRespuesta> crear(@Valid @RequestBody InsumoRequest datos) {
        log.info("Crear insumo (Administrador)");
        return ResponseEntity.status(HttpStatus.CREATED).body(InsumoRespuesta.de(servicio.guardar(null, datos)));
    }

    @PutMapping("/insumos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar insumo (Administrador)")
    public ResponseEntity<InsumoRespuesta> actualizar(@PathVariable Long id, @Valid @RequestBody InsumoRequest datos) {
        log.info("Editar insumo (Administrador) (id={})", id);
        return ResponseEntity.ok(InsumoRespuesta.de(servicio.guardar(id, datos)));
    }

    @DeleteMapping("/insumos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar insumo (Administrador)")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("Eliminar insumo (Administrador) (id={})", id);
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
