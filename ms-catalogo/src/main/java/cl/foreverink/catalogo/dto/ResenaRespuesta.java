package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Resena;
import java.time.LocalDate;

/** Lo que la API devuelve de Resena: un DTO, para no exponer la entidad JPA directamente. */
public record ResenaRespuesta(
        Long id,
        Long usuarioId,
        String nombre,
        Integer estrellas,
        String comentario,
        String imagen,
        LocalDate fecha,
        Long disenoId) {

    public static ResenaRespuesta de(Resena e) {
        return new ResenaRespuesta(
                e.getId(),
                e.getUsuarioId(),
                e.getNombre(),
                e.getEstrellas(),
                e.getComentario(),
                e.getImagen(),
                e.getFecha(),
                e.getDisenoId());
    }
}
