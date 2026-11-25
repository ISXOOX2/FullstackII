package cl.foreverink.catalogo.config;

import cl.foreverink.catalogo.modelo.Categoria;
import cl.foreverink.catalogo.modelo.Diseno;
import cl.foreverink.catalogo.modelo.Insumo;
import cl.foreverink.catalogo.modelo.Tatuador;
import cl.foreverink.catalogo.repositorio.CategoriaRepository;
import cl.foreverink.catalogo.repositorio.DisenoRepository;
import cl.foreverink.catalogo.repositorio.InsumoRepository;
import cl.foreverink.catalogo.repositorio.TatuadorRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/** Si las tablas estan vacias, carga el catalogo del frontend desde src/main/resources/datos/*.json. */
@Component
public class DatosIniciales implements CommandLineRunner {

    private final CategoriaRepository categorias;
    private final DisenoRepository disenos;
    private final InsumoRepository insumos;
    private final TatuadorRepository tatuadores;
    private final ObjectMapper mapper;

    public DatosIniciales(CategoriaRepository categorias, DisenoRepository disenos, InsumoRepository insumos,
                          TatuadorRepository tatuadores, ObjectMapper mapper) {
        this.categorias = categorias;
        this.disenos = disenos;
        this.insumos = insumos;
        this.tatuadores = tatuadores;
        this.mapper = mapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categorias.count() == 0) {
            for (Categoria c : leer("datos/categorias.json", new TypeReference<List<Categoria>>() { })) {
                c.setId(null);
                categorias.save(c);
            }
        }
        if (disenos.count() == 0) {
            for (Diseno d : leer("datos/disenos.json", new TypeReference<List<Diseno>>() { })) {
                d.setId(null);
                disenos.save(d);
            }
        }
        if (insumos.count() == 0) {
            for (Insumo i : leer("datos/insumos.json", new TypeReference<List<Insumo>>() { })) {
                i.setId(null);
                insumos.save(i);
            }
        }
        if (tatuadores.count() == 0) {
            for (Tatuador t : leer("datos/tatuadores.json", new TypeReference<List<Tatuador>>() { })) {
                t.setId(null);
                tatuadores.save(t);
            }
        }
    }

    private <T> List<T> leer(String ruta, TypeReference<List<T>> tipo) throws IOException {
        try (InputStream json = new ClassPathResource(ruta).getInputStream()) {
            return mapper.readValue(json, tipo);
        }
    }
}
