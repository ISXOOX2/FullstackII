package cl.foreverink.catalogo.repositorio;

import cl.foreverink.catalogo.modelo.Tatuador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TatuadorRepository extends JpaRepository<Tatuador, Long> {
}
