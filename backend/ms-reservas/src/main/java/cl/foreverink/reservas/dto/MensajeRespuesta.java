package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.Mensaje;
import java.time.LocalDateTime;

/** Lo que la API devuelve de Mensaje: un DTO, para no exponer la entidad JPA directamente. */
public record MensajeRespuesta(
        Long id,
        String nombre,
        String correo,
        String comentario,
        LocalDateTime fecha) {

    public static MensajeRespuesta de(Mensaje e) {
        return new MensajeRespuesta(
                e.getId(),
                e.getNombre(),
                e.getCorreo(),
                e.getComentario(),
                e.getFecha());
    }
}
