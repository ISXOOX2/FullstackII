package cl.foreverink.catalogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 60) String nombre,
        @Size(max = 500) String descripcion,
        @Size(max = 100) String imagen) {
}
