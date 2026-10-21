package cl.duoc.foreverink.carrito.dto;

import java.util.List;

/** El carrito completo: ítems, total a pagar y cantidad total de unidades. */
public record CarritoDto(String clave, List<ItemCarritoDto> items, Integer total, Integer cantidadTotal) {
}
