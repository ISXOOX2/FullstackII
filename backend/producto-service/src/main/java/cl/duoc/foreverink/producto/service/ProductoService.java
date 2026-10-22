package cl.duoc.foreverink.producto.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.foreverink.producto.dto.CategoriaDto;
import cl.duoc.foreverink.producto.dto.ProductoDto;
import cl.duoc.foreverink.producto.dto.ProductoRequest;
import cl.duoc.foreverink.producto.model.Categoria;
import cl.duoc.foreverink.producto.model.Producto;
import cl.duoc.foreverink.producto.repository.CategoriaRepository;
import cl.duoc.foreverink.producto.repository.ProductoRepository;

/**
 * Reglas de negocio del catálogo. El controlador solo recibe y responde; aquí se valida,
 * se guarda en la base y se convierte la entidad en DTO.
 * Los errores se lanzan con ResponseStatusException y los convierte el GlobalExceptionHandler.
 */
@Service
public class ProductoService {

    private static final Logger log = LoggerFactory.getLogger(ProductoService.class);

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // ─── Categorías ──────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<CategoriaDto> listarCategorias() {
        log.info("Listando categorías");
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
        log.info("Listando productos categoriaId={} soloOfertas={}", categoriaId, soloOfertas);
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
        String codigo = datos.getCodigo().trim().toUpperCase();
        if (productoRepository.existsByCodigoIgnoreCase(codigo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con el código " + codigo);
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
        String codigo = datos.getCodigo().trim().toUpperCase();
        if (productoRepository.existsByCodigoIgnoreCaseAndIdNot(codigo, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otro producto con el código " + codigo);
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe el producto con id " + id));
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe la categoría con id " + id));
    }

    /** Regla: el precio de oferta solo vale si es menor que el precio normal. */
    private boolean estaEnOferta(Producto p) {
        return p.getPrecioOferta() != null && p.getPrecioOferta() < p.getPrecio();
    }

    private void copiarDatos(ProductoRequest datos, Producto destino) {
        if (datos.getPrecioOferta() != null && datos.getPrecioOferta() >= datos.getPrecio()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio de oferta debe ser menor que el precio normal");
        }
        destino.setCodigo(datos.getCodigo().trim().toUpperCase());
        destino.setNombre(datos.getNombre().trim());
        destino.setDescripcion(datos.getDescripcion());
        destino.setCategoria(buscarCategoria(datos.getCategoriaId()));
        destino.setPrecio(datos.getPrecio());
        destino.setPrecioOferta(datos.getPrecioOferta());
        destino.setStock(datos.getStock());
        destino.setStockCritico(datos.getStockCritico());
        destino.setTamano(datos.getTamano());
        destino.setDuracionHoras(datos.getDuracionHoras());
        destino.setZonas(datos.getZonas());
        destino.setNivelDolor(datos.getNivelDolor());
        destino.setColorTinta(datos.getColorTinta() != null ? datos.getColorTinta() : "Negro");
        destino.setTatuadorId(datos.getTatuadorId());
        destino.setDestacado(Boolean.TRUE.equals(datos.getDestacado()));
        String imagen = datos.getImagen() != null && !datos.getImagen().isBlank() ? datos.getImagen() : "mariposa-lineal";
        destino.setImagen(imagen);
        List<String> galeria = datos.getImagenes() != null && !datos.getImagenes().isEmpty()
                ? datos.getImagenes()
                : List.of(imagen);
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
                new ArrayList<>(p.getImagenes()));
    }
}
