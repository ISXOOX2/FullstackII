package cl.duoc.foreverink.usuario.exception;

/** Se lanza cuando no se cumple una regla del negocio (ej. correo repetido). Responde 409. */
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
