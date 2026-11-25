package cl.foreverink.reservas.repositorio;

import cl.foreverink.reservas.modelo.CambioEstado;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CambioEstadoRepository extends JpaRepository<CambioEstado, Long> {

    List<CambioEstado> findByOrdenIdOrderByFechaAsc(Long ordenId);
}
