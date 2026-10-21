package cl.duoc.foreverink.producto.dto;

import java.util.List;

/**
 * DTO de salida: lo que la API entrega de un producto (guía 2.2.1, "DTOs para comunicación").
 * Tiene los mismos nombres de campos que usa el frontend en React, para que los componentes
 * puedan mostrar estos datos sin cambios.
 */
public record ProductoDto(
        Long id,
        String codigo,
        String nombre,
        String descripcion,
        Long categoriaId,
        String categoriaNombre,
        Integer precio,
        Integer precioOferta,
        Integer stock,
        Integer stockCritico,
        String tamano,
        Double duracionHoras,
        String zonas,
        Integer nivelDolor,
        String colorTinta,
        Integer tatuadorId,
        Boolean destacado,
        String imagen,
        List<String> imagenes) {
}
