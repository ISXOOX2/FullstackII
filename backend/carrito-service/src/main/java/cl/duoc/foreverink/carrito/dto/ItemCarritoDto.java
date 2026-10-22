package cl.duoc.foreverink.carrito.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO de salida: un diseño del carrito tal como lo entrega la API. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCarritoDto {
    private Long productoId;
    private String nombre;
    private String imagen;
    private Integer precio;
    private Integer stock;
    private Integer cantidad;
    private Integer subtotal;
}
