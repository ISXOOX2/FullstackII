package cl.duoc.foreverink.carrito.dto;

/** Un diseño del carrito tal como lo entrega la API. */
public record ItemCarritoDto(Long productoId, String nombre, String imagen, Integer precio,
                             Integer stock, Integer cantidad, Integer subtotal) {
}
