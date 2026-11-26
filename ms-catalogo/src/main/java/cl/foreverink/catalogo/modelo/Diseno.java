package cl.foreverink.catalogo.modelo;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Diseno del catalogo. NO tiene stock: lo que se vende es la reserva de una hora para tatuarlo.
 * Tamano en centimetros (ancho y alto, entre 1 y 20 cm).
 */
@Entity
@Table(name = "disenos")
public class Diseno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Long categoriaId;

    @Column(nullable = false)
    private Integer precio;

    private Integer precioOferta;

    private Double anchoCm;

    private Double altoCm;

    private Double duracionHoras;

    @Column(length = 200)
    private String zonas;

    private Integer nivelDolor;

    @Column(length = 60)
    private String colorTinta;

    private Boolean destacado;

    @Column(length = 100)
    private String imagen;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "diseno_imagenes", joinColumns = @JoinColumn(name = "diseno_id"))
    @Column(name = "imagen", length = 100)
    @OrderColumn(name = "orden")
    private List<String> imagenes;

    public Diseno() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Integer getPrecio() {
        return precio;
    }

    public void setPrecio(Integer precio) {
        this.precio = precio;
    }

    public Integer getPrecioOferta() {
        return precioOferta;
    }

    public void setPrecioOferta(Integer precioOferta) {
        this.precioOferta = precioOferta;
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

    public Double getDuracionHoras() {
        return duracionHoras;
    }

    public void setDuracionHoras(Double duracionHoras) {
        this.duracionHoras = duracionHoras;
    }

    public String getZonas() {
        return zonas;
    }

    public void setZonas(String zonas) {
        this.zonas = zonas;
    }

    public Integer getNivelDolor() {
        return nivelDolor;
    }

    public void setNivelDolor(Integer nivelDolor) {
        this.nivelDolor = nivelDolor;
    }

    public String getColorTinta() {
        return colorTinta;
    }

    public void setColorTinta(String colorTinta) {
        this.colorTinta = colorTinta;
    }

    public Boolean getDestacado() {
        return destacado;
    }

    public void setDestacado(Boolean destacado) {
        this.destacado = destacado;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public List<String> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<String> imagenes) {
        this.imagenes = imagenes;
    }

}
