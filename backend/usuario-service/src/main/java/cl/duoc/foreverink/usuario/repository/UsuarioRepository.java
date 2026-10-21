package cl.duoc.foreverink.usuario.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.foreverink.usuario.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCaseAndIdNot(String correo, Long id);

    boolean existsByRunIgnoreCase(String run);

    boolean existsByRunIgnoreCaseAndIdNot(String run, Long id);

    long countByTipo(String tipo);

    List<Usuario> findAllByOrderByIdAsc();
}
