package cl.duoc.foreverink.producto.dto;

/** Datos de una categoría que se exponen por la API. */
public record CategoriaDto(Long id, String nombre, String descripcion, String imagen) {
}
