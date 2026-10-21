package cl.duoc.foreverink.producto.exception;

/** Se lanza cuando no se cumple una regla del negocio (ej. código repetido). Responde 409. */
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
