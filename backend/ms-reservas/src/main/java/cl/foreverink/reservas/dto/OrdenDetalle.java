package cl.foreverink.reservas.dto;

import cl.foreverink.reservas.modelo.CambioEstado;
import cl.foreverink.reservas.modelo.Orden;
import cl.foreverink.reservas.modelo.Solicitud;
import java.util.List;

/** Una orden con sus solicitudes y su historial de estados. */
public record OrdenDetalle(OrdenRespuesta orden, List<SolicitudRespuesta> solicitudes, List<CambioEstadoRespuesta> historial) {

    public static OrdenDetalle de(Orden orden, List<Solicitud> solicitudes, List<CambioEstado> historial) {
        return new OrdenDetalle(OrdenRespuesta.de(orden),
                solicitudes.stream().map(SolicitudRespuesta::de).toList(),
                historial.stream().map(CambioEstadoRespuesta::de).toList());
    }
}
