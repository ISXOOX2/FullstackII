package cl.foreverink.reservas.repositorio;

import cl.foreverink.reservas.modelo.Orden;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    List<Orden> findAllByOrderByFechaDesc();

    List<Orden> findByEstadoOrderByFechaDesc(String estado);

    List<Orden> findByCitaFechaAndTatuadorIdAndEstado(LocalDate citaFecha, Long tatuadorId, String estado);

    long countByFechaBetween(LocalDateTime desde, LocalDateTime hasta);
}
