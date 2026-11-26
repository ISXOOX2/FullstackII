package cl.foreverink.catalogo.repositorio;

import cl.foreverink.catalogo.modelo.Articulo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticuloRepository extends JpaRepository<Articulo, Long> {

    List<Articulo> findAllByOrderByFechaDescIdDesc();
}
