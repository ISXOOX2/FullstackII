package cl.foreverink.catalogo.repositorio;

import cl.foreverink.catalogo.modelo.Insumo;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    /** Articulos de la Tienda (consulta JPQL sobre el atributo aLaVenta). */
    @Query("select i from Insumo i where i.aLaVenta = true")
    List<Insumo> buscarALaVenta();
}
