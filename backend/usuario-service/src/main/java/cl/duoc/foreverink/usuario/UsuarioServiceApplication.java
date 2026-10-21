package cl.duoc.foreverink.usuario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Microservicio de usuarios de Forever Ink (puerto 8082).
 * Registro, inicio de sesión con JWT, roles (Administrador, Vendedor, Cliente) y mantenedor
 * de usuarios. Es dueño de la tabla usuarios.
 */
@SpringBootApplication
public class UsuarioServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UsuarioServiceApplication.class, args);
    }
}
