package cl.duoc.foreverink.carrito;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio del carrito (reserva) de Forever Ink (puerto 8083).
 * Guarda los diseños que el cliente quiere reservar. Para conocer el nombre, el precio y los
 * cupos de cada diseño se comunica con producto-service por REST usando Feign.
 *
 * @EnableFeignClients activa las interfaces @FeignClient del paquete client.
 */
@SpringBootApplication
@EnableFeignClients
public class CarritoServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarritoServiceApplication.class, args);
    }
}
