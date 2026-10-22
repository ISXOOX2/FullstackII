package cl.duoc.foreverink.carrito.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de entrada: un diseño y la cantidad a reservar (Bean Validation, guía 2.3.1).
 * Regla del negocio: máximo 5 unidades del mismo diseño por reserva.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {

    @NotNull(message = "El producto es obligatorio")
    private Long productoId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima es 1")
    @Max(value = 5, message = "Solo puedes reservar hasta 5 unidades del mismo diseño")
    private Integer cantidad;
}
