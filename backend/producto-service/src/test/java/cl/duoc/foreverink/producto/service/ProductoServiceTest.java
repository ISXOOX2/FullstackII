package cl.duoc.foreverink.producto.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import cl.duoc.foreverink.producto.dto.ProductoRequest;
import cl.duoc.foreverink.producto.exception.RecursoNoEncontradoException;
import cl.duoc.foreverink.producto.exception.ReglaNegocioException;
import cl.duoc.foreverink.producto.model.Producto;
import cl.duoc.foreverink.producto.repository.CategoriaRepository;
import cl.duoc.foreverink.producto.repository.ProductoRepository;

/**
 * Pruebas unitarias de ProductoService con JUnit 5 y Mockito.
 * Los repositorios se reemplazan por mocks: no se necesita MySQL para ejecutarlas.
 * Patrón AAA: Arrange (preparar), Act (actuar), Assert (verificar).
 */
class ProductoServiceTest {

    private ProductoRepository productoRepository;
    private ProductoService servicio;

    @BeforeEach
    void preparar() {
        productoRepository = mock(ProductoRepository.class);
        CategoriaRepository categoriaRepository = mock(CategoriaRepository.class);
        servicio = new ProductoService(productoRepository, categoriaRepository);
    }

    @Test
    @DisplayName("No deja crear un producto con un código que ya existe (409) y no guarda nada")
    void crearConCodigoRepetido() {
        // Arrange: el repositorio dice que el código ya está usado
        when(productoRepository.existsByCodigoIgnoreCase("FI-001")).thenReturn(true);
        ProductoRequest datos = new ProductoRequest("FI-001", "Mariposa lineal", null, 1L, 45000, null, 5, 2,
                null, null, null, null, null, null, false, null, List.of());

        // Act + Assert
        ReglaNegocioException error = assertThrows(ReglaNegocioException.class, () -> servicio.crear(datos));
        assertEquals("Ya existe un producto con el código FI-001", error.getMessage());
        verify(productoRepository, never()).save(any(Producto.class));
    }

    @Test
    @DisplayName("Buscar un producto que no existe lanza RecursoNoEncontrado (404)")
    void obtenerInexistente() {
        // Arrange
        when(productoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act + Assert
        RecursoNoEncontradoException error = assertThrows(RecursoNoEncontradoException.class,
                () -> servicio.obtener(999L));
        assertEquals("No existe el producto con id 999", error.getMessage());
    }
}
