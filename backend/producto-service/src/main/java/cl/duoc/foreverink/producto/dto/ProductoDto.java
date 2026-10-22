package cl.duoc.foreverink.producto.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de salida: lo que la API entrega de un producto (guía 2.2.1, "DTOs para comunicación").
 * Usa los mismos nombres de campos que el frontend en React, así los componentes muestran
 * estos datos sin cambios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDto {
    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private Long categoriaId;
    private String categoriaNombre;
    private Integer precio;
    private Integer precioOferta;
    private Integer stock;
    private Integer stockCritico;
    private String tamano;
    private Double duracionHoras;
    private String zonas;
    private Integer nivelDolor;
    private String colorTinta;
    private Integer tatuadorId;
    private Boolean destacado;
    private String imagen;
    private List<String> imagenes;
}
