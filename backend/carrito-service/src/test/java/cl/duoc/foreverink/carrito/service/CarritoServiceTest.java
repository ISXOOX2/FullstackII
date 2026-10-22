package cl.duoc.foreverink.carrito.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cl.duoc.foreverink.carrito.client.ProductoClient;
import cl.duoc.foreverink.carrito.client.ProductoRemotoDto;
import cl.duoc.foreverink.carrito.dto.CarritoDto;
import cl.duoc.foreverink.carrito.dto.ItemRequest;
import cl.duoc.foreverink.carrito.exception.ReglaNegocioException;
import cl.duoc.foreverink.carrito.model.Carrito;
import cl.duoc.foreverink.carrito.repository.CarritoRepository;

/**
 * Pruebas unitarias de CarritoService con JUnit 5 y Mockito.
 * producto-service (cliente Feign) y el repositorio se simulan: no hace falta levantar
 * otros microservicios ni MySQL.
 */
class CarritoServiceTest {

    private CarritoRepository carritoRepository;
    private ProductoClient productoClient;
    private CarritoService servicio;

    @BeforeEach
    void preparar() {
        carritoRepository = mock(CarritoRepository.class);
        productoClient = mock(ProductoClient.class);
        servicio = new CarritoService(carritoRepository, productoClient);
        // El carrito todavía no existe y "guardar" devuelve lo mismo que recibe
        when(carritoRepository.findByClave("navegador-1")).thenReturn(Optional.empty());
        when(carritoRepository.save(any(Carrito.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
    }

    @Test
    @DisplayName("Agrega un diseño con el precio de oferta que informa producto-service")
    void agregarUsaPrecioDeOferta() {
        // Arrange: producto-service responde precio 50.000, oferta 40.000 y 8 cupos
        when(productoClient.obtenerProducto(1L))
                .thenReturn(new ProductoRemotoDto(1L, "Mariposa lineal", "mariposa.webp", 50000, 40000, 8));

        // Act
        CarritoDto carrito = servicio.agregar("navegador-1", new ItemRequest(1L, 2));

        // Assert
        assertEquals(1, carrito.items().size());
        assertEquals(2, carrito.cantidadTotal());
        assertEquals(80000, carrito.total());
    }

    @Test
    @DisplayName("No deja reservar más cupos de los que hay disponibles")
    void noSuperaLosCupos() {
        // Arrange: solo quedan 2 cupos
        when(productoClient.obtenerProducto(1L))
                .thenReturn(new ProductoRemotoDto(1L, "Mariposa lineal", "mariposa.webp", 50000, null, 2));

        // Act + Assert
        ReglaNegocioException error = assertThrows(ReglaNegocioException.class,
                () -> servicio.agregar("navegador-1", new ItemRequest(1L, 3)));
        assertEquals("Solo puedes reservar hasta 2 unidad(es) de «Mariposa lineal»", error.getMessage());
        verify(carritoRepository, never()).save(any(Carrito.class));
    }
}
