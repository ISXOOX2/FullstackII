package cl.foreverink.reservas.dto;

/** Horas libres de un tatuador en los proximos dias de atencion. pocas = true activa la alerta. */
public record AgendaTatuador(Long tatuadorId, String nombre, int libres, int total, boolean pocas) {
}
