package cl.duoc.foreverink.carrito.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.foreverink.carrito.client.ProductoClient;
import cl.duoc.foreverink.carrito.client.ProductoRemotoDto;
import cl.duoc.foreverink.carrito.dto.ItemRequest;
import cl.duoc.foreverink.carrito.model.CarritoItem;
import cl.duoc.foreverink.carrito.repository.CarritoItemRepository;

/**
 * Pruebas unitarias de CarritoService con JUnit 5 y Mockito.
 * El repositorio y el cliente Feign de producto-service son mocks (@Mock): no hace falta
 * levantar MySQL ni los otros microservicios.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CarritoService - Pruebas unitarias con Feign")
class CarritoServiceTest {

    @Mock
    private CarritoItemRepository carritoItemRepository;

    @Mock
    private ProductoClient productoClient;

    @InjectMocks
    private CarritoService carritoService;

    @Test
    @DisplayName("Agrega un diseño con el precio de oferta que informa producto-service")
    void testAgregarUsaPrecioDeOferta() {
        // given: producto-service responde precio 50.000, oferta 40.000 y 8 cupos
        when(productoClient.obtenerProducto(1L))
                .thenReturn(new ProductoRemotoDto(1L, "Mariposa lineal", "mariposa.webp", 50000, 40000, 8));

        // when
        carritoService.agregar("navegador-1", new ItemRequest(1L, 2));

        // then: se guardó el ítem con el precio de oferta y la cantidad pedida
        ArgumentCaptor<CarritoItem> guardado = ArgumentCaptor.forClass(CarritoItem.class);
        verify(carritoItemRepository).save(guardado.capture());
        assertEquals("navegador-1", guardado.getValue().getClave());
        assertEquals(40000, guardado.getValue().getPrecio());
        assertEquals(2, guardado.getValue().getCantidad());
    }

    @Test
    @DisplayName("No deja reservar más cupos de los que hay disponibles (409)")
    void testNoSuperaLosCupos() {
        // given: solo quedan 2 cupos
        when(productoClient.obtenerProducto(1L))
                .thenReturn(new ProductoRemotoDto(1L, "Mariposa lineal", "mariposa.webp", 50000, null, 2));

        // when & then
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> carritoService.agregar("navegador-1", new ItemRequest(1L, 3)));
        assertEquals(409, error.getStatusCode().value());
        assertEquals("Solo puedes reservar hasta 2 unidad(es) de «Mariposa lineal»", error.getReason());
        verify(carritoItemRepository, never()).save(any(CarritoItem.class));
    }

    @Test
    @DisplayName("Al sumar unidades no deja pasar de 5 del mismo diseño")
    void testMaximoCincoPorDiseno() {
        // given: el carrito ya tiene 4 unidades y hay 8 cupos
        CarritoItem existente = new CarritoItem();
        existente.setClave("navegador-1");
        existente.setProductoId(1L);
        existente.setCantidad(4);
        when(carritoItemRepository.findByClaveAndProductoId("navegador-1", 1L)).thenReturn(Optional.of(existente));
        when(productoClient.obtenerProducto(1L))
                .thenReturn(new ProductoRemotoDto(1L, "Mariposa lineal", "mariposa.webp", 50000, null, 8));

        // when & then: 4 + 2 = 6 supera el máximo de 5
        assertThrows(ResponseStatusException.class,
                () -> carritoService.agregar("navegador-1", new ItemRequest(1L, 2)));
        verify(carritoItemRepository, never()).save(any(CarritoItem.class));
    }
}
