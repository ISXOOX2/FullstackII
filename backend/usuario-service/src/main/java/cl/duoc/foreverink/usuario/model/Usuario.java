package cl.duoc.foreverink.usuario.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Entidad JPA: un usuario del sistema (tabla usuarios). La contraseña se guarda cifrada con BCrypt. */
@Data
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String run;
    private String nombre;
    private String apellidos;
    private String correo;
    private String password;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String region;
    private String comuna;
    private String direccion;
    private String tipo;

    /** Rol que usa Spring Security: Administrador -> ADMIN, Vendedor -> VENDEDOR, el resto -> CLIENTE. */
    public String getRol() {
        if ("Administrador".equals(tipo)) {
            return "ADMIN";
        }
        if ("Vendedor".equals(tipo)) {
            return "VENDEDOR";
        }
        return "CLIENTE";
    }
}
