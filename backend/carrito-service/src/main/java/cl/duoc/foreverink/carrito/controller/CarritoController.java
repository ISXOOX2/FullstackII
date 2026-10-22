package cl.duoc.foreverink.carrito.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.foreverink.carrito.dto.CarritoDto;
import cl.duoc.foreverink.carrito.dto.CarritoRequest;
import cl.duoc.foreverink.carrito.dto.ItemRequest;
import cl.duoc.foreverink.carrito.service.CarritoService;
import jakarta.validation.Valid;

/**
 * API REST del carrito. {clave} identifica el carrito de cada cliente.
 *  - GET    /api/carritos/{clave}                      ver el carrito             -> 200
 *  - POST   /api/carritos/{clave}/items                agregar un diseño          -> 201
 *  - DELETE /api/carritos/{clave}/items/{productoId}   quitar un diseño           -> 204 / 404
 *  - PUT    /api/carritos/{clave}                      guardar el carrito entero  -> 200
 *  - DELETE /api/carritos/{clave}                      vaciar                     -> 204
 * Si producto-service dice que un diseño no existe -> 404; si no responde -> 503.
 */
@RestController
@RequestMapping("/api/carritos")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping("/{clave}")
    public ResponseEntity<CarritoDto> obtener(@PathVariable("clave") String clave) {
        return ResponseEntity.ok(carritoService.obtener(clave));
    }

    @PostMapping("/{clave}/items")
    public ResponseEntity<CarritoDto> agregar(@PathVariable("clave") String clave,
                                              @Valid @RequestBody ItemRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carritoService.agregar(clave, datos));
    }

    @DeleteMapping("/{clave}/items/{productoId}")
    public ResponseEntity<Void> quitar(@PathVariable("clave") String clave,
                                       @PathVariable("productoId") Long productoId) {
        carritoService.quitar(clave, productoId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{clave}")
    public ResponseEntity<CarritoDto> reemplazar(@PathVariable("clave") String clave,
                                                 @Valid @RequestBody CarritoRequest datos) {
        return ResponseEntity.ok(carritoService.reemplazar(clave, datos.getItems()));
    }

    @DeleteMapping("/{clave}")
    public ResponseEntity<Void> vaciar(@PathVariable("clave") String clave) {
        carritoService.vaciar(clave);
        return ResponseEntity.noContent().build();
    }
}
