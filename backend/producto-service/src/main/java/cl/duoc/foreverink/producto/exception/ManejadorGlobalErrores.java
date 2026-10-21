package cl.duoc.foreverink.producto.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import cl.duoc.foreverink.producto.dto.ErrorDto;

/**
 * Manejo de excepciones global con @RestControllerAdvice (guía 2.3.2).
 * Convierte cada excepción en una respuesta HTTP correcta con el mismo DTO de error,
 * sin repetir try/catch en los controladores y sin mostrar el stack trace al cliente.
 */
@RestControllerAdvice
public class ManejadorGlobalErrores {

    private static final Logger log = LoggerFactory.getLogger(ManejadorGlobalErrores.class);

    /** 400: falló Bean Validation (@Valid). Devuelve el error de cada campo. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> validacion(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> campos.putIfAbsent(e.getField(), e.getDefaultMessage()));
        log.warn("Petición con datos inválidos: {}", campos);
        ErrorDto cuerpo = new ErrorDto(400, "Bad Request", "Hay datos inválidos en la petición",
                campos, LocalDateTime.now());
        return ResponseEntity.badRequest().body(cuerpo);
    }

    /** 400: el JSON viene mal formado o un parámetro tiene el tipo equivocado. */
    @ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class })
    public ResponseEntity<ErrorDto> peticionMalFormada(Exception ex) {
        return ResponseEntity.badRequest()
                .body(ErrorDto.de(400, "Bad Request", "La petición está mal formada"));
    }

    /** 404: el recurso no existe. */
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorDto> noEncontrado(RecursoNoEncontradoException ex) {
        log.info("Recurso no encontrado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorDto.de(404, "Not Found", ex.getMessage()));
    }

    /** 409: no se cumple una regla del negocio. */
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorDto> reglaNegocio(ReglaNegocioException ex) {
        log.info("Regla de negocio: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ErrorDto.de(409, "Conflict", ex.getMessage()));
    }

    /** 403: el usuario tiene sesión, pero su rol no tiene permiso (@PreAuthorize). */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDto> sinPermiso(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorDto.de(403, "Forbidden", "No tienes permiso para realizar esta acción"));
    }

    /** 500: cualquier otro error inesperado. Se registra en el log y se oculta el detalle. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> inesperado(Exception ex) {
        log.error("Error inesperado", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorDto.de(500, "Internal Server Error", "Ocurrió un error inesperado"));
    }
}
