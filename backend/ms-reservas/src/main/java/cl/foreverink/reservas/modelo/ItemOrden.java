package cl.foreverink.reservas.modelo;

import jakarta.persistence.*;

/**
 * Linea de una orden. tipo "diseno" = reserva para tatuar (con tamano en cm);
 * tipo "articulo" = producto de la Tienda (cuidado o gift card).
 */
@Entity
@Table(name = "items_orden")
public class ItemOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String tipo;

    private Long productoId;

    private Long articuloId;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Integer precio;

    @Column(nullable = false)
    private Integer cantidad;

    private Double anchoCm;

    private Double altoCm;

    public ItemOrden() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Long getArticuloId() {
        return articuloId;
    }

    public void setArticuloId(Long articuloId) {
        this.articuloId = articuloId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getPrecio() {
        return precio;
    }

    public void setPrecio(Integer precio) {
        this.precio = precio;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Double getAnchoCm() {
        return anchoCm;
    }

    public void setAnchoCm(Double anchoCm) {
        this.anchoCm = anchoCm;
    }

    public Double getAltoCm() {
        return altoCm;
    }

    public void setAltoCm(Double altoCm) {
        this.altoCm = altoCm;
    }

}
