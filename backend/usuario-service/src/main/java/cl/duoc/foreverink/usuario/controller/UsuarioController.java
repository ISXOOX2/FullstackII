package cl.duoc.foreverink.usuario.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.foreverink.usuario.dto.ActualizarUsuarioRequest;
import cl.duoc.foreverink.usuario.dto.RegistroRequest;
import cl.duoc.foreverink.usuario.dto.UsuarioDto;
import cl.duoc.foreverink.usuario.service.UsuarioService;
import jakarta.validation.Valid;

/**
 * API REST de usuarios.
 *  - POST /api/usuarios          registro (público)                         -> 201
 *  - GET  /api/usuarios/me       mis datos (requiere token)                 -> 200
 *  - GET  /api/usuarios          listar (solo ADMIN)                        -> 200
 *  - GET  /api/usuarios/{id}     ver uno (solo ADMIN)                       -> 200 / 404
 *  - PUT  /api/usuarios/{id}     editar (solo ADMIN)                        -> 200 / 404
 *  - DELETE /api/usuarios/{id}   eliminar (solo ADMIN)                      -> 204 / 404
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioDto> registrar(@Valid @RequestBody RegistroRequest datos,
                                                Authentication autenticacion) {
        boolean esAdmin = autenticacion != null && autenticacion.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        UsuarioDto creado = usuarioService.registrar(datos, esAdmin);
        return ResponseEntity.created(URI.create("/api/usuarios/" + creado.id())).body(creado);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDto> misDatos(Authentication autenticacion) {
        return ResponseEntity.ok(usuarioService.obtenerPorCorreo(autenticacion.getName()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDto>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDto> obtener(@PathVariable("id") Long id) {
        return ResponseEntity.ok(usuarioService.obtener(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDto> actualizar(@PathVariable("id") Long id,
                                                 @Valid @RequestBody ActualizarUsuarioRequest datos) {
        return ResponseEntity.ok(usuarioService.actualizar(id, datos));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id, Authentication autenticacion) {
        usuarioService.eliminar(id, autenticacion.getName());
        return ResponseEntity.noContent().build();
    }
}
