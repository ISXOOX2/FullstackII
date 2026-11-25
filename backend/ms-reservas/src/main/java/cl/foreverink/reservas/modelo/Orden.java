package cl.foreverink.reservas.modelo;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Orden de compra. Si tiene disenos lleva una cita (fecha, hora y tatuador);
 * si solo tiene articulos de la Tienda, la cita queda vacia (se retira en el estudio).
 * estado: "Pendiente", "Pagada", "Pago rechazado" o "Reembolsada".
 */
@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String numero;

    @Column(nullable = false)
    private Long usuarioId;

    @Column(nullable = false, length = 50)
    private String clienteNombre;

    @Column(nullable = false, length = 100)
    private String clienteApellidos;

    @Column(nullable = false, length = 100)
    private String clienteCorreo;

    @Column(nullable = false, length = 15)
    private String clienteTelefono;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(nullable = false)
    private Integer total;

    private LocalDate citaFecha;

    @Column(length = 5)
    private String citaHora;

    private Long tatuadorId;

    @Column(length = 80)
    private String zonaCuerpo;

    @Column(length = 300)
    private String indicaciones;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "orden_id")
    private List<ItemOrden> items;

    public Orden() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteApellidos() {
        return clienteApellidos;
    }

    public void setClienteApellidos(String clienteApellidos) {
        this.clienteApellidos = clienteApellidos;
    }

    public String getClienteCorreo() {
        return clienteCorreo;
    }

    public void setClienteCorreo(String clienteCorreo) {
        this.clienteCorreo = clienteCorreo;
    }

    public String getClienteTelefono() {
        return clienteTelefono;
    }

    public void setClienteTelefono(String clienteTelefono) {
        this.clienteTelefono = clienteTelefono;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public LocalDate getCitaFecha() {
        return citaFecha;
    }

    public void setCitaFecha(LocalDate citaFecha) {
        this.citaFecha = citaFecha;
    }

    public String getCitaHora() {
        return citaHora;
    }

    public void setCitaHora(String citaHora) {
        this.citaHora = citaHora;
    }

    public Long getTatuadorId() {
        return tatuadorId;
    }

    public void setTatuadorId(Long tatuadorId) {
        this.tatuadorId = tatuadorId;
    }

    public String getZonaCuerpo() {
        return zonaCuerpo;
    }

    public void setZonaCuerpo(String zonaCuerpo) {
        this.zonaCuerpo = zonaCuerpo;
    }

    public String getIndicaciones() {
        return indicaciones;
    }

    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }

    public List<ItemOrden> getItems() {
        return items;
    }

    public void setItems(List<ItemOrden> items) {
        this.items = items;
    }

}
