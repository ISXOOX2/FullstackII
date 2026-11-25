package cl.foreverink.blog.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

/** Datos para publicar o editar un articulo. Si no viene fecha, se usa la de hoy. */
public record ArticuloRequest(
        @NotBlank(message = "El titulo es obligatorio.") @Size(max = 150) String titulo,
        @NotBlank(message = "El resumen es obligatorio.") @Size(max = 300, message = "El resumen no puede superar los 300 caracteres.") String resumen,
        @Size(max = 100) String imagen,
        LocalDate fecha,
        @Size(max = 80) String autor,
        @Size(max = 40) String etiqueta,
        @NotEmpty(message = "El articulo necesita al menos un parrafo.") List<@Valid BloqueRequest> contenido) {
}
