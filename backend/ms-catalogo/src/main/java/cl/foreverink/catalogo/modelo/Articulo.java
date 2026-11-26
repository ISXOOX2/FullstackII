package cl.foreverink.catalogo.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

/**
 * Articulo del blog: imagen, titulo, resumen corto y cuerpo (lista de bloques).
 */
@Entity
@Table(name = "articulos")
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 300)
    private String resumen;

    @Column(length = 100)
    private String imagen;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 80)
    private String autor;

    @Column(length = 40)
    private String etiqueta;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "articulo_bloques", joinColumns = @JoinColumn(name = "articulo_id"))
    @OrderColumn(name = "orden")
    private List<Bloque> contenido;

    public Articulo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getResumen() {
        return resumen;
    }

    public void setResumen(String resumen) {
        this.resumen = resumen;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getEtiqueta() {
        return etiqueta;
    }

    public void setEtiqueta(String etiqueta) {
        this.etiqueta = etiqueta;
    }

    public List<Bloque> getContenido() {
        return contenido;
    }

    public void setContenido(List<Bloque> contenido) {
        this.contenido = contenido;
    }

}
