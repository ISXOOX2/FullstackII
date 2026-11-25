package cl.foreverink.usuarios.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Datos para registrar, crear o editar un usuario. Las mismas reglas que valida el frontend:
 * correo solo @duoc.cl, @profesor.duoc.cl o @gmail.com; contrasena de 4 a 10 caracteres con letras y numeros;
 * telefono celular chileno; fecha de nacimiento obligatoria (la edad minima se revisa en UsuarioService).
 * password puede venir vacia al EDITAR (se mantiene la anterior). tipo solo lo usa el administrador.
 */
public record UsuarioRequest(
        @NotBlank(message = "El RUN es obligatorio.")
        @Pattern(regexp = "^[0-9]{6,8}[0-9Kk]$", message = "Escribe el RUN sin puntos ni guion (ej: 12345678K).")
        String run,

        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 50, message = "El nombre no puede superar los 50 caracteres.")
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios.")
        @Size(max = 100, message = "Los apellidos no pueden superar los 100 caracteres.")
        String apellidos,

        @NotBlank(message = "El correo es obligatorio.")
        @Size(max = 100, message = "El correo no puede superar los 100 caracteres.")
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$",
                message = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.")
        String correo,

        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*_.-]{4,10}$",
                message = "La contrasena debe tener entre 4 y 10 caracteres y combinar letras y numeros.")
        String password,

        @NotNull(message = "La fecha de nacimiento es obligatoria.")
        @Past(message = "La fecha de nacimiento no es valida.")
        LocalDate fechaNacimiento,

        @NotBlank(message = "El telefono es obligatorio.")
        @Pattern(regexp = "^(\\+?56)?9[0-9]{8}$", message = "Ingresa un celular valido (ej: +56912345678).")
        String telefono,

        @Pattern(regexp = "^(Administrador|Vendedor|Cliente)$", message = "El tipo debe ser Administrador, Vendedor o Cliente.")
        String tipo,

        @Size(max = 80) String region,
        @Size(max = 80) String comuna,

        @NotBlank(message = "La direccion es obligatoria.")
        @Size(max = 300, message = "La direccion no puede superar los 300 caracteres.")
        String direccion) {
}
