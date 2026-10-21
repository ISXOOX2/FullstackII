package cl.duoc.foreverink.usuario.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para editar un usuario. Igual que el registro, pero la contraseña es
 * opcional: si viene vacía se conserva la actual.
 */
public record ActualizarUsuarioRequest(
        @NotBlank(message = "El RUN es obligatorio")
        @Pattern(regexp = "^[0-9]{6,8}[0-9Kk]$", message = "El RUN debe tener de 7 a 9 caracteres, sin puntos ni guion")
        String run,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre puede tener hasta 50 caracteres")
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100, message = "Los apellidos pueden tener hasta 100 caracteres")
        String apellidos,

        @NotBlank(message = "El correo es obligatorio")
        @Size(max = 100, message = "El correo puede tener hasta 100 caracteres")
        @Email(message = "El correo no tiene un formato válido")
        String correo,

        @Size(max = 10, message = "La contraseña puede tener hasta 10 caracteres")
        String password,

        @Size(max = 20, message = "El teléfono puede tener hasta 20 caracteres")
        String telefono,

        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        LocalDate fechaNacimiento,

        @NotBlank(message = "La región es obligatoria")
        String region,

        @NotBlank(message = "La comuna es obligatoria")
        String comuna,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 300, message = "La dirección puede tener hasta 300 caracteres")
        String direccion,

        @Pattern(regexp = "^(Administrador|Vendedor|Cliente)$", message = "El tipo debe ser Administrador, Vendedor o Cliente")
        String tipo) {
}
