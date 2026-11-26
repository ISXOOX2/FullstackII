package cl.foreverink.reservas.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;

/** "Mi proyecto": idea propia de un cliente. El estudio debe contactarlo antes de contactarAntesDe (3 dias habiles). */
@Entity
@Table(name = "proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String correo;

    @Column(nullable = false, length = 60)
    private String zonaCuerpo;

    @Column(length = 20)
    private String lado;

    @Column(nullable = false, length = 600)
    private String idea;

    // Texto largo (data URL de la imagen). LONGTEXT en MySQL; sin @Lob para que H2 y MySQL validen igual
    @Column(columnDefinition = "LONGTEXT")
    private String imagen;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalDate contactarAntesDe;

    @Column(nullable = false, length = 30)
    private String estado;

    private Long usuarioId;
    public Proyecto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getZonaCuerpo() {
        return zonaCuerpo;
    }

    public void setZonaCuerpo(String zonaCuerpo) {
        this.zonaCuerpo = zonaCuerpo;
    }

    public String getLado() {
        return lado;
    }

    public void setLado(String lado) {
        this.lado = lado;
    }

    public String getIdea() {
        return idea;
    }

    public void setIdea(String idea) {
        this.idea = idea;
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

    public LocalDate getContactarAntesDe() {
        return contactarAntesDe;
    }

    public void setContactarAntesDe(LocalDate contactarAntesDe) {
        this.contactarAntesDe = contactarAntesDe;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
