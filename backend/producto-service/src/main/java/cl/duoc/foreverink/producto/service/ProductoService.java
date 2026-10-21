package cl.duoc.foreverink.producto.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.duoc.foreverink.producto.dto.CategoriaDto;
import cl.duoc.foreverink.producto.dto.ProductoDto;
import cl.duoc.foreverink.producto.dto.ProductoRequest;
import cl.duoc.foreverink.producto.exception.RecursoNoEncontradoException;
import cl.duoc.foreverink.producto.exception.ReglaNegocioException;
import cl.duoc.foreverink.producto.model.Categoria;
import cl.duoc.foreverink.producto.model.Producto;
import cl.duoc.foreverink.producto.repository.CategoriaRepository;
import cl.duoc.foreverink.producto.repository.ProductoRepository;

/**
 * Reglas de negocio del catálogo. El controlador solo recibe y responde; aquí se valida,
 * se guarda en la base y se convierte la entidad en DTO.
 */
@Service
public class ProductoService {

    private static final Logger log = LoggerFactory.getLogger(ProductoService.class);

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // ─── Categorías ──────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<CategoriaDto> listarCategorias() {
        return categoriaRepository.findAll().stream().map(this::aDto).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDto obtenerCategoria(Long id) {
        return aDto(buscarCategoria(id));
    }

    // ─── Productos (CRUD) ────────────────────────────────────────────────────

    /** Lista todos, o solo los de una categoría, o solo los que están en oferta. */
    @Transactional(readOnly = true)
    public List<ProductoDto> listar(Long categoriaId, boolean soloOfertas) {
        List<Producto> productos = categoriaId != null
                ? productoRepository.findByCategoriaIdOrderByIdAsc(categoriaId)
                : productoRepository.findAllByOrderByIdAsc();
        return productos.stream()
                .filter(p -> !soloOfertas || estaEnOferta(p))
                .map(this::aDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoDto obtener(Long id) {
        return aDto(buscarProducto(id));
    }

    @Transactional
    public ProductoDto crear(ProductoRequest datos) {
        if (productoRepository.existsByCodigoIgnoreCase(datos.codigo().trim())) {
            throw new ReglaNegocioException("Ya existe un producto con el código " + datos.codigo().trim().toUpperCase());
        }
        Producto producto = new Producto();
        copiarDatos(datos, producto);
        Producto guardado = productoRepository.save(producto);
        log.info("Producto creado id={} codigo={}", guardado.getId(), guardado.getCodigo());
        return aDto(guardado);
    }

    @Transactional
    public ProductoDto actualizar(Long id, ProductoRequest datos) {
        Producto producto = buscarProducto(id);
        if (productoRepository.existsByCodigoIgnoreCaseAndIdNot(datos.codigo().trim(), id)) {
            throw new ReglaNegocioException("Ya existe otro producto con el código " + datos.codigo().trim().toUpperCase());
        }
        copiarDatos(datos, producto);
        log.info("Producto actualizado id={}", id);
        return aDto(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscarProducto(id);
        productoRepository.delete(producto);
        log.info("Producto eliminado id={} codigo={}", id, producto.getCodigo());
    }

    // ─── Apoyo ───────────────────────────────────────────────────────────────

    private Producto buscarProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el producto con id " + id));
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la categoría con id " + id));
    }

    /** Regla: el precio de oferta solo vale si es menor que el precio normal. */
    private boolean estaEnOferta(Producto p) {
        return p.getPrecioOferta() != null && p.getPrecioOferta() < p.getPrecio();
    }

    private void copiarDatos(ProductoRequest datos, Producto destino) {
        if (datos.precioOferta() != null && datos.precioOferta() >= datos.precio()) {
            throw new ReglaNegocioException("El precio de oferta debe ser menor que el precio normal");
        }
        destino.setCodigo(datos.codigo().trim().toUpperCase());
        destino.setNombre(datos.nombre().trim());
        destino.setDescripcion(datos.descripcion());
        destino.setCategoria(buscarCategoria(datos.categoriaId()));
        destino.setPrecio(datos.precio());
        destino.setPrecioOferta(datos.precioOferta());
        destino.setStock(datos.stock());
        destino.setStockCritico(datos.stockCritico());
        destino.setTamano(datos.tamano());
        destino.setDuracionHoras(datos.duracionHoras());
        destino.setZonas(datos.zonas());
        destino.setNivelDolor(datos.nivelDolor());
        destino.setColorTinta(datos.colorTinta() != null ? datos.colorTinta() : "Negro");
        destino.setTatuadorId(datos.tatuadorId());
        destino.setDestacado(Boolean.TRUE.equals(datos.destacado()));
        String imagen = datos.imagen() != null && !datos.imagen().isBlank() ? datos.imagen() : "mariposa-lineal";
        destino.setImagen(imagen);
        List<String> galeria = datos.imagenes() != null && !datos.imagenes().isEmpty()
                ? new ArrayList<>(datos.imagenes())
                : new ArrayList<>(List.of(imagen));
        destino.getImagenes().clear();
        destino.getImagenes().addAll(galeria);
    }

    private CategoriaDto aDto(Categoria c) {
        return new CategoriaDto(c.getId(), c.getNombre(), c.getDescripcion(), c.getImagen());
    }

    private ProductoDto aDto(Producto p) {
        return new ProductoDto(p.getId(), p.getCodigo(), p.getNombre(), p.getDescripcion(),
                p.getCategoria().getId(), p.getCategoria().getNombre(),
                p.getPrecio(), p.getPrecioOferta(), p.getStock(), p.getStockCritico(),
                p.getTamano(), p.getDuracionHoras(), p.getZonas(), p.getNivelDolor(),
                p.getColorTinta(), p.getTatuadorId(), p.getDestacado(), p.getImagen(),
                List.copyOf(p.getImagenes()));
    }
}
