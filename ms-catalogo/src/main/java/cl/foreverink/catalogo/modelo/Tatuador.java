package cl.foreverink.catalogo.modelo;

import jakarta.persistence.*;

/**
 * Tatuador o tatuadora del estudio (se elige al reservar).
 */
@Entity
@Table(name = "tatuadores")
public class Tatuador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(length = 120)
    private String especialidad;

    @Column(length = 500)
    private String descripcion;

    public Tatuador() {
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

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

}
