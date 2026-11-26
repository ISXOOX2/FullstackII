package cl.foreverink.catalogo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Lo que manda el cliente. El usuarioId NO viene aqui: sale del token, asi nadie puede
 * publicar a nombre de otro. La imagen es opcional y solo se acepta como data URL JPG, PNG o WEBP.
 */
public record ResenaRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 60) String nombre,
        @NotNull(message = "Elige de 1 a 5 estrellas.") @Min(value = 1, message = "Elige de 1 a 5 estrellas.")
        @Max(value = 5, message = "Elige de 1 a 5 estrellas.") Integer estrellas,
        @NotBlank(message = "Cuentanos como te fue.")
        @Size(min = 10, max = 400, message = "El comentario debe tener entre 10 y 400 caracteres.") String comentario,
        @Size(max = 1500000, message = "La imagen no puede pesar mas de 1 MB.")
        @Pattern(regexp = "^$|^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$",
                 message = "La imagen debe ser JPG, PNG o WEBP.") String imagen) {
}
