package cl.duoc.foreverink.producto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.foreverink.producto.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
