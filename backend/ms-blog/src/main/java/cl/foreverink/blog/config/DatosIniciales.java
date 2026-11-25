package cl.foreverink.blog.config;

import cl.foreverink.blog.modelo.Articulo;
import cl.foreverink.blog.repositorio.ArticuloRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/** Si no hay articulos, carga los dos del frontend desde datos/articulos.json. */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final ArticuloRepository repositorio;
    private final ObjectMapper mapper;

    public DatosIniciales(ArticuloRepository repositorio, ObjectMapper mapper) {
        this.repositorio = repositorio;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repositorio.count() > 0) {
            return;
        }
        try (InputStream json = new ClassPathResource("datos/articulos.json").getInputStream()) {
            List<Articulo> articulos = mapper.readValue(json, new TypeReference<List<Articulo>>() { });
            for (Articulo a : articulos) {
                a.setId(null);
                repositorio.save(a);
            }
        }
    }
}
