# Forever Ink · Backend (3 microservicios Spring Boot)

| Microservicio | Puerto | Base de datos MySQL | Responsable | Qué hace |
|---|---|---|---|---|
| **producto-service** | 8081 | `foreverink_productos` | Yeremi Vásquez | Catálogo de diseños y categorías (CRUD; crear/editar/eliminar solo ADMIN) |
| **usuario-service** | 8082 | `foreverink_usuarios` | Eduardo Caro | Registro, login con **JWT**, datos del usuario, CRUD de usuarios (ADMIN) |
| **carrito-service** | 8083 | `foreverink_carritos` | Isabel Cántaro | Carrito por navegador. Le pregunta precio y stock a producto-service con **OpenFeign** |

```
 React (Vite :5173) ──axios──►  producto-service :8081 ──► MySQL foreverink_productos
        │            ──axios──►  usuario-service  :8082 ──► MySQL foreverink_usuarios
        └──────────────axios──►  carrito-service  :8083 ──► MySQL foreverink_carritos
                                        │
                                        └──Feign (GET /api/productos/{id})──► producto-service
```

Cada microservicio sigue las guías de DSY1103:

- **2.2.1 Migración de script y comunicación entre microservicios:** una base de datos por microservicio;
  las tablas no las crea Hibernate (`ddl-auto=none`): las crea **Flyway** con scripts versionados en
  `src/main/resources/db/migration` (`V1__init.sql` con la estructura y `V2__datos_iniciales.sql` con los datos).
  Flyway los ejecuta una sola vez al arrancar y anota cuáles aplicó en la tabla `flyway_schema_history`;
  un script ya ejecutado no se modifica, los cambios van en uno nuevo (`V3__...`). carrito-service se comunica con producto-service con **OpenFeign**
  y tiempos máximos de espera (si producto-service no responde → 503).
- **2.3.1 ResponseEntity y validaciones:** controladores con `ResponseEntity` y el código HTTP correcto
  (200, 201, 204, 400, 401, 403, 404, 409, 500, 503); DTOs con Bean Validation (`@NotBlank`, `@Size`,
  `@Pattern`, `@Min`, `@Max`, `@Past`, `@Email`) y `@Valid`; errores centralizados en un
  `@RestControllerAdvice` que siempre responde el mismo `ErrorDto { status, mensaje, campos }`.
- **2.3.2 Spring Security y manejo de logs:** API sin sesión (STATELESS) con token **JWT** firmado por
  usuario-service; producto-service valida el mismo token; contraseñas con **BCrypt**; permisos por rol con
  `@PreAuthorize("hasRole('ADMIN')")`; CORS para el frontend; logs con **SLF4J** (`log.info`, `log.warn`).

Estructura de cada microservicio (por capas): `controller` → `service` → `repository` → `model`,
más `dto`, `exception`, `config` y `security`.

## Requisitos

- Java 17 o superior y Maven (o IntelliJ / VS Code con Extension Pack for Java).
- MySQL de **XAMPP** o **Laragon** encendido en el puerto 3306, usuario `root` **sin contraseña**.
  (Si tu MySQL tiene contraseña, cámbiala en `spring.datasource.password` de cada `application.properties`.)
- No hay que crear las bases a mano: `createDatabaseIfNotExist=true` las crea al arrancar.

## Cómo levantar todo (en este orden)

1. XAMPP/Laragon → **Start MySQL**.
2. Una terminal por microservicio:

```bash
cd backend/producto-service && mvn spring-boot:run     # :8081
cd backend/usuario-service  && mvn spring-boot:run     # :8082
cd backend/carrito-service  && mvn spring-boot:run     # :8083 (necesita producto-service encendido)
```

   En IntelliJ: abrir cada carpeta como proyecto Maven y ejecutar la clase `...Application`.
3. En la raíz del proyecto: `npm run dev` → http://localhost:5173

El catálogo muestra **"Catálogo desde producto-service"** cuando está conectado. Si un microservicio está
apagado, la tienda sigue funcionando con los datos locales (`src/data/db.js`).

## Pruebas unitarias (JUnit 5 + Mockito)

Cada microservicio tiene pruebas en `src/test/java` que no necesitan MySQL ni los otros servicios:
los repositorios y el cliente Feign se reemplazan por mocks de Mockito.

```bash
cd backend/producto-service && mvn test
```

| Servicio | Prueba | Qué verifica |
|---|---|---|
| producto | `ProductoServiceTest` | No se crea un producto con código repetido; buscar un id inexistente da "no encontrado" |
| usuario | `ValidarRunTest`, `RolUtilTest` | Dígito verificador del RUN (incluida la K) y traducción de tipo de usuario a rol |
| carrito | `CarritoServiceTest` | Usa el precio de oferta que informa producto-service y no deja reservar más cupos de los que hay |

## Probar con Postman

Importar `backend/postman/ForeverInk.postman_collection.json`. Ejecutar primero
**usuario-service → 1. Login admin**: guarda el token en la variable `{{token}}`, que usan las peticiones
que requieren rol ADMIN. Cada carpeta incluye casos correctos y de error (400, 401, 404).

## Cuentas iniciales (V2__datos_iniciales.sql, contraseñas con BCrypt)

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin.foreverink@gmail.com | Admin#123 |
| Vendedor | vendedor.foreverink@gmail.com | Venta#123 |
| Cliente | cliente.demo@gmail.com | Cliente#1 |

## Endpoints

| Servicio | Método y ruta | Acceso | Respuestas |
|---|---|---|---|
| producto | `GET /api/productos` (`?categoriaId=`, `?soloOfertas=true`) | público | 200 |
| producto | `GET /api/productos/{id}` | público | 200, 404 |
| producto | `POST /api/productos` · `PUT /api/productos/{id}` · `DELETE /api/productos/{id}` | ADMIN | 201/200/204, 400, 401, 403, 404, 409 |
| producto | `GET /api/categorias` · `GET /api/categorias/{id}` | público | 200, 404 |
| usuario | `POST /api/auth/login` | público | 200 (token), 400, 401 |
| usuario | `POST /api/usuarios` (registro) | público | 201, 400, 409 |
| usuario | `GET /api/usuarios/me` | con token | 200, 401 |
| usuario | `GET /api/usuarios` · `GET/PUT/DELETE /api/usuarios/{id}` | ADMIN | 200/204, 400, 401, 403, 404, 409 |
| carrito | `GET /api/carritos/{clave}` | público | 200 |
| carrito | `POST /api/carritos/{clave}/items` | público | 201, 400, 404, 503 |
| carrito | `PUT /api/carritos/{clave}/items/{productoId}` · `DELETE ...` | público | 200/204, 400, 404 |
| carrito | `PUT /api/carritos/{clave}` (reemplaza todo) · `DELETE /api/carritos/{clave}` | público | 200/204, 400, 503 |

## Notas

- Si en la consola aparece un aviso de Hibernate o de Flyway sobre la versión de MariaDB (XAMPP trae MariaDB),
  es solo informativo: el conector de MySQL funciona igual.
- Para partir de cero con los datos iniciales: en phpMyAdmin borra la base del servicio (por ejemplo
  `foreverink_productos`) y vuelve a levantarlo; Flyway la vuelve a crear con V1 y V2.
- Puertos ocupados: cambia `server.port` en `application.properties` y la URL en `src/services/api.js`.
