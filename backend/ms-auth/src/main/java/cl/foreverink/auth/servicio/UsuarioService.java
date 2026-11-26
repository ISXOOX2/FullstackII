package cl.foreverink.auth.servicio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import cl.foreverink.auth.dto.LoginRequest;
import cl.foreverink.auth.dto.SesionRespuesta;
import cl.foreverink.auth.dto.UsuarioRequest;
import cl.foreverink.auth.dto.UsuarioRespuesta;
import cl.foreverink.auth.excepcion.ReglaNegocioException;
import cl.foreverink.auth.modelo.Usuario;
import cl.foreverink.auth.repositorio.UsuarioRepository;
import cl.foreverink.auth.seguridad.JwtUtil;
import cl.foreverink.auth.seguridad.UsuarioAutenticado;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Reglas de negocio de los usuarios.
 *  - Solo mayores de 18 anos (el estudio no tatua a menores).
 *  - RUN valido (digito verificador modulo 11) y unico; correo unico.
 *  - En el registro publico el tipo siempre es "Cliente"; los otros roles los asigna el administrador.
 */
@Service
public class UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    public static final int EDAD_MINIMA = 18;

    private final UsuarioRepository repositorio;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public UsuarioService(UsuarioRepository repositorio, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.repositorio = repositorio;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    // ── Sesion ─────────────────────────────────────────────────────────────

    public SesionRespuesta login(LoginRequest datos) {
        Usuario usuario = repositorio.findByCorreoIgnoreCase(datos.correo().trim())
                .filter(u -> encoder.matches(datos.password(), u.getPassword()))
                .orElseThrow(() -> {
                    log.warn("Login fallido");  // no se registra el correo ni la contrasena
                    return new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "Correo o contrasena incorrectos.");
                });
        log.info("Login correcto: usuario id={} rol={}", usuario.getId(), usuario.getTipo());
        return sesion(usuario);
    }

    public SesionRespuesta registrar(UsuarioRequest datos) {
        if (datos.password() == null || datos.password().isBlank()) {
            throw new ReglaNegocioException("La contrasena es obligatoria.");
        }
        Usuario nuevo = new Usuario();
        copiar(datos, nuevo);
        nuevo.setTipo("Cliente"); // nadie puede registrarse solo como administrador
        nuevo.setPassword(encoder.encode(datos.password()));
        validarUnicos(nuevo, null);
        Usuario guardado = repositorio.save(nuevo);
        log.info("Cliente registrado: id={}", guardado.getId());
        return sesion(guardado);
    }

    /**
     * Renovacion del token: con un token VALIDO (aun no vencido) entrega uno nuevo con 8 horas mas.
     * Se vuelve a leer el usuario de la base, asi un cambio de rol o una cuenta eliminada se notan al renovar.
     */
    public SesionRespuesta renovar(UsuarioAutenticado yo) {
        Usuario usuario = repositorio.findById(yo.id())
                .orElseThrow(() -> new ReglaNegocioException(HttpStatus.UNAUTHORIZED, "Tu cuenta ya no existe."));
        return sesion(usuario);
    }

    private SesionRespuesta sesion(Usuario u) {
        return new SesionRespuesta(jwtUtil.generarToken(u.getId(), u.getCorreo(), u.getTipo()), UsuarioRespuesta.de(u));
    }

    // ── Mantenedor ─────────────────────────────────────────────────────────

    public List<UsuarioRespuesta> listar() {
        return repositorio.findAll().stream().map(UsuarioRespuesta::de).toList();
    }

    public UsuarioRespuesta obtener(Long id, UsuarioAutenticado yo) {
        soloElMismoOAdmin(id, yo);
        return UsuarioRespuesta.de(buscar(id));
    }

    public UsuarioRespuesta crear(UsuarioRequest datos) {
        if (datos.password() == null || datos.password().isBlank()) {
            throw new ReglaNegocioException("La contrasena es obligatoria.");
        }
        Usuario nuevo = new Usuario();
        copiar(datos, nuevo);
        nuevo.setTipo(datos.tipo() == null ? "Cliente" : datos.tipo());
        nuevo.setPassword(encoder.encode(datos.password()));
        validarUnicos(nuevo, null);
        return UsuarioRespuesta.de(repositorio.save(nuevo));
    }

    public UsuarioRespuesta actualizar(Long id, UsuarioRequest datos, UsuarioAutenticado yo) {
        soloElMismoOAdmin(id, yo);
        Usuario usuario = buscar(id);
        copiar(datos, usuario);
        if (yo.esAdministrador() && datos.tipo() != null) {
            usuario.setTipo(datos.tipo()); // solo el administrador cambia roles
        }
        if (datos.password() != null && !datos.password().isBlank()) {
            usuario.setPassword(encoder.encode(datos.password()));
        }
        validarUnicos(usuario, id);
        return UsuarioRespuesta.de(repositorio.save(usuario));
    }

    public void eliminar(Long id, UsuarioAutenticado yo) {
        if (id.equals(yo.id())) {
            throw new ReglaNegocioException("No puedes eliminar tu propia cuenta mientras la estas usando.");
        }
        repositorio.delete(buscar(id));
    }

    // ── Apoyo ──────────────────────────────────────────────────────────────

    private Usuario buscar(Long id) {
        return repositorio.findById(id).orElseThrow(() -> ReglaNegocioException.noEncontrado("El usuario no existe."));
    }

    private void soloElMismoOAdmin(Long id, UsuarioAutenticado yo) {
        if (!yo.esAdministrador() && !id.equals(yo.id())) {
            throw ReglaNegocioException.prohibido("Solo puedes ver o editar tu propia cuenta.");
        }
    }

    private void copiar(UsuarioRequest datos, Usuario u) {
        if (!runValido(datos.run())) {
            throw new ReglaNegocioException("El RUN no es valido: el digito verificador no coincide.");
        }
        if (datos.fechaNacimiento().plusYears(EDAD_MINIMA).isAfter(LocalDate.now())) {
            throw new ReglaNegocioException("Debes tener al menos " + EDAD_MINIMA + " anos para registrarte.");
        }
        u.setRun(datos.run().toUpperCase());
        u.setNombre(datos.nombre().trim());
        u.setApellidos(datos.apellidos().trim());
        u.setCorreo(datos.correo().trim().toLowerCase());
        u.setFechaNacimiento(datos.fechaNacimiento());
        u.setTelefono(datos.telefono().replace(" ", ""));
        u.setRegion(datos.region());
        u.setComuna(datos.comuna());
        u.setDireccion(datos.direccion().trim());
    }

    private void validarUnicos(Usuario u, Long idActual) {
        repositorio.findByCorreoIgnoreCase(u.getCorreo())
                .filter(otro -> !otro.getId().equals(idActual))
                .ifPresent(otro -> {
                    throw ReglaNegocioException.conflicto("Ya existe una cuenta con ese correo.");
                });
        boolean runRepetido = repositorio.findAll().stream()
                .anyMatch(otro -> otro.getRun().equalsIgnoreCase(u.getRun()) && !otro.getId().equals(idActual));
        if (runRepetido) {
            throw ReglaNegocioException.conflicto("Ya existe una cuenta con ese RUN.");
        }
    }

    /** RUN chileno sin puntos ni guion: calcula el digito verificador con modulo 11. */
    public static boolean runValido(String run) {
        if (run == null || !run.matches("^[0-9]{6,8}[0-9Kk]$")) {
            return false;
        }
        String cuerpo = run.substring(0, run.length() - 1);
        char dv = Character.toUpperCase(run.charAt(run.length() - 1));
        int suma = 0;
        int multiplicador = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += (cuerpo.charAt(i) - '0') * multiplicador;
            multiplicador = multiplicador == 7 ? 2 : multiplicador + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : (char) ('0' + resto);
        return dv == esperado;
    }
}
