package cl.duoc.foreverink.producto.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad JPA: un diseño de tatuaje (tabla productos).
 * stock = cupos disponibles; stockCritico = nivel en que se alerta al administrador.
 * La entidad no se devuelve directo por la API: se convierte a ProductoDto (guía 2.3.1).
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;
    private String nombre;
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    private Integer precio;
    private Integer precioOferta;
    private Integer stock;
    private Integer stockCritico;
    private String tamano;
    private Double duracionHoras;
    private String zonas;
    private Integer nivelDolor;
    private String colorTinta;
    private Integer tatuadorId;
    private Boolean destacado = Boolean.FALSE;
    private String imagen;

    /** Galería: tabla producto_imagenes (una fila por imagen, ordenadas por la columna "orden"). */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
    @OrderColumn(name = "orden")
    @Column(name = "imagen")
    private List<String> imagenes = new ArrayList<>();
}
