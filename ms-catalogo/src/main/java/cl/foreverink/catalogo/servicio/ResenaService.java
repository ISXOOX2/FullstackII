package cl.foreverink.catalogo.servicio;

import cl.foreverink.catalogo.dto.ResenaRequest;
import cl.foreverink.catalogo.excepcion.ReglaNegocioException;
import cl.foreverink.catalogo.modelo.Resena;
import cl.foreverink.catalogo.repositorio.ResenaRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ResenaService {

    private final ResenaRepository repositorio;

    public ResenaService(ResenaRepository repositorio) {
        this.repositorio = repositorio;
    }

    /** De la mas nueva a la mas antigua. */
    public List<Resena> listar() {
        return repositorio.findAllByOrderByFechaDescIdDesc();
    }

    /** Crea la resena del cliente o actualiza la que ya tenia (una por cliente). */
    public Resena guardarDe(Long usuarioId, ResenaRequest datos) {
        Resena resena = repositorio.findByUsuarioId(usuarioId).orElseGet(Resena::new);
        resena.setUsuarioId(usuarioId);
        resena.setNombre(datos.nombre().trim());
        resena.setEstrellas(datos.estrellas());
        resena.setComentario(datos.comentario().trim());
        resena.setImagen(datos.imagen() == null || datos.imagen().isBlank() ? "" : datos.imagen());
        resena.setFecha(LocalDate.now(ZoneId.of("America/Santiago")));
        return repositorio.save(resena);
    }

    public void eliminar(Long id) {
        Resena resena = repositorio.findById(id)
                .orElseThrow(() -> ReglaNegocioException.noEncontrado("La resena no existe."));
        repositorio.delete(resena);
    }
}
