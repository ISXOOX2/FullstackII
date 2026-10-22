package cl.duoc.foreverink.producto.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Lee y valida los tokens JWT (guía 2.3.2). Los tokens los firma usuario-service con la
 * misma clave secreta (jwt.secret); aquí solo se verifica la firma y la fecha de expiración,
 * sin consultar ninguna base de datos (autenticación stateless).
 */
@Service
public class JwtService {

    /** Clave secreta compartida con usuario-service (application.properties). */
    @Value("${jwt.secret}")
    private String secreto;

    private SecretKey clave() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secreto));
    }

    /** Devuelve los claims del token. Lanza JwtException si la firma no es válida o expiró. */
    public Claims leerClaims(String token) {
        return Jwts.parser()
                .verifyWith(clave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
