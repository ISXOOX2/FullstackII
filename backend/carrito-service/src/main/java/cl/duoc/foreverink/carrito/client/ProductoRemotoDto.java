package cl.duoc.foreverink.carrito.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO con lo mínimo que carrito-service necesita de un producto (guía 2.2.1: "DTOs claros y
 * ligeros"). producto-service responde más campos; los que no están aquí se ignoran.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductoRemotoDto {
    private Long id;
    private String nombre;
    private String imagen;
    private Integer precio;
    private Integer precioOferta;
    private Integer stock;

    /** Precio que se cobra: el de oferta si es menor que el normal. */
    public int precioFinal() {
        return precioOferta != null && precioOferta < precio ? precioOferta : precio;
    }
}
