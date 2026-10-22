package cl.duoc.foreverink.carrito.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO de salida: el carrito completo con sus ítems, el total a pagar y la cantidad de unidades. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoDto {
    private String clave;
    private List<ItemCarritoDto> items;
    private Integer total;
    private Integer cantidadTotal;
}
