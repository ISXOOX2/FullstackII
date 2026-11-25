package cl.foreverink.usuarios.excepcion;

import org.springframework.http.HttpStatus;

/** Error de una regla de negocio. Llega al frontend como { "mensaje": "..." } con su codigo HTTP. */
public class ReglaNegocioException extends RuntimeException {

    private final HttpStatus estado;

    public ReglaNegocioException(String mensaje) {
        this(HttpStatus.BAD_REQUEST, mensaje);
    }

    public ReglaNegocioException(HttpStatus estado, String mensaje) {
        super(mensaje);
        this.estado = estado;
    }

    public static ReglaNegocioException noEncontrado(String mensaje) {
        return new ReglaNegocioException(HttpStatus.NOT_FOUND, mensaje);
    }

    public static ReglaNegocioException conflicto(String mensaje) {
        return new ReglaNegocioException(HttpStatus.CONFLICT, mensaje);
    }

    public static ReglaNegocioException prohibido(String mensaje) {
        return new ReglaNegocioException(HttpStatus.FORBIDDEN, mensaje);
    }

    public HttpStatus getEstado() {
        return estado;
    }
}
