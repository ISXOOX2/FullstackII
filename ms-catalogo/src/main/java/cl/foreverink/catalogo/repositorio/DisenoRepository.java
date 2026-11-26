package cl.foreverink.catalogo.repositorio;

import cl.foreverink.catalogo.modelo.Diseno;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisenoRepository extends JpaRepository<Diseno, Long> {

    List<Diseno> findByCategoriaId(Long categoriaId);
}
