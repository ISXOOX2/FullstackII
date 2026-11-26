package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.ItemOrden;

/** Lo que la API devuelve de ItemOrden: un DTO, para no exponer la entidad JPA directamente. */
public record ItemOrdenRespuesta(
        Long id,
        String tipo,
        Long productoId,
        Long articuloId,
        String nombre,
        Integer precio,
        Integer cantidad,
        Double anchoCm,
        Double altoCm) {

    public static ItemOrdenRespuesta de(ItemOrden e) {
        return new ItemOrdenRespuesta(
                e.getId(),
                e.getTipo(),
                e.getProductoId(),
                e.getArticuloId(),
                e.getNombre(),
                e.getPrecio(),
                e.getCantidad(),
                e.getAnchoCm(),
                e.getAltoCm());
    }
}
