package cl.foreverink.reservas.servicio;

import cl.foreverink.reservas.cliente.CatalogoCliente;
import cl.foreverink.reservas.dto.AgendaTatuador;
import cl.foreverink.reservas.excepcion.ReglaNegocioException;
import cl.foreverink.reservas.modelo.Orden;
import cl.foreverink.reservas.repositorio.OrdenRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * Agenda del estudio (las mismas reglas de src/data/estudio.js del frontend):
 *  - atiende de martes a sabado, en 5 bloques: 11:00, 12:30, 14:00, 15:30 y 17:00;
 *  - se agenda desde manana y hasta 180 dias hacia adelante;
 *  - una hora PAGADA queda ocupada para ese tatuador.
 */
@Service
public class AgendaService {

    public static final List<String> HORAS = List.of("11:00", "12:30", "14:00", "15:30", "17:00");
    public static final Set<DayOfWeek> DIAS_ATENCION = Set.of(
            DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY);
    public static final int DIAS_MAXIMOS_AGENDA = 180;
    public static final int DIAS_ALERTA_AGENDA = 6;
    public static final int HORAS_LIBRES_CRITICAS = 6;

    private final OrdenRepository ordenes;
    private final CatalogoCliente catalogo;

    public AgendaService(OrdenRepository ordenes, CatalogoCliente catalogo) {
        this.ordenes = ordenes;
        this.catalogo = catalogo;
    }

    /** Horas libres de un tatuador en una fecha. ignorarOrdenId sirve al mover una cita (su hora no cuenta). */
    public List<String> horasDisponibles(LocalDate fecha, Long tatuadorId, Long ignorarOrdenId) {
        if (fecha == null || tatuadorId == null || !DIAS_ATENCION.contains(fecha.getDayOfWeek())) {
            return List.of();
        }
        List<String> ocupadas = ordenes.findByCitaFechaAndTatuadorIdAndEstado(fecha, tatuadorId, EstadosOrden.PAGADA)
                .stream()
                .filter(o -> !o.getId().equals(ignorarOrdenId))
                .map(Orden::getCitaHora)
                .toList();
        return HORAS.stream().filter(h -> !ocupadas.contains(h)).toList();
    }

    /** Revisa una cita completa y lanza un error claro si algo no cumple. */
    public void validarCita(LocalDate fecha, String hora, Long tatuadorId, Long ignorarOrdenId) {
        LocalDate hoy = LocalDate.now();
        if (fecha == null) {
            throw new ReglaNegocioException("Elige la fecha de tu cita.");
        }
        if (!fecha.isAfter(hoy)) {
            throw new ReglaNegocioException("Elige una fecha desde manana en adelante.");
        }
        if (fecha.isAfter(hoy.plusDays(DIAS_MAXIMOS_AGENDA))) {
            throw new ReglaNegocioException("Solo se puede agendar hasta " + DIAS_MAXIMOS_AGENDA + " dias hacia adelante.");
        }
        if (!DIAS_ATENCION.contains(fecha.getDayOfWeek())) {
            throw new ReglaNegocioException("El estudio atiende de martes a sabado.");
        }
        if (hora == null || !HORAS.contains(hora)) {
            throw new ReglaNegocioException("Elige un horario disponible.");
        }
        if (tatuadorId == null || !existeTatuador(tatuadorId)) {
            throw new ReglaNegocioException("Elige con quien quieres tatuarte.");
        }
        if (!horasDisponibles(fecha, tatuadorId, ignorarOrdenId).contains(hora)) {
            throw ReglaNegocioException.conflicto("Esa hora ya fue reservada. Elige otro horario.");
        }
    }

    private boolean existeTatuador(Long tatuadorId) {
        return catalogo.tatuadores().stream()
                .anyMatch(t -> t.get("id") instanceof Number n && n.longValue() == tatuadorId);
    }

    /** Alerta de agenda: horas libres de cada tatuador en los proximos dias de atencion. */
    public List<AgendaTatuador> agendaPorTatuador() {
        List<LocalDate> dias = new ArrayList<>();
        LocalDate dia = LocalDate.now();
        while (dias.size() < DIAS_ALERTA_AGENDA) {
            dia = dia.plusDays(1);
            if (DIAS_ATENCION.contains(dia.getDayOfWeek())) {
                dias.add(dia);
            }
        }
        List<AgendaTatuador> agenda = new ArrayList<>();
        for (Map<String, Object> t : catalogo.tatuadores()) {
            Long id = ((Number) t.get("id")).longValue();
            int libres = dias.stream().mapToInt(d -> horasDisponibles(d, id, null).size()).sum();
            int total = dias.size() * HORAS.size();
            agenda.add(new AgendaTatuador(id, String.valueOf(t.get("nombre")), libres, total,
                    libres <= HORAS_LIBRES_CRITICAS));
        }
        return agenda;
    }
}
