package cl.foreverink.catalogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record BloqueRequest(
        @NotBlank @Pattern(regexp = "^(p|h)$", message = "El tipo de bloque debe ser p (parrafo) o h (subtitulo).") String tipo,
        @NotBlank(message = "El bloque no puede estar vacio.") @Size(max = 2000) String texto) {
}
