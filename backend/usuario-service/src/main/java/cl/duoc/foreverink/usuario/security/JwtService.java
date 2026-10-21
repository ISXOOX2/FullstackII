package cl.duoc.foreverink.usuario.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import cl.duoc.foreverink.usuario.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * La "fábrica de identidad digital" (guía 2.3.2): genera y valida los tokens JWT.
 * Un token tiene tres partes: HEADER.PAYLOAD.SIGNATURE. En el payload van los claims:
 *  - sub : el correo del usuario
 *  - rol : ADMIN, VENDEDOR o CLIENTE
 *  - id, nombre
 *  - exp : fecha de expiración
 * La firma se hace con una clave secreta del servidor, así nadie puede alterar el token.
 */
@Service
public class JwtService {

    private final SecretKey clave;
    private final long expiracionMinutos;

    public JwtService(@Value("${jwt.secret}") String secreto,
                      @Value("${jwt.expiracion-minutos}") long expiracionMinutos) {
        this.clave = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secreto));
        this.expiracionMinutos = expiracionMinutos;
    }

    public String generarToken(Usuario usuario) {
        Date ahora = new Date();
        Date expira = new Date(ahora.getTime() + expiracionMinutos * 60_000);
        return Jwts.builder()
                .subject(usuario.getCorreo())
                .claim("rol", RolUtil.rolDe(usuario.getTipo()))
                .claim("id", usuario.getId())
                .claim("nombre", usuario.getNombre())
                .issuedAt(ahora)
                .expiration(expira)
                .signWith(clave)
                .compact();
    }

    /** Devuelve los claims del token. Lanza JwtException si la firma no es válida o expiró. */
    public Claims leerClaims(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpiracionMinutos() {
        return expiracionMinutos;
    }
}
