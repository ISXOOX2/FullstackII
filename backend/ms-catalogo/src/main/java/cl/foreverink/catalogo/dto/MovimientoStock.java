package cl.foreverink.catalogo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** Un articulo y la cantidad que se vende (descontar) o se devuelve (reponer). */
public record MovimientoStock(
        @NotNull Long insumoId,
        @NotNull @Min(value = 1, message = "La cantidad minima es 1.") Integer cantidad) {
}
