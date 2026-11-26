package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Cambio manual de estado (Administrador). El motivo queda en el historial. */
public record EstadoRequest(
        @NotBlank(message = "Elige el nuevo estado.") String estado,
        @NotBlank(message = "Escribe el motivo del cambio.")
        @Size(min = 5, max = 300, message = "El motivo debe tener entre 5 y 300 caracteres.") String motivo) {
}
