package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/** Un item del carrito. El precio NO lo manda el cliente: se toma de ms-catalogo. */
public record ItemRequest(
        @NotNull @Pattern(regexp = "^(diseno|articulo)$", message = "El tipo debe ser diseno o articulo.") String tipo,
        Long productoId,
        Long articuloId,
        @NotNull @Min(value = 1, message = "La cantidad minima es 1.") @Max(value = 10, message = "La cantidad maxima es 10.") Integer cantidad,
        Double anchoCm,
        Double altoCm) {
}
