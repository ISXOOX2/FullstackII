package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.InsumoRequest;
import cl.foreverink.catalogo.dto.MovimientoStock;
import cl.foreverink.catalogo.modelo.Insumo;
import cl.foreverink.catalogo.servicio.InsumoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** Insumos del estudio (solo personal) y Tienda publica con los que estan a la venta. */
@RestController
@RequestMapping("/api/v1/catalogo")
@Tag(name = "Insumos y Tienda", description = "Stock de insumos, alerta de stock critico y articulos a la venta.")
public class InsumoController {

    private final InsumoService servicio;

    public InsumoController(InsumoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/tienda")
    @Operation(summary = "Articulos a la venta (publico)", description = "Cuidado del tatuaje y gift cards.")
    public List<Insumo> tienda() {
        return servicio.tienda();
    }

    @PostMapping("/tienda/descontar")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Descontar stock de una venta pagada",
            description = "Lo llama ms-reservas cuando un pago se aprueba. Devuelve los insumos que quedaron en stock critico.")
    public List<Insumo> descontar(@Valid @RequestBody List<MovimientoStock> movimientos) {
        return servicio.descontar(movimientos);
    }

    @PostMapping("/tienda/reponer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Reponer stock por un reembolso (Administrador)")
    public void reponer(@Valid @RequestBody List<MovimientoStock> movimientos) {
        servicio.reponer(movimientos);
    }

    @GetMapping("/insumos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar insumos (Administrador)")
    public List<Insumo> listar() {
        return servicio.listar();
    }

    @GetMapping("/insumos/criticos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Insumos en stock critico (Administrador)", description = "stock <= stockCritico")
    public List<Insumo> criticos() {
        return servicio.criticos();
    }

    @PostMapping("/insumos")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear insumo (Administrador)", description = "El codigo IN-### es automatico.")
    public Insumo crear(@Valid @RequestBody InsumoRequest datos) {
        return servicio.guardar(null, datos);
    }

    @PutMapping("/insumos/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Editar insumo (Administrador)")
    public Insumo actualizar(@PathVariable Long id, @Valid @RequestBody InsumoRequest datos) {
        return servicio.guardar(id, datos);
    }

    @DeleteMapping("/insumos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar insumo (Administrador)")
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
