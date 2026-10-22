package cl.duoc.foreverink.carrito.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import cl.duoc.foreverink.carrito.dto.ErrorDto;
import feign.FeignException;

/**
 * Manejo de excepciones global con @RestControllerAdvice (guía 2.3.2).
 * Convierte cada excepción en una respuesta HTTP con el mismo ErrorDto, sin try/catch en los
 * controladores y sin mostrar el stack trace al cliente.
 * En el service los errores se lanzan con ResponseStatusException(HttpStatus.XXX, "mensaje").
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** 400: falló Bean Validation (@Valid). Devuelve el error de cada campo. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> campos.putIfAbsent(e.getField(), e.getDefaultMessage()));
        log.warn("Petición con datos inválidos: {}", campos);
        return ResponseEntity.badRequest()
                .body(new ErrorDto(400, "Hay datos inválidos en la petición", campos, LocalDateTime.now()));
    }

    /** 400: el JSON de la petición viene mal escrito. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorDto> handleJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(new ErrorDto(400, "La petición está mal formada"));
    }

    /** 404, 409, etc.: errores lanzados por el service con ResponseStatusException. */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorDto> handleResponseStatus(ResponseStatusException ex) {
        log.info("Error {}: {}", ex.getStatusCode().value(), ex.getReason());
        return ResponseEntity.status(ex.getStatusCode())
                .body(new ErrorDto(ex.getStatusCode().value(), ex.getReason()));
    }

    /**
     * Errores de comunicación con producto-service (guía 2.2.1: "manejar excepciones de
     * comunicación"): 404 si el diseño no existe; 503 si producto-service no responde.
     */
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ErrorDto> handleFeign(FeignException ex) {
        if (ex.status() == 404) {
            return ResponseEntity.status(404).body(new ErrorDto(404, "El diseño no existe en el catálogo"));
        }
        log.error("No se pudo comunicar con producto-service: {}", ex.getMessage());
        return ResponseEntity.status(503).body(new ErrorDto(503, "El catálogo no está disponible en este momento"));
    }

    /** 500: cualquier otro error inesperado. Se registra en el log y se oculta el detalle. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleException(Exception ex) {
        log.error("Error inesperado", ex);
        return ResponseEntity.status(500)
                .body(new ErrorDto(500, "Ocurrió un error inesperado"));
    }
}
