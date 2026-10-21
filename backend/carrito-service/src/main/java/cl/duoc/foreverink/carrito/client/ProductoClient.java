package cl.duoc.foreverink.carrito.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign Client (guía 2.2.1): una interfaz "como si fuera un Repository", pero que hace
 * llamadas HTTP a otro microservicio. Spring crea la implementación sola.
 * Comunicación SÍNCRONA: carrito-service espera la respuesta de producto-service.
 */
@FeignClient(name = "producto-service", url = "${servicios.producto.url}")
public interface ProductoClient {

    /** Llama a GET http://localhost:8081/api/productos/{id} */
    @GetMapping("/api/productos/{id}")
    ProductoRemotoDto obtenerProducto(@PathVariable("id") Long id);
}
