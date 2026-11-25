package cl.foreverink.reservas.modelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Historial: cada vez que una orden cambia de estado se guarda quien, cuando y por que.
 */
@Entity
@Table(name = "historial_estados")
public class CambioEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ordenId;

    @Column(name = "estado_anterior", length = 20)
    private String de;

    @Column(name = "estado_nuevo", nullable = false, length = 20)
    private String a;

    @Column(length = 300)
    private String motivo;

    @Column(length = 100)
    private String responsable;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public CambioEstado() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrdenId() {
        return ordenId;
    }

    public void setOrdenId(Long ordenId) {
        this.ordenId = ordenId;
    }

    public String getDe() {
        return de;
    }

    public void setDe(String de) {
        this.de = de;
    }

    public String getA() {
        return a;
    }

    public void setA(String a) {
        this.a = a;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

}
