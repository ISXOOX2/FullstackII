package cl.foreverink.catalogo.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Datos para crear o editar un diseno. El codigo (FI-###) lo asigna el servidor. */
public record DisenoRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.") String nombre,
        @Size(max = 500, message = "La descripcion no puede superar los 500 caracteres.") String descripcion,
        @NotNull(message = "Elige un estilo.") Long categoriaId,
        @NotNull(message = "El precio es obligatorio.") @Min(value = 0, message = "El precio no puede ser negativo.") Integer precio,
        @Min(value = 0, message = "El precio de oferta no puede ser negativo.") Integer precioOferta,
        @NotNull(message = "El ancho es obligatorio.")
        @DecimalMin(value = "1", message = "El ancho debe estar entre 1 y 20 cm.")
        @DecimalMax(value = "20", message = "El ancho debe estar entre 1 y 20 cm.") Double anchoCm,
        @NotNull(message = "El alto es obligatorio.")
        @DecimalMin(value = "1", message = "El alto debe estar entre 1 y 20 cm.")
        @DecimalMax(value = "20", message = "El alto debe estar entre 1 y 20 cm.") Double altoCm,
        @DecimalMin(value = "0.5", message = "La duracion minima es media hora.") Double duracionHoras,
        @Size(max = 200) String zonas,
        @Min(1) @Max(5) Integer nivelDolor,
        @Size(max = 60) String colorTinta,
        Boolean destacado,
        @Size(max = 100) String imagen,
        List<String> imagenes) {
}
