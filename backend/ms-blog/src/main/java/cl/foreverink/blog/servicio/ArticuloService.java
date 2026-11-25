package cl.foreverink.blog.servicio;

import cl.foreverink.blog.dto.ArticuloRequest;
import cl.foreverink.blog.excepcion.ReglaNegocioException;
import cl.foreverink.blog.modelo.Articulo;
import cl.foreverink.blog.modelo.Bloque;
import cl.foreverink.blog.repositorio.ArticuloRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ArticuloService {

    private final ArticuloRepository repositorio;

    public ArticuloService(ArticuloRepository repositorio) {
        this.repositorio = repositorio;
    }

    /** Del mas nuevo al mas antiguo: asi un articulo recien publicado aparece primero en el front. */
    public List<Articulo> listar() {
        return repositorio.findAllByOrderByFechaDescIdDesc();
    }

    public Articulo obtener(Long id) {
        return repositorio.findById(id).orElseThrow(() -> ReglaNegocioException.noEncontrado("El articulo no existe."));
    }

    public Articulo guardar(Long id, ArticuloRequest datos) {
        Articulo articulo = id == null ? new Articulo() : obtener(id);
        articulo.setTitulo(datos.titulo().trim());
        articulo.setResumen(datos.resumen().trim());
        articulo.setImagen(datos.imagen());
        articulo.setFecha(datos.fecha() == null ? LocalDate.now() : datos.fecha());
        articulo.setAutor(datos.autor() == null || datos.autor().isBlank() ? "Equipo Forever Ink" : datos.autor().trim());
        articulo.setEtiqueta(datos.etiqueta());
        articulo.setContenido(new ArrayList<>(datos.contenido().stream().map(b -> {
            Bloque bloque = new Bloque();
            bloque.setTipo(b.tipo());
            bloque.setTexto(b.texto().trim());
            return bloque;
        }).toList()));
        return repositorio.save(articulo);
    }

    public void eliminar(Long id) {
        repositorio.delete(obtener(id));
    }
}
