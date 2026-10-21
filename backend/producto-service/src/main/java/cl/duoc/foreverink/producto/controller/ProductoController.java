package cl.duoc.foreverink.producto.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.foreverink.producto.dto.ProductoDto;
import cl.duoc.foreverink.producto.dto.ProductoRequest;
import cl.duoc.foreverink.producto.service.ProductoService;
import jakarta.validation.Valid;

/**
 * API REST de productos. Cada método devuelve un ResponseEntity con el código HTTP correcto
 * (guía 2.3.1): 200 al leer, 201 al crear, 204 al eliminar. Los 400, 404 y 409 los arma el
 * ManejadorGlobalErrores. Leer es público; crear, editar y eliminar requieren rol ADMIN.
 */
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /** GET /api/productos?categoriaId=1&soloOfertas=true */
    @GetMapping
    public ResponseEntity<List<ProductoDto>> listar(
            @RequestParam(name = "categoriaId", required = false) Long categoriaId,
            @RequestParam(name = "soloOfertas", defaultValue = "false") boolean soloOfertas) {
        return ResponseEntity.ok(productoService.listar(categoriaId, soloOfertas));
    }

    /** GET /api/productos/{id} -> 200 o 404 */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDto> obtener(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productoService.obtener(id));
    }

    /** POST /api/productos -> 201 Created, con el header Location apuntando al nuevo recurso. */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDto> crear(@Valid @RequestBody ProductoRequest datos) {
        ProductoDto creado = productoService.crear(datos);
        return ResponseEntity.created(URI.create("/api/productos/" + creado.id())).body(creado);
    }

    /** PUT /api/productos/{id} -> 200 o 404 */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDto> actualizar(@PathVariable("id") Long id,
                                                  @Valid @RequestBody ProductoRequest datos) {
        return ResponseEntity.ok(productoService.actualizar(id, datos));
    }

    /** DELETE /api/productos/{id} -> 204 No Content (éxito sin cuerpo) o 404 */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable("id") Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
