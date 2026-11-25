package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RespuestaSolicitudRequest(
        @NotNull(message = "Indica si se aprueba o se rechaza.") Boolean aprobada,
        @Size(max = 300) String respuesta) {
}
