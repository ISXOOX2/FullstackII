package cl.foreverink.catalogo.controlador;

import cl.foreverink.catalogo.dto.TatuadorRespuesta;
import cl.foreverink.catalogo.repositorio.TatuadorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/catalogo/tatuadores")
@Tag(name = "Tatuadores", description = "Equipo del estudio.")
public class TatuadorController {

    private static final Logger log = LoggerFactory.getLogger(TatuadorController.class);

    private final TatuadorRepository repositorio;

    public TatuadorController(TatuadorRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    @Operation(summary = "Listar tatuadores")
    public ResponseEntity<List<TatuadorRespuesta>> listar() {
        log.info("Listar tatuadores");
        return ResponseEntity.ok(repositorio.findAll().stream().map(TatuadorRespuesta::de).toList());
    }
}
