package cl.foreverink.auth.config;

import cl.foreverink.auth.modelo.Usuario;
import cl.foreverink.auth.repositorio.UsuarioRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Si la tabla esta vacia, carga las cuentas iniciales desde datos/usuarios.json y cifra sus
 * contrasenas con BCrypt.
 * SEGURIDAD: en el servidor (AWS) las contrasenas del administrador, vendedor y cliente de ejemplo
 * se definen en el .env (ADMIN_PASSWORD, VENDEDOR_PASSWORD, CLIENTE_PASSWORD). Las del archivo JSON
 * (que esta en GitHub y cualquiera puede leer) solo se usan en desarrollo, si esas variables no existen.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder encoder;
    private final ObjectMapper mapper;
    private final String claveAdministrador;
    private final String claveVendedor;
    private final String claveCliente;

    public DatosIniciales(UsuarioRepository repositorio, PasswordEncoder encoder, ObjectMapper mapper,
                          @Value("${app.clave-inicial.administrador:}") String claveAdministrador,
                          @Value("${app.clave-inicial.vendedor:}") String claveVendedor,
                          @Value("${app.clave-inicial.cliente:}") String claveCliente) {
        this.repositorio = repositorio;
        this.encoder = encoder;
        this.mapper = mapper;
        this.claveAdministrador = claveAdministrador;
        this.claveVendedor = claveVendedor;
        this.claveCliente = claveCliente;
    }

    /** La clave del .env para ese rol, o la del archivo si no se definio (solo desarrollo). */
    private String claveInicial(Usuario u) {
        String delEntorno = switch (u.getTipo()) {
            case "Administrador" -> claveAdministrador;
            case "Vendedor" -> claveVendedor;
            default -> claveCliente;
        };
        return delEntorno == null || delEntorno.isBlank() ? u.getPassword() : delEntorno;
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
                u.setPassword(encoder.encode(claveInicial(u)));
                repositorio.save(u);
            }
        }
    }
}
