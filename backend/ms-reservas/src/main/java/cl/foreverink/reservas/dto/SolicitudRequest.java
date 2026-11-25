package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/** Solicitud del cliente. Para un "cambio" se indica la nueva fecha y hora. */
public record SolicitudRequest(
        @NotBlank @Pattern(regexp = "^(reembolso|cambio)$", message = "El tipo debe ser reembolso o cambio.") String tipo,
        @NotBlank(message = "Elige un motivo.") @Size(max = 120) String motivo,
        @NotBlank(message = "Escribe el justificativo.")
        @Size(min = 10, max = 300, message = "El justificativo debe tener entre 10 y 300 caracteres.") String justificativo,
        LocalDate nuevaFecha,
        String nuevaHora) {
}
