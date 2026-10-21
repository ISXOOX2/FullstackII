package cl.duoc.foreverink.carrito.exception;

/** Se lanza cuando no se cumple una regla del negocio (ej. más de 5 unidades o sin cupos). Responde 409. */
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
