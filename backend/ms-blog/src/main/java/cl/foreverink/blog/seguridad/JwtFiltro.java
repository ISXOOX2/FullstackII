package cl.foreverink.blog.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Locale;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Se ejecuta en cada peticion: si trae "Authorization: Bearer <token>" valido, deja al usuario
 * autenticado con su rol (ROLE_ADMINISTRADOR, ROLE_VENDEDOR o ROLE_CLIENTE).
 */
@Component
public class JwtFiltro extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFiltro(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String cabecera = request.getHeader("Authorization");
        if (cabecera != null && cabecera.startsWith("Bearer ")) {
            try {
                Claims claims = jwtUtil.leerToken(cabecera.substring(7));
                Number id = claims.get("id", Number.class);
                String rol = claims.get("rol", String.class);
                UsuarioAutenticado usuario = new UsuarioAutenticado(id.longValue(), claims.getSubject(), rol);
                List<SimpleGrantedAuthority> permisos =
                        List.of(new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase(Locale.ROOT)));
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(usuario, null, permisos));
            } catch (JwtException | IllegalArgumentException | NullPointerException e) {
                SecurityContextHolder.clearContext(); // token invalido o vencido: sigue como anonimo
            }
        }
        chain.doFilter(request, response);
    }
}
