package cl.foreverink.auth.controlador;

import cl.foreverink.auth.dto.LoginRequest;
import cl.foreverink.auth.dto.SesionRespuesta;
import cl.foreverink.auth.dto.UsuarioRequest;
import cl.foreverink.auth.seguridad.UsuarioAutenticado;
import cl.foreverink.auth.servicio.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Login y registro (publicos) y renovacion del token (con token valido). Todas devuelven un token JWT. */
@RestController
@RequestMapping("/api/v1/usuarios/auth")
@Tag(name = "Autenticacion", description = "Login y registro (publicos). Devuelven el token JWT.")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final UsuarioService servicio;

    public AuthController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesion", description = "Devuelve el token JWT y los datos del usuario.")
    public ResponseEntity<SesionRespuesta> login(@Valid @RequestBody LoginRequest datos) {
        log.info("Iniciar sesion");
        return ResponseEntity.ok(servicio.login(datos));
    }

    @PostMapping("/registro")
    @Operation(summary = "Registrarse como cliente", description = "Crea la cuenta (solo mayores de 18) y deja la sesion iniciada.")
    public ResponseEntity<SesionRespuesta> registro(@Valid @RequestBody UsuarioRequest datos) {
        log.info("Registrarse como cliente");
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.registrar(datos));
    }

    @PostMapping("/renovar")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Renovar el token JWT",
            description = "Con un token valido devuelve uno nuevo (8 horas mas). El frontend lo pide solo cuando quedan menos de 15 minutos.")
    public ResponseEntity<SesionRespuesta> renovar(@AuthenticationPrincipal UsuarioAutenticado yo) {
        log.info("Renovar el token JWT");
        return ResponseEntity.ok(servicio.renovar(yo));
    }
}
