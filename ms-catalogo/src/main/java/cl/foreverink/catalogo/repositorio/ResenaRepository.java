package cl.foreverink.catalogo.repositorio;

import cl.foreverink.catalogo.modelo.Resena;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    List<Resena> findAllByOrderByFechaDescIdDesc();

    Optional<Resena> findByUsuarioId(Long usuarioId);
}
