package cl.duoc.foreverink.producto.dto;

import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para crear o editar un producto, con Bean Validation (guía 2.3.1).
 * Las reglas son las mismas del mantenedor de productos del frontend (ERS, sección 3.2.1).
 */
public record ProductoRequest(
        @NotBlank(message = "El código es obligatorio")
        @Size(min = 3, max = 30, message = "El código debe tener entre 3 y 30 caracteres")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre puede tener hasta 100 caracteres")
        String nombre,

        @Size(max = 500, message = "La descripción puede tener hasta 500 caracteres")
        String descripcion,

        @NotNull(message = "La categoría es obligatoria")
        Long categoriaId,

        @NotNull(message = "El precio es obligatorio")
        @Min(value = 0, message = "El precio no puede ser negativo")
        Integer precio,

        @Min(value = 0, message = "El precio de oferta no puede ser negativo")
        Integer precioOferta,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser negativo")
        Integer stock,

        @Min(value = 0, message = "El stock crítico no puede ser negativo")
        Integer stockCritico,

        @Size(max = 30, message = "El tamaño puede tener hasta 30 caracteres")
        String tamano,

        @DecimalMin(value = "0.5", message = "La duración mínima es 0,5 horas")
        Double duracionHoras,

        @Size(max = 150, message = "Las zonas pueden tener hasta 150 caracteres")
        String zonas,

        @Min(value = 1, message = "El nivel de dolor va de 1 a 5")
        @Max(value = 5, message = "El nivel de dolor va de 1 a 5")
        Integer nivelDolor,

        String colorTinta,
        Integer tatuadorId,
        Boolean destacado,
        String imagen,
        List<String> imagenes) {
}
