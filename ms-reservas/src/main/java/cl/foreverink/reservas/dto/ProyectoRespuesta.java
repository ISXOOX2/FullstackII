package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.Proyecto;
import java.time.LocalDate;

/** Lo que la API devuelve de Proyecto: un DTO, para no exponer la entidad JPA directamente. */
public record ProyectoRespuesta(
        Long id,
        String nombre,
        String correo,
        String zonaCuerpo,
        String lado,
        String idea,
        String imagen,
        LocalDate fecha,
        LocalDate contactarAntesDe,
        String estado,
        Long usuarioId) {

    public static ProyectoRespuesta de(Proyecto e) {
        return new ProyectoRespuesta(
                e.getId(),
                e.getNombre(),
                e.getCorreo(),
                e.getZonaCuerpo(),
                e.getLado(),
                e.getIdea(),
                e.getImagen(),
                e.getFecha(),
                e.getContactarAntesDe(),
                e.getEstado(),
                e.getUsuarioId());
    }
}
