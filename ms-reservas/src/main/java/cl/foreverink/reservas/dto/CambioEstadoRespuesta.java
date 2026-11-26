package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.CambioEstado;
import java.time.LocalDateTime;

/** Lo que la API devuelve de CambioEstado: un DTO, para no exponer la entidad JPA directamente. */
public record CambioEstadoRespuesta(
        Long id,
        Long ordenId,
        String de,
        String a,
        String motivo,
        String responsable,
        LocalDateTime fecha) {

    public static CambioEstadoRespuesta de(CambioEstado e) {
        return new CambioEstadoRespuesta(
                e.getId(),
                e.getOrdenId(),
                e.getDe(),
                e.getA(),
                e.getMotivo(),
                e.getResponsable(),
                e.getFecha());
    }
}
