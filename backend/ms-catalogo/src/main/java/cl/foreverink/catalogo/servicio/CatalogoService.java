package cl.foreverink.catalogo.servicio;

import cl.foreverink.catalogo.dto.CategoriaRequest;
import cl.foreverink.catalogo.dto.DisenoRequest;
import cl.foreverink.catalogo.excepcion.ReglaNegocioException;
import cl.foreverink.catalogo.modelo.Categoria;
import cl.foreverink.catalogo.modelo.Diseno;
import cl.foreverink.catalogo.repositorio.CategoriaRepository;
import cl.foreverink.catalogo.repositorio.DisenoRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

/** Reglas de los disenos y estilos: codigo automatico FI-### y busqueda por estilo o texto. */
@Service
public class CatalogoService {

    private final DisenoRepository disenos;
    private final CategoriaRepository categorias;

    public CatalogoService(DisenoRepository disenos, CategoriaRepository categorias) {
        this.disenos = disenos;
        this.categorias = categorias;
    }

    // ── Disenos ────────────────────────────────────────────────────────────

    public List<Diseno> listarDisenos(Long categoriaId, String q) {
        List<Diseno> lista = categoriaId == null ? disenos.findAll() : disenos.findByCategoriaId(categoriaId);
        if (q == null || q.isBlank()) {
            return lista;
        }
        String texto = q.trim().toLowerCase(Locale.ROOT);
        return lista.stream()
                .filter(d -> d.getNombre().toLowerCase(Locale.ROOT).contains(texto)
                        || (d.getDescripcion() != null && d.getDescripcion().toLowerCase(Locale.ROOT).contains(texto)))
                .toList();
    }

    public Diseno obtenerDiseno(Long id) {
        return disenos.findById(id).orElseThrow(() -> ReglaNegocioException.noEncontrado("El diseno no existe."));
    }

    public Diseno crearDiseno(DisenoRequest datos) {
        Diseno nuevo = new Diseno();
        copiar(datos, nuevo);
        nuevo.setCodigo(siguienteCodigo());
        return disenos.save(nuevo);
    }

    public Diseno actualizarDiseno(Long id, DisenoRequest datos) {
        Diseno diseno = obtenerDiseno(id);
        copiar(datos, diseno); // el codigo no cambia
        return disenos.save(diseno);
    }

    public void eliminarDiseno(Long id) {
        disenos.delete(obtenerDiseno(id));
    }

    /** FI-001, FI-002... toma el numero mas alto y le suma uno. */
    public String siguienteCodigo() {
        int mayor = disenos.findAll().stream()
                .map(Diseno::getCodigo)
                .filter(c -> c != null && c.matches("FI-[0-9]+"))
                .mapToInt(c -> Integer.parseInt(c.substring(3)))
                .max().orElse(0);
        return String.format("FI-%03d", mayor + 1);
    }

    private void copiar(DisenoRequest datos, Diseno d) {
        if (!categorias.existsById(datos.categoriaId())) {
            throw new ReglaNegocioException("El estilo elegido no existe.");
        }
        if (datos.precioOferta() != null && datos.precioOferta() >= datos.precio()) {
            throw new ReglaNegocioException("El precio de oferta debe ser menor que el precio normal.");
        }
        d.setNombre(datos.nombre().trim());
        d.setDescripcion(datos.descripcion());
        d.setCategoriaId(datos.categoriaId());
        d.setPrecio(datos.precio());
        d.setPrecioOferta(datos.precioOferta());
        d.setAnchoCm(datos.anchoCm());
        d.setAltoCm(datos.altoCm());
        d.setDuracionHoras(datos.duracionHoras());
        d.setZonas(datos.zonas());
        d.setNivelDolor(datos.nivelDolor());
        d.setColorTinta(datos.colorTinta());
        d.setDestacado(Boolean.TRUE.equals(datos.destacado()));
        d.setImagen(datos.imagen());
        d.setImagenes(datos.imagenes() == null ? new ArrayList<>() : new ArrayList<>(datos.imagenes()));
    }

    // ── Estilos (categorias) ───────────────────────────────────────────────

    public List<Categoria> listarCategorias() {
        return categorias.findAll();
    }

    public Categoria obtenerCategoria(Long id) {
        return categorias.findById(id).orElseThrow(() -> ReglaNegocioException.noEncontrado("El estilo no existe."));
    }

    public Categoria guardarCategoria(Long id, CategoriaRequest datos) {
        Categoria c = id == null ? new Categoria() : obtenerCategoria(id);
        c.setNombre(datos.nombre().trim());
        c.setDescripcion(datos.descripcion());
        c.setImagen(datos.imagen());
        return categorias.save(c);
    }

    public void eliminarCategoria(Long id) {
        if (!disenos.findByCategoriaId(id).isEmpty()) {
            throw ReglaNegocioException.conflicto("No se puede eliminar un estilo que todavia tiene disenos.");
        }
        categorias.delete(obtenerCategoria(id));
    }
}
