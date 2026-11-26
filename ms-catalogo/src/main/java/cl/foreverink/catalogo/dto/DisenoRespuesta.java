package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Diseno;
import java.util.List;

/** Lo que la API devuelve de Diseno: un DTO, para no exponer la entidad JPA directamente. */
public record DisenoRespuesta(
        Long id,
        String codigo,
        String nombre,
        String descripcion,
        Long categoriaId,
        Integer precio,
        Integer precioOferta,
        Double anchoCm,
        Double altoCm,
        Double duracionHoras,
        String zonas,
        Integer nivelDolor,
        String colorTinta,
        Boolean destacado,
        String imagen,
        List<String> imagenes) {

    public static DisenoRespuesta de(Diseno e) {
        return new DisenoRespuesta(
                e.getId(),
                e.getCodigo(),
                e.getNombre(),
                e.getDescripcion(),
                e.getCategoriaId(),
                e.getPrecio(),
                e.getPrecioOferta(),
                e.getAnchoCm(),
                e.getAltoCm(),
                e.getDuracionHoras(),
                e.getZonas(),
                e.getNivelDolor(),
                e.getColorTinta(),
                e.getDestacado(),
                e.getImagen(),
                e.getImagenes() == null ? List.of() : List.copyOf(e.getImagenes()));
    }
}
