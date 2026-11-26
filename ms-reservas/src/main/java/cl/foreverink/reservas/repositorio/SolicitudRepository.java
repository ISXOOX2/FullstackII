package cl.foreverink.reservas.repositorio;

import cl.foreverink.reservas.modelo.Solicitud;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByOrdenIdOrderByFechaDesc(Long ordenId);

    List<Solicitud> findByEstadoOrderByFechaAsc(String estado);

    boolean existsByOrdenIdAndEstado(Long ordenId, String estado);
}
