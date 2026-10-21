package cl.duoc.foreverink.carrito.client;

/**
 * DTO con lo mínimo que carrito-service necesita de un producto (guía 2.2.1: "DTOs claros y
 * ligeros"). producto-service responde más campos; los que no están aquí se ignoran.
 */
public record ProductoRemotoDto(Long id, String nombre, String imagen, Integer precio,
                                Integer precioOferta, Integer stock) {

    /** Precio que se cobra: el de oferta si es menor que el normal. */
    public int precioFinal() {
        return precioOferta != null && precioOferta < precio ? precioOferta : precio;
    }
}
