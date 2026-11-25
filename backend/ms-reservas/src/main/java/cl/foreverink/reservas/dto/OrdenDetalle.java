package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.CambioEstado;
import cl.foreverink.reservas.modelo.Orden;
import cl.foreverink.reservas.modelo.Solicitud;
import java.util.List;

/** Una orden con sus solicitudes y su historial de estados. */
public record OrdenDetalle(Orden orden, List<Solicitud> solicitudes, List<CambioEstado> historial) {
}
