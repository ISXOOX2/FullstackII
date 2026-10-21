package cl.duoc.foreverink.producto.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO de error estándar (guía 2.3.1, buena práctica 3): todas las respuestas de error de la
 * API tienen esta misma forma, así el frontend siempre sabe dónde leer el mensaje.
 *  - campos: errores de validación por campo (solo en un 400).
 */
public record ErrorDto(
        int status,
        String error,
        String mensaje,
        Map<String, String> campos,
        LocalDateTime fecha) {

    public static ErrorDto de(int status, String error, String mensaje) {
        return new ErrorDto(status, error, mensaje, null, LocalDateTime.now());
    }
}
