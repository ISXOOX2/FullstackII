# Forever Ink · Backend

Backend de **Forever Ink**, tienda online y agenda de un estudio de tatuajes (DSY1104 Desarrollo Fullstack II, DuocUC).
Son **3 microservicios Spring Boot 3** con **MySQL**, **Spring Security + JWT** y documentación **Swagger**.

- Frontend (React): https://github.com/ISXOOX2/FullstackII
- Equipo: Isabel Cántaro, Eduardo Caro y Yeremi Vásquez

## Microservicios

| Microservicio | Puerto | Ruta base | Qué hace | Swagger |
|---|---|---|---|---|
| `ms-auth` | 8081 | `/api/v1/usuarios` | Registro (solo mayores de 18), login y renovación con **JWT**, mantenedor de usuarios por rol | http://localhost:8081/swagger-ui.html |
| `ms-catalogo` | 8082 | `/api/v1/catalogo` y `/api/v1/blog` | Diseños, estilos, tatuadores, insumos con stock crítico, Tienda, reseñas y blog | http://localhost:8082/swagger-ui.html |
| `ms-reservas` | 8083 | `/api/v1/reservas` | Agenda, órdenes, pago simulado, reembolsos, cambios de hora, historial, Mi proyecto y contacto | http://localhost:8083/swagger-ui.html |

Cada microservicio tiene su propia base de datos (`foreverink_auth`, `foreverink_catalogo`, `foreverink_reservas`)
y se comunican **solo por API**: `ms-reservas` le pide a `ms-catalogo` los precios reales y que descuente o reponga stock.

## Estructura de cada microservicio

```
src/main/java/cl/foreverink/<ms>/
  modelo/        Entidades JPA
  repositorio/   Spring Data JPA
  servicio/      Reglas de negocio (con logs SLF4J)
  controlador/   API REST versionada (/api/v1) con ResponseEntity
  dto/           Entradas validadas (Bean Validation) y respuestas (...Respuesta)
  seguridad/     Filtro JWT
  excepcion/     ManejadorErrores (@RestControllerAdvice)
  config/        Swagger, Spring Security, CORS y datos iniciales
src/main/resources/
  db/migration/  Scripts Flyway (V1__..., V2__...)
  datos/         Datos de ejemplo en JSON
```

Buenas prácticas de las clases de Spring Boot:

- **Flyway:** las tablas las crean los scripts `db/migration/V1__*.sql`; Hibernate solo valida (`ddl-auto=validate`).
- **ResponseEntity + DTOs:** códigos 200, 201 Created y 204 No Content; nunca se devuelve la entidad JPA.
- **Manejo global de errores:** `{ "mensaje": "..." }` con 400, 403, 404, 409 o 500 (sin mostrar el stack trace).
- **Seguridad:** `ms-auth` firma el JWT (id, correo y rol, 8 horas, renovable) y los 3 lo verifican con la misma clave.
  Los permisos se revisan con `@PreAuthorize`. Las contraseñas se guardan con BCrypt.

## Abrir y ejecutar en IntelliJ IDEA

1. **File → Open** y elige esta carpeta (la del `pom.xml` principal). IntelliJ importa los 3 microservicios.
2. Usa **JDK 17** (File → Project Structure → SDK).
3. Ejecuta `AuthApplication`, `CatalogoApplication` y `ReservasApplication` (botón ▶).
   **Enciende ms-catalogo antes que ms-reservas.**
   - **Sin MySQL:** en *Edit Configurations* pon **Active profiles: `h2`** (base en memoria).
   - **Con MySQL** (XAMPP o Laragon, usuario `root` sin contraseña): las bases y tablas se crean solas.

Desde la terminal:

```bash
mvn package -DskipTests                       # compila los 3
cd ms-catalogo && mvn spring-boot:run          # uno por terminal
mvn spring-boot:run -Dspring-boot.run.profiles=h2   # sin MySQL
```

Para probar una ruta protegida en Swagger: `POST /api/v1/usuarios/auth/login` con
`{"correo": "admin.foreverink@gmail.com", "password": "Admin#123"}` (contraseña solo de desarrollo),
copia el `token`, presiona **Authorize** y pégalo.

## Pruebas

`pruebas/integracion.sh` levanta los 3 microservicios y recorre la API completa (roles, compra, stock entre
microservicios, reembolso, reseñas, proyectos y blog). Lo ejecuta GitHub Actions en cada cambio
(`.github/workflows/backend.yml`).

## Despliegue en AWS

El sistema completo (MySQL + estos 3 microservicios + el frontend con Nginx) se levanta con `docker compose`
desde el repositorio del frontend, en una instancia EC2 y con un solo link. Ver `despliegue/GUIA_AWS.md` en
https://github.com/ISXOOX2/FullstackII.
