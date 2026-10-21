package cl.duoc.foreverink.usuario.dto;

import java.time.LocalDate;

/**
 * DTO de salida: los datos públicos de un usuario. Nunca incluye la contraseña
 * (guía 2.2.1: "proteger campos sensibles").
 */
public record UsuarioDto(
        Long id,
        String run,
        String nombre,
        String apellidos,
        String correo,
        String telefono,
        LocalDate fechaNacimiento,
        String region,
        String comuna,
        String direccion,
        String tipo) {
}
