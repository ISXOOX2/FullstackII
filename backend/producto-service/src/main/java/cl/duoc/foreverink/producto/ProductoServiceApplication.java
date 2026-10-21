package cl.duoc.foreverink.producto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

/**
 * Microservicio de productos de Forever Ink (puerto 8081).
 * Es dueño de las tablas categorias, productos y producto_imagenes.
 *
 * Se excluye UserDetailsServiceAutoConfiguration porque aquí no hay usuarios ni login:
 * este servicio solo VALIDA los tokens JWT que firma usuario-service.
 */
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class ProductoServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductoServiceApplication.class, args);
    }
}
