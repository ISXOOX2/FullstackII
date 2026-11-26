package cl.foreverink.reservas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

/** Datos del checkout. La cita (fecha, hora, tatuador y zona) es obligatoria solo si hay disenos. */
public record OrdenRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 50) String nombre,
        @NotBlank(message = "Los apellidos son obligatorios.") @Size(max = 100) String apellidos,
        @NotBlank(message = "El correo es obligatorio.") @Email(message = "El correo no es valido.") @Size(max = 100) String correo,
        @NotBlank(message = "El telefono es obligatorio.")
        @Pattern(regexp = "^(\\+?56)?9[0-9]{8}$", message = "Ingresa un celular valido (ej: +56912345678).") String telefono,
        LocalDate citaFecha,
        String citaHora,
        Long tatuadorId,
        @Size(max = 80) String zonaCuerpo,
        @Size(max = 300, message = "Las indicaciones no pueden superar los 300 caracteres.") String indicaciones,
        @NotEmpty(message = "El carrito esta vacio.") List<@Valid ItemRequest> items) {
}
