package cl.foreverink.auth.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger (OpenAPI 3). Documenta todos los endpoints en /swagger-ui.html.
 * "bearerAuth" agrega el boton Authorize para pegar el token JWT y probar las rutas protegidas.
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Forever Ink · ms-auth",
        version = "v1",
        description = "Microservicio de autenticacion: registro, inicio de sesion y renovacion con JWT y mantenedor de usuarios por rol. Forever Ink, DSY1104 Desarrollo Fullstack II."))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}
