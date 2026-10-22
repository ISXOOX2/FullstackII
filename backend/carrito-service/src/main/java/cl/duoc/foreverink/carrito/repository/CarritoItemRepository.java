package cl.duoc.foreverink.carrito.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.foreverink.carrito.model.CarritoItem;

/** Spring Data JPA crea las consultas a partir del nombre de cada método. */
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {

    /** Todos los diseños del carrito de un cliente. */
    List<CarritoItem> findByClaveOrderByIdAsc(String clave);

    /** Un diseño puntual dentro del carrito (para sumar unidades o quitarlo). */
    Optional<CarritoItem> findByClaveAndProductoId(String clave, Long productoId);
}
