package cl.duoc.foreverink.usuario.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de error estándar (guía 2.3.1, buena práctica 3): todas las respuestas de error de la
 * API tienen esta misma forma, así el frontend siempre sabe dónde leer el mensaje.
 * "campos" solo viene cuando fallan las validaciones (400).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDto {
    private int status;
    private String mensaje;
    private Map<String, String> campos;
    private LocalDateTime fecha;

    public ErrorDto(int status, String mensaje) {
        this(status, mensaje, null, LocalDateTime.now());
    }
}
