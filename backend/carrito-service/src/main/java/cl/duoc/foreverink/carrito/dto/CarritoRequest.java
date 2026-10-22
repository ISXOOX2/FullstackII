package cl.duoc.foreverink.carrito.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO de entrada para guardar el carrito completo de una vez (lo usa el frontend cada vez
 * que el cliente cambia su reserva). @Valid valida también cada ítem de la lista.
 */
@Data
public class CarritoRequest {

    @NotNull(message = "La lista de ítems es obligatoria")
    private List<@Valid ItemRequest> items;
}
