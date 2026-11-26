package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Articulo;
import java.time.LocalDate;
import java.util.List;

/** Lo que la API devuelve de Articulo: un DTO, para no exponer la entidad JPA directamente. */
public record ArticuloRespuesta(
        Long id,
        String titulo,
        String resumen,
        String imagen,
        LocalDate fecha,
        String autor,
        String etiqueta,
        List<BloqueRespuesta> contenido) {

    public static ArticuloRespuesta de(Articulo e) {
        return new ArticuloRespuesta(
                e.getId(),
                e.getTitulo(),
                e.getResumen(),
                e.getImagen(),
                e.getFecha(),
                e.getAutor(),
                e.getEtiqueta(),
                e.getContenido() == null ? List.of() : e.getContenido().stream().map(BloqueRespuesta::de).toList());
    }
}
