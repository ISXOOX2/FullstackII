package cl.foreverink.catalogo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Datos para crear o editar un insumo. Si aLaVenta es true, precio, descripcion e imagen son obligatorios. */
public record InsumoRequest(
        @NotBlank(message = "El nombre es obligatorio.") @Size(max = 100) String nombre,
        @NotBlank(message = "Elige el tipo.") @Size(max = 40) String tipo,
        @NotBlank(message = "La unidad es obligatoria.") @Size(max = 30) String unidad,
        @NotNull(message = "El stock es obligatorio.") @Min(value = 0, message = "El stock no puede ser negativo.") Integer stock,
        @NotNull(message = "El stock critico es obligatorio.") @Min(value = 0, message = "El stock critico no puede ser negativo.") Integer stockCritico,
        Boolean aLaVenta,
        @Min(value = 1000, message = "El precio minimo es $1.000.") Integer precio,
        @Size(max = 200) String descripcion,
        @Size(max = 100) String imagen) {
}
