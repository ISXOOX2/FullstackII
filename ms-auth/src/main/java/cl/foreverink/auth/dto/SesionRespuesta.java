package cl.foreverink.auth.dto;

/** Respuesta del login y del registro: el token JWT y los datos del usuario. */
public record SesionRespuesta(String token, UsuarioRespuesta usuario) {
}
