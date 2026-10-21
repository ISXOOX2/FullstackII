package cl.duoc.foreverink.producto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.foreverink.producto.model.Producto;

/** Spring Data JPA crea las consultas a partir del nombre de cada método. */
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoriaIdOrderByIdAsc(Long categoriaId);

    List<Producto> findAllByOrderByIdAsc();

    boolean existsByCodigoIgnoreCase(String codigo);

    boolean existsByCodigoIgnoreCaseAndIdNot(String codigo, Long id);
}
