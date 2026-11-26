package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Categoria;

/** Lo que la API devuelve de Categoria: un DTO, para no exponer la entidad JPA directamente. */
public record CategoriaRespuesta(
        Long id,
        String nombre,
        String descripcion,
        String imagen) {

    public static CategoriaRespuesta de(Categoria e) {
        return new CategoriaRespuesta(
                e.getId(),
                e.getNombre(),
                e.getDescripcion(),
                e.getImagen());
    }
}
