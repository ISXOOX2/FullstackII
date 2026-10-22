package cl.duoc.foreverink.usuario.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.foreverink.usuario.dto.LoginRequest;
import cl.duoc.foreverink.usuario.dto.LoginResponse;
import cl.duoc.foreverink.usuario.dto.UsuarioDto;
import cl.duoc.foreverink.usuario.dto.UsuarioRequest;
import cl.duoc.foreverink.usuario.model.Usuario;
import cl.duoc.foreverink.usuario.repository.UsuarioRepository;
import cl.duoc.foreverink.usuario.security.JwtService;

/**
 * Reglas de negocio de los usuarios: login, registro, edición y eliminación.
 * Los errores se lanzan con ResponseStatusException y los convierte el GlobalExceptionHandler.
 */
@Service
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    // ─── Login ──────────────────────────────────────────────────────────────

    /**
     * Flujo de la guía 2.3.2: el AuthenticationManager valida el correo y la contraseña
     * (contra el hash BCrypt). Si son incorrectos lanza BadCredentialsException (-> 401).
     * Si son correctos, se genera el JWT y se devuelve junto a los datos públicos.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest datos) {
        String correo = datos.getCorreo().trim();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(correo, datos.getPassword()));
        Usuario usuario = buscarPorCorreo(correo);
        log.info("Inicio de sesión correcto correo={} tipo={}", usuario.getCorreo(), usuario.getTipo());
        return new LoginResponse(jwtService.generarToken(usuario), "Bearer",
                jwtService.getExpiracionMinutos(), aDto(usuario));
    }

    // ─── CRUD ───────────────────────────────────────────────────────────────

    /** Registro. En el registro público el tipo es siempre Cliente; un administrador puede elegirlo. */
    @Transactional
    public UsuarioDto registrar(UsuarioRequest datos, boolean solicitaAdministrador) {
        if (datos.getPassword() == null || datos.getPassword().length() < 4) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener entre 4 y 10 caracteres");
        }
        validarRun(datos.getRun());
        String correo = datos.getCorreo().trim().toLowerCase();
        String run = datos.getRun().trim().toUpperCase();
        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo");
        }
        if (usuarioRepository.existsByRunIgnoreCase(run)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese RUN");
        }
        Usuario usuario = new Usuario();
        copiarDatos(datos, usuario);
        usuario.setPassword(passwordEncoder.encode(datos.getPassword()));
        usuario.setTipo(solicitaAdministrador && datos.getTipo() != null ? datos.getTipo() : "Cliente");
        Usuario guardado = usuarioRepository.save(usuario);
        log.info("Usuario registrado id={} correo={} tipo={}", guardado.getId(), correo, guardado.getTipo());
        return aDto(guardado);
    }

    @Transactional(readOnly = true)
    public List<UsuarioDto> listar() {
        return usuarioRepository.findAllByOrderByIdAsc().stream().map(this::aDto).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDto obtener(Long id) {
        return aDto(buscar(id));
    }

    @Transactional(readOnly = true)
    public UsuarioDto obtenerPorCorreo(String correo) {
        return aDto(buscarPorCorreo(correo));
    }

    @Transactional
    public UsuarioDto actualizar(Long id, UsuarioRequest datos) {
        Usuario usuario = buscar(id);
        validarRun(datos.getRun());
        String correo = datos.getCorreo().trim().toLowerCase();
        String run = datos.getRun().trim().toUpperCase();
        if (usuarioRepository.existsByCorreoIgnoreCaseAndIdNot(correo, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otra cuenta con ese correo");
        }
        if (usuarioRepository.existsByRunIgnoreCaseAndIdNot(run, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otra cuenta con ese RUN");
        }
        copiarDatos(datos, usuario);
        // Contraseña en blanco = se conserva la actual
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            if (datos.getPassword().length() < 4) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña debe tener entre 4 y 10 caracteres");
            }
            usuario.setPassword(passwordEncoder.encode(datos.getPassword()));
        }
        if (datos.getTipo() != null) {
            usuario.setTipo(datos.getTipo());
        }
        log.info("Usuario actualizado id={}", id);
        return aDto(usuarioRepository.save(usuario));
    }

    /** Reglas: nadie puede eliminarse a sí mismo y siempre debe quedar al menos un administrador. */
    @Transactional
    public void eliminar(Long id, String correoSolicitante) {
        Usuario usuario = buscar(id);
        if (usuario.getCorreo().equalsIgnoreCase(correoSolicitante)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta");
        }
        if ("Administrador".equals(usuario.getTipo()) && usuarioRepository.countByTipo("Administrador") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Debe quedar al menos un administrador");
        }
        usuarioRepository.delete(usuario);
        log.info("Usuario eliminado id={} correo={}", id, usuario.getCorreo());
    }

    // ─── Apoyo ──────────────────────────────────────────────────────────────

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe el usuario con id " + id));
    }

    private Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe el usuario " + correo));
    }

    /** Copia los datos comunes del formulario a la entidad (no toca contraseña ni tipo). */
    private void copiarDatos(UsuarioRequest datos, Usuario usuario) {
        usuario.setRun(datos.getRun().trim().toUpperCase());
        usuario.setNombre(datos.getNombre().trim());
        usuario.setApellidos(datos.getApellidos().trim());
        usuario.setCorreo(datos.getCorreo().trim().toLowerCase());
        usuario.setTelefono(datos.getTelefono());
        usuario.setFechaNacimiento(datos.getFechaNacimiento());
        usuario.setRegion(datos.getRegion());
        usuario.setComuna(datos.getComuna());
        usuario.setDireccion(datos.getDireccion().trim());
    }

    /** Valida el dígito verificador del RUN con el algoritmo módulo 11 (400 si no coincide). */
    static void validarRun(String runCompleto) {
        String run = runCompleto.trim().toUpperCase();
        String cuerpo = run.substring(0, run.length() - 1);
        char dv = run.charAt(run.length() - 1);
        int suma = 0;
        int factor = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * factor;
            factor = factor == 7 ? 2 : factor + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : Character.forDigit(resto, 10);
        if (dv != esperado) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El dígito verificador del RUN no es válido");
        }
    }

    private UsuarioDto aDto(Usuario u) {
        return new UsuarioDto(u.getId(), u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(),
                u.getTelefono(), u.getFechaNacimiento(), u.getRegion(), u.getComuna(), u.getDireccion(),
                u.getTipo());
    }
}
