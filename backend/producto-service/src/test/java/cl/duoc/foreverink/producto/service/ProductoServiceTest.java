package cl.duoc.foreverink.producto.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.foreverink.producto.dto.ProductoRequest;
import cl.duoc.foreverink.producto.model.Producto;
import cl.duoc.foreverink.producto.repository.CategoriaRepository;
import cl.duoc.foreverink.producto.repository.ProductoRepository;

/**
 * Pruebas unitarias de ProductoService con JUnit 5 y Mockito.
 * Los repositorios son mocks (@Mock) y se inyectan en el servicio (@InjectMocks):
 * no se necesita MySQL para ejecutarlas.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProductoService - Pruebas unitarias")
class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @InjectMocks
    private ProductoService productoService;

    private ProductoRequest dtoTest;

    @BeforeEach
    void setUp() {
        dtoTest = new ProductoRequest();
        dtoTest.setCodigo("FI-001");
        dtoTest.setNombre("Mariposa lineal");
        dtoTest.setCategoriaId(1L);
        dtoTest.setPrecio(45000);
        dtoTest.setStock(5);
    }

    @Test
    @DisplayName("No deja crear un producto con un código que ya existe (409) y no guarda nada")
    void testCrearConCodigoRepetido() {
        // given: el repositorio dice que el código ya está usado
        when(productoRepository.existsByCodigoIgnoreCase("FI-001")).thenReturn(true);

        // when & then
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> productoService.crear(dtoTest));
        assertEquals(409, error.getStatusCode().value());
        assertEquals("Ya existe un producto con el código FI-001", error.getReason());
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    @DisplayName("Buscar un producto que no existe responde 404")
    void testObtenerProductoInexistente() {
        // given
        when(productoRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> productoService.obtener(999L));
        assertEquals(404, error.getStatusCode().value());
        assertEquals("No existe el producto con id 999", error.getReason());
    }
}
