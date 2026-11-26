package cl.foreverink.auth.excepcion;

import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * Manejo global de errores (@RestControllerAdvice): toda la API responde los errores con el mismo
 * formato { "mensaje": "...", "errores": { campo: mensaje } } y el codigo HTTP que corresponde.
 * El frontend muestra "mensaje" (ver mensajeDeError en src/services/api.js).
 *   - Regla de negocio        -> el codigo de la regla (400, 403, 404, 409)
 *   - Validacion (@Valid)     -> 400 con el detalle por campo
 *   - Sin permiso (rol)       -> 403
 *   - Error inesperado        -> 500, sin mostrar el stack trace al usuario (queda en el log)
 */
@RestControllerAdvice
public class ManejadorErrores {

    private static final Logger log = LoggerFactory.getLogger(ManejadorErrores.class);

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<Map<String, Object>> reglaNegocio(ReglaNegocioException e) {
        log.warn("Regla de negocio ({}): {}", e.getEstado().value(), e.getMessage());
        return ResponseEntity.status(e.getEstado()).body(Map.of("mensaje", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacion(MethodArgumentNotValidException e) {
        Map<String, String> errores = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors()
                .forEach(error -> errores.putIfAbsent(error.getField(), String.valueOf(error.getDefaultMessage())));
        String primero = errores.isEmpty() ? "Revisa los datos enviados." : errores.values().iterator().next();
        log.warn("Datos invalidos: {}", errores.keySet());
        return ResponseEntity.badRequest().body(Map.of("mensaje", primero, "errores", errores));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> jsonInvalido(HttpMessageNotReadableException e) {
        log.warn("JSON invalido en la peticion");
        return ResponseEntity.badRequest().body(Map.of("mensaje", "El cuerpo de la peticion no es un JSON valido."));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> parametroInvalido(MethodArgumentTypeMismatchException e) {
        return ResponseEntity.badRequest().body(Map.of("mensaje", "El parametro " + e.getName() + " no es valido."));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> sinPermiso(AccessDeniedException e) {
        log.warn("Acceso denegado: el rol no tiene permiso");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("mensaje", "No tienes permiso para hacer esta accion."));
    }

    /** Cualquier otro error. Los de Spring (404 de ruta, metodo no permitido...) conservan su codigo. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> inesperado(Exception e) {
        if (e instanceof ErrorResponse respuesta) {
            return ResponseEntity.status(respuesta.getStatusCode())
                    .body(Map.of("mensaje", "No se pudo procesar la peticion (" + respuesta.getStatusCode().value() + ")."));
        }
        log.error("Error inesperado", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("mensaje", "Ocurrio un error inesperado en el servidor."));
    }
}
