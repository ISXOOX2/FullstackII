package cl.duoc.foreverink.carrito.exception;

/** Se lanza cuando se pide un recurso que no existe. El ControllerAdvice la convierte en 404. */
public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
