package cl.foreverink.reservas.repositorio;

import cl.foreverink.reservas.modelo.Mensaje;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    List<Mensaje> findAllByOrderByFechaDescIdDesc();
}
