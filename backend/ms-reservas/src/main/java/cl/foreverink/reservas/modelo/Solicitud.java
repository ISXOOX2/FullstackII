package cl.foreverink.reservas.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Solicitud del cliente sobre una orden pagada: "reembolso" o "cambio" de fecha y hora.
 * estado: "Pendiente", "Aprobada" o "Rechazada" (la responde el Administrador).
 */
@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ordenId;

    @Column(nullable = false, length = 10)
    private String tipo;

    @Column(nullable = false, length = 120)
    private String motivo;

    @Column(nullable = false, length = 300)
    private String justificativo;

    private LocalDate nuevaFecha;

    @Column(length = 5)
    private String nuevaHora;

    @Column(nullable = false, length = 12)
    private String estado;

    @Column(length = 300)
    private String respuesta;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public Solicitud() {
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getJustificativo() {
        return justificativo;
    }

    public void setJustificativo(String justificativo) {
        this.justificativo = justificativo;
    }

    public LocalDate getNuevaFecha() {
        return nuevaFecha;
    }

    public void setNuevaFecha(LocalDate nuevaFecha) {
        this.nuevaFecha = nuevaFecha;
    }

    public String getNuevaHora() {
        return nuevaHora;
    }

    public void setNuevaHora(String nuevaHora) {
        this.nuevaHora = nuevaHora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

}
