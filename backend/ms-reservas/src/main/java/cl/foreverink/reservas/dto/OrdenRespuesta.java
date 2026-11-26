package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.Orden;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** Lo que la API devuelve de Orden: un DTO, para no exponer la entidad JPA directamente. */
public record OrdenRespuesta(
        Long id,
        String numero,
        Long usuarioId,
        String clienteNombre,
        String clienteApellidos,
        String clienteCorreo,
        String clienteTelefono,
        LocalDateTime fecha,
        String estado,
        Integer total,
        LocalDate citaFecha,
        String citaHora,
        Long tatuadorId,
        String zonaCuerpo,
        String indicaciones,
        List<ItemOrdenRespuesta> items) {

    public static OrdenRespuesta de(Orden e) {
        return new OrdenRespuesta(
                e.getId(),
                e.getNumero(),
                e.getUsuarioId(),
                e.getClienteNombre(),
                e.getClienteApellidos(),
                e.getClienteCorreo(),
                e.getClienteTelefono(),
                e.getFecha(),
                e.getEstado(),
                e.getTotal(),
                e.getCitaFecha(),
                e.getCitaHora(),
                e.getTatuadorId(),
                e.getZonaCuerpo(),
                e.getIndicaciones(),
                e.getItems() == null ? List.of() : e.getItems().stream().map(ItemOrdenRespuesta::de).toList());
    }
}
