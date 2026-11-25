package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.modelo.Tatuador;
import cl.foreverink.catalogo.repositorio.TatuadorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/catalogo/tatuadores")
@Tag(name = "Tatuadores", description = "Equipo del estudio.")
public class TatuadorController {

    private final TatuadorRepository repositorio;

    public TatuadorController(TatuadorRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    @Operation(summary = "Listar tatuadores")
    public List<Tatuador> listar() {
        return repositorio.findAll();
    }
}
