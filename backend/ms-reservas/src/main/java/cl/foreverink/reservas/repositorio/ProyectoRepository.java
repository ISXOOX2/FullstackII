package cl.foreverink.reservas.repositorio;

import cl.foreverink.reservas.modelo.Proyecto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    List<Proyecto> findAllByOrderByFechaDescIdDesc();
}
