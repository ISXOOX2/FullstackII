package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Insumo;
import com.fasterxml.jackson.annotation.JsonProperty;

/** Lo que la API devuelve de Insumo: un DTO, para no exponer la entidad JPA directamente. */
public record InsumoRespuesta(
        Long id,
        String codigo,
        String nombre,
        String tipo,
        String unidad,
        Integer stock,
        Integer stockCritico,
        @JsonProperty("aLaVenta") Boolean aLaVenta,
        Integer precio,
        String descripcion,
        String imagen) {

    public static InsumoRespuesta de(Insumo e) {
        return new InsumoRespuesta(
                e.getId(),
                e.getCodigo(),
                e.getNombre(),
                e.getTipo(),
                e.getUnidad(),
                e.getStock(),
                e.getStockCritico(),
                e.getaLaVenta(),
                e.getPrecio(),
                e.getDescripcion(),
                e.getImagen());
    }
}
