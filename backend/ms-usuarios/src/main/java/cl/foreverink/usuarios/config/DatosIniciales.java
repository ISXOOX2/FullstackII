package cl.foreverink.usuarios.config;

import cl.foreverink.usuarios.modelo.Usuario;
import cl.foreverink.usuarios.repositorio.UsuarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Si la tabla esta vacia, carga las cuentas de demostracion desde datos/usuarios.json
 * (las mismas del frontend) y cifra sus contrasenas con BCrypt.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder encoder;
    private final ObjectMapper mapper;

    public DatosIniciales(UsuarioRepository repositorio, PasswordEncoder encoder, ObjectMapper mapper) {
        this.repositorio = repositorio;
        this.encoder = encoder;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repositorio.count() > 0) {
            return;
        }
        try (InputStream json = new ClassPathResource("datos/usuarios.json").getInputStream()) {
            List<Usuario> usuarios = mapper.readValue(json, new TypeReference<List<Usuario>>() { });
            for (Usuario u : usuarios) {
                u.setId(null);
                u.setPassword(encoder.encode(u.getPassword()));
                repositorio.save(u);
            }
        }
    }
}
