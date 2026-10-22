package cl.duoc.foreverink.carrito.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad JPA: un diseño dentro de un carrito (tabla carrito_items).
 * "clave" identifica el carrito de cada cliente (su navegador): todas las filas con la misma
 * clave forman un carrito.
 * productoId es solo un número: el producto vive en producto-service (otra base de datos).
 * nombre, imagen, precio y stock son una copia de lo que respondió producto-service.
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "carrito_items")
public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clave;
    private Long productoId;
    private String nombre;
    private String imagen;
    private Integer precio;
    private Integer stock;
    private Integer cantidad;
}
