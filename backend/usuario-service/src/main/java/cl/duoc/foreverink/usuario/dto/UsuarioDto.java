package cl.duoc.foreverink.usuario.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de salida: los datos públicos de un usuario. Nunca incluye la contraseña
 * (guía 2.2.1: "proteger campos sensibles").
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDto {
    private Long id;
    private String run;
    private String nombre;
    private String apellidos;
    private String correo;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String region;
    private String comuna;
    private String direccion;
    private String tipo;
}
