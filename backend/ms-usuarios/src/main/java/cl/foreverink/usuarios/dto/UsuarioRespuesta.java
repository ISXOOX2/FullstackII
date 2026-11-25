package cl.foreverink.usuarios.dto;

import cl.foreverink.usuarios.modelo.Usuario;
import java.time.LocalDate;

/** Lo que la API devuelve de un usuario: igual que la entidad pero SIN la contrasena. */
public record UsuarioRespuesta(Long id, String run, String nombre, String apellidos, String correo, String tipo,
                               LocalDate fechaNacimiento, String telefono, String region, String comuna,
                               String direccion) {

    public static UsuarioRespuesta de(Usuario u) {
        return new UsuarioRespuesta(u.getId(), u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(), u.getTipo(),
                u.getFechaNacimiento(), u.getTelefono(), u.getRegion(), u.getComuna(), u.getDireccion());
    }
}
