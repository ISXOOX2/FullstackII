package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EstadoProyectoRequest(
        @NotBlank @Pattern(regexp = "^(Nuevo|Contactado|Sesión coordinada|Descartado)$",
                           message = "Estado no valido.") String estado) {
}
