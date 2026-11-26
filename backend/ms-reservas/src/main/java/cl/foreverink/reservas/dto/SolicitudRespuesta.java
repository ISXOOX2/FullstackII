package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.Solicitud;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** Lo que la API devuelve de Solicitud: un DTO, para no exponer la entidad JPA directamente. */
public record SolicitudRespuesta(
        Long id,
        Long ordenId,
        String tipo,
        String motivo,
        String justificativo,
        LocalDate nuevaFecha,
        String nuevaHora,
        String estado,
        String respuesta,
        LocalDateTime fecha) {

    public static SolicitudRespuesta de(Solicitud e) {
        return new SolicitudRespuesta(
                e.getId(),
                e.getOrdenId(),
                e.getTipo(),
                e.getMotivo(),
                e.getJustificativo(),
                e.getNuevaFecha(),
                e.getNuevaHora(),
                e.getEstado(),
                e.getRespuesta(),
                e.getFecha());
    }
}
