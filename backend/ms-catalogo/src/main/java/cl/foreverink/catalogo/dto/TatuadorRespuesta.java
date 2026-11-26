package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Tatuador;

/** Lo que la API devuelve de Tatuador: un DTO, para no exponer la entidad JPA directamente. */
public record TatuadorRespuesta(
        Long id,
        String nombre,
        String especialidad,
        String descripcion) {

    public static TatuadorRespuesta de(Tatuador e) {
        return new TatuadorRespuesta(
                e.getId(),
                e.getNombre(),
                e.getEspecialidad(),
                e.getDescripcion());
    }
}
