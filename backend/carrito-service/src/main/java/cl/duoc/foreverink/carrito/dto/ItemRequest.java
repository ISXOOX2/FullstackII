package cl.duoc.foreverink.carrito.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO de entrada para agregar un diseño (Bean Validation, guía 2.3.1).
 * Regla del negocio: máximo 5 unidades del mismo diseño por reserva.
 */
public record ItemRequest(
        @NotNull(message = "El producto es obligatorio")
        Long productoId,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        @Max(value = 5, message = "Solo puedes reservar hasta 5 unidades del mismo diseño")
        Integer cantidad) {
}
