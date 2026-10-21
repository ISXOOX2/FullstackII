package cl.duoc.foreverink.usuario.dto;

/**
 * Respuesta del login: el token JWT firmado y los datos públicos del usuario.
 * El frontend guarda el token y lo envía en el header "Authorization: Bearer <token>".
 */
public record LoginResponse(String token, String tipoToken, long expiraEnMinutos, UsuarioDto usuario) {
}
