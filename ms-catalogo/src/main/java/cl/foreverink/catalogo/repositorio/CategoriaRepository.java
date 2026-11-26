package cl.foreverink.catalogo.repositorio;

import cl.foreverink.catalogo.modelo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
