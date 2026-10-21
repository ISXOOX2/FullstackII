package cl.duoc.foreverink.usuario.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.duoc.foreverink.usuario.dto.ActualizarUsuarioRequest;
import cl.duoc.foreverink.usuario.dto.LoginRequest;
import cl.duoc.foreverink.usuario.dto.LoginResponse;
import cl.duoc.foreverink.usuario.dto.RegistroRequest;
import cl.duoc.foreverink.usuario.dto.UsuarioDto;
import cl.duoc.foreverink.usuario.exception.RecursoNoEncontradoException;
import cl.duoc.foreverink.usuario.exception.ReglaNegocioException;
import cl.duoc.foreverink.usuario.model.Usuario;
import cl.duoc.foreverink.usuario.repository.UsuarioRepository;
import cl.duoc.foreverink.usuario.security.JwtService;

/** Reglas de negocio de los usuarios: registro, login, edición y eliminación. */
@Service
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // ─── Login ──────────────────────────────────────────────────────────────

    /**
     * Flujo de la guía 2.3.2: el AuthenticationManager valida el correo y la contraseña
     * (contra el hash BCrypt). Si son incorrectos lanza BadCredentialsException (-> 401).
     * Si son correctos, se genera el JWT y se devuelve junto a los datos públicos.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest datos) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(datos.correo().trim(), datos.password()));
        Usuario usuario = buscarPorCorreo(datos.correo().trim());
        log.info("Inicio de sesión correcto correo={} tipo={}", usuario.getCorreo(), usuario.getTipo());
        return new LoginResponse(jwtService.generarToken(usuario), "Bearer",
                jwtService.getExpiracionMinutos(), aDto(usuario));
    }

    // ─── CRUD ───────────────────────────────────────────────────────────────

    /** Registro. En el registro público el tipo es siempre Cliente; un administrador puede elegirlo. */
    @Transactional
    public UsuarioDto registrar(RegistroRequest datos, boolean solicitaAdministrador) {
        validarRun(datos.run());
        String correo = datos.correo().trim().toLowerCase();
        String run = datos.run().trim().toUpperCase();
        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new ReglaNegocioException("Ya existe una cuenta con ese correo");
        }
        if (usuarioRepository.existsByRunIgnoreCase(run)) {
            throw new ReglaNegocioException("Ya existe una cuenta con ese RUN");
        }
        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(datos.nombre().trim());
        usuario.setApellidos(datos.apellidos().trim());
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(datos.password()));
        usuario.setTelefono(datos.telefono());
        usuario.setFechaNacimiento(datos.fechaNacimiento());
        usuario.setRegion(datos.region());
        usuario.setComuna(datos.comuna());
        usuario.setDireccion(datos.direccion().trim());
        usuario.setTipo(solicitaAdministrador && datos.tipo() != null ? datos.tipo() : "Cliente");
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
    public UsuarioDto actualizar(Long id, ActualizarUsuarioRequest datos) {
        Usuario usuario = buscar(id);
        validarRun(datos.run());
        String correo = datos.correo().trim().toLowerCase();
        String run = datos.run().trim().toUpperCase();
        if (usuarioRepository.existsByCorreoIgnoreCaseAndIdNot(correo, id)) {
            throw new ReglaNegocioException("Ya existe otra cuenta con ese correo");
        }
        if (usuarioRepository.existsByRunIgnoreCaseAndIdNot(run, id)) {
            throw new ReglaNegocioException("Ya existe otra cuenta con ese RUN");
        }
        usuario.setRun(run);
        usuario.setNombre(datos.nombre().trim());
        usuario.setApellidos(datos.apellidos().trim());
        usuario.setCorreo(correo);
        // Contraseña en blanco = se conserva la actual
        if (datos.password() != null && !datos.password().isBlank()) {
            if (datos.password().length() < 4) {
                throw new ReglaNegocioException("La contraseña debe tener entre 4 y 10 caracteres");
            }
            usuario.setPassword(passwordEncoder.encode(datos.password()));
        }
        usuario.setTelefono(datos.telefono());
        usuario.setFechaNacimiento(datos.fechaNacimiento());
        usuario.setRegion(datos.region());
        usuario.setComuna(datos.comuna());
        usuario.setDireccion(datos.direccion().trim());
        if (datos.tipo() != null) {
            usuario.setTipo(datos.tipo());
        }
        log.info("Usuario actualizado id={}", id);
        return aDto(usuarioRepository.save(usuario));
    }

    /** Reglas: nadie puede eliminarse a sí mismo y siempre debe quedar al menos un administrador. */
    @Transactional
    public void eliminar(Long id, String correoSolicitante) {
        Usuario usuario = buscar(id);
        if (usuario.getCorreo().equalsIgnoreCase(correoSolicitante)) {
            throw new ReglaNegocioException("No puedes eliminar tu propia cuenta");
        }
        if ("Administrador".equals(usuario.getTipo()) && usuarioRepository.countByTipo("Administrador") <= 1) {
            throw new ReglaNegocioException("Debe quedar al menos un administrador");
        }
        usuarioRepository.delete(usuario);
        log.info("Usuario eliminado id={} correo={}", id, usuario.getCorreo());
    }

    // ─── Apoyo ──────────────────────────────────────────────────────────────

    private Usuario buscar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario con id " + id));
    }

    private Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el usuario " + correo));
    }

    /** Valida el dígito verificador del RUN con el algoritmo módulo 11. */
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
            throw new ReglaNegocioException("El dígito verificador del RUN no es válido");
        }
    }

    private UsuarioDto aDto(Usuario u) {
        return new UsuarioDto(u.getId(), u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(),
                u.getTelefono(), u.getFechaNacimiento(), u.getRegion(), u.getComuna(), u.getDireccion(),
                u.getTipo());
    }
}
