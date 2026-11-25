package cl.foreverink.reservas.servicio;

import java.util.List;
import java.util.Map;

/** Estados de una orden y los cambios manuales permitidos (los mismos del frontend). */
public final class EstadosOrden {

    public static final String PENDIENTE = "Pendiente";
    public static final String PAGADA = "Pagada";
    public static final String RECHAZADA = "Pago rechazado";
    public static final String REEMBOLSADA = "Reembolsada";

    /** Desde cada estado, a cuales puede pasar el Administrador. Reembolsada es final. */
    public static final Map<String, List<String>> TRANSICIONES = Map.of(
            PENDIENTE, List.of(PAGADA, RECHAZADA),
            PAGADA, List.of(RECHAZADA, REEMBOLSADA),
            RECHAZADA, List.of(PAGADA, PENDIENTE),
            REEMBOLSADA, List.of());

    private EstadosOrden() {
    }
}
