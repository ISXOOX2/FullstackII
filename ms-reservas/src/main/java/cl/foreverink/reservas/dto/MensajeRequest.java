package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MensajeRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 100) String nombre,
        @NotBlank(message = "El correo es obligatorio.") @Email(message = "Ingresa un correo valido.") @Size(max = 100) String correo,
        @NotBlank(message = "El comentario es obligatorio.") @Size(max = 500) String comentario) {
}
