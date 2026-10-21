package cl.duoc.foreverink.usuario.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.foreverink.usuario.dto.LoginRequest;
import cl.duoc.foreverink.usuario.dto.LoginResponse;
import cl.duoc.foreverink.usuario.service.UsuarioService;
import jakarta.validation.Valid;

/**
 * Endpoint de login personalizado (guía 2.3.2, "el Gatekeeper"): POST /api/auth/login.
 * 200 con el token si las credenciales son correctas; 401 si no (lo arma el ControllerAdvice).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest datos) {
        return ResponseEntity.ok(usuarioService.login(datos));
    }
}
