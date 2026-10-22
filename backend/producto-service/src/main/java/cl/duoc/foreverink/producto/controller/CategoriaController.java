package cl.duoc.foreverink.producto.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.foreverink.producto.dto.CategoriaDto;
import cl.duoc.foreverink.producto.service.ProductoService;

/** API REST de categorías (solo lectura). */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> listar() {
        return ResponseEntity.ok(productoService.listarCategorias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> obtener(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productoService.obtenerCategoria(id));
    }
}
