package cl.foreverink.reservas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Idea que envia el cliente desde "Mi proyecto". La fecha, el plazo y el estado los pone el servidor. */
public record ProyectoRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 80) String nombre,
        @NotBlank(message = "El correo es obligatorio.") @Email(message = "Ingresa un correo valido.") @Size(max = 100) String correo,
        @NotBlank(message = "Elige la zona del cuerpo.") @Size(max = 60) String zonaCuerpo,
        @Pattern(regexp = "^$|^(Izquierdo|Derecho|Centro)$", message = "Elige un lado de la lista.") String lado,
        @NotBlank(message = "Describe tu idea.")
        @Size(min = 20, max = 600, message = "La idea debe tener entre 20 y 600 caracteres.") String idea,
        @Size(max = 1500000, message = "La imagen no puede pesar mas de 1 MB.")
        @Pattern(regexp = "^$|^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$",
                 message = "La imagen debe ser JPG, PNG o WEBP.") String imagen) {
}
