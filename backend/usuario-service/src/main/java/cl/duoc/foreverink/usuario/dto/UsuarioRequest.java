package cl.duoc.foreverink.usuario.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO de entrada para registrar o editar un usuario, con Bean Validation (guía 2.3.1).
 * Son las mismas reglas del formulario de registro del frontend (Anexo 1 de la EP1):
 * RUN sin puntos ni guion, correo de duoc.cl, profesor.duoc.cl o gmail.com.
 * La contraseña (4 a 10 caracteres) es obligatoria al registrar; al editar, si viene vacía
 * se conserva la actual. El dígito verificador del RUN se revisa en el service.
 * "tipo" solo lo puede elegir un administrador; en el registro público siempre es Cliente.
 */
@Data
public class UsuarioRequest {

    @NotBlank(message = "El RUN es obligatorio")
    @Pattern(regexp = "^[0-9]{6,8}[0-9Kk]$", message = "El RUN debe tener de 7 a 9 caracteres, sin puntos ni guion")
    private String run;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre puede tener hasta 50 caracteres")
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos pueden tener hasta 100 caracteres")
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio")
    @Size(max = 100, message = "El correo puede tener hasta 100 caracteres")
    @Email(message = "El correo no tiene un formato válido")
    @Pattern(regexp = "^[^@\\s]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com")
    private String correo;

    @Size(max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres")
    private String password;

    @Size(max = 20, message = "El teléfono puede tener hasta 20 caracteres")
    private String telefono;

    @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La región es obligatoria")
    private String region;

    @NotBlank(message = "La comuna es obligatoria")
    private String comuna;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 300, message = "La dirección puede tener hasta 300 caracteres")
    private String direccion;

    @Pattern(regexp = "^(Administrador|Vendedor|Cliente)$", message = "El tipo debe ser Administrador, Vendedor o Cliente")
    private String tipo;
}
