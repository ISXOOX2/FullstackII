package cl.foreverink.catalogo.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

/** Resena de un cliente: de 1 a 5 estrellas, comentario y foto opcional (data URL). Una por cliente. */
@Entity
@Table(name = "resenas")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long usuarioId;

    @Column(nullable = false, length = 60)
    private String nombre;

    @Column(nullable = false)
    private Integer estrellas;

    @Column(nullable = false, length = 400)
    private String comentario;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imagen;

    @Column(nullable = false)
    private LocalDate fecha;

    private Long disenoId;
    public Resena() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getEstrellas() {
        return estrellas;
    }

    public void setEstrellas(Integer estrellas) {
        this.estrellas = estrellas;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
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

    public Long getDisenoId() {
        return disenoId;
    }

    public void setDisenoId(Long disenoId) {
        this.disenoId = disenoId;
    }
}
