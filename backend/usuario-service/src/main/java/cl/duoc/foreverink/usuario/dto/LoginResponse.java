package cl.duoc.foreverink.usuario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Respuesta del login: el token JWT firmado y los datos públicos del usuario.
 * El frontend guarda el token y lo envía en el header "Authorization: Bearer <token>".
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tipoToken;
    private long expiraEnMinutos;
    private UsuarioDto usuario;
}
