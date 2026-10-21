package cl.duoc.foreverink.carrito.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** DTO de entrada para cambiar la cantidad de un diseño que ya está en el carrito. */
public record CantidadRequest(
        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        @Max(value = 5, message = "Solo puedes reservar hasta 5 unidades del mismo diseño")
        Integer cantidad) {
}
