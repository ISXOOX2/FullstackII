# Forever Ink · Estudio de tatuajes (tienda + agendamiento de citas)

Proyecto de la asignatura **Desarrollo Fullstack II (DSY1104)** · DuocUC · Evaluación Final Transversal.

![CI](https://github.com/ISXOOX2/Forever_Ink/actions/workflows/ci.yml/badge.svg)

**Repositorios:** frontend (este) · backend en [ISXOOX2/Forever_Ink_Backend](https://github.com/ISXOOX2/Forever_Ink_Backend)

Sitio web de un estudio de tatuajes con estética manga: el cliente elige diseños del catálogo, agenda su cita
(tatuador, fecha y hora) y paga en línea (pago simulado). El personal del estudio administra el catálogo,
las órdenes y los usuarios desde un panel.

**Arquitectura:** frontend React + **3 microservicios Spring Boot** (auth, catálogo y reservas) con
MySQL, seguridad con **Spring Security + JWT**, documentación **Swagger** y despliegue en **AWS EC2** con un solo
link (Nginx + Docker Compose).

**Tecnologías:** React 19 · Vite · react-router-dom (BrowserRouter) · react-bootstrap / Bootstrap 5 · GSAP ·
Vitest + Testing Library + jsdom (pruebas unitarias y cobertura, clase React IV).

## Equipo y reparto de responsabilidades

| | Isabel Cántaro · Tienda y compra | Eduardo Caro · Usuarios y panel | Yeremi Vásquez · Diseño, componentes base y datos |
|---|---|---|---|
| Páginas | Home, Productos, Detalle, Tienda, Mi proyecto, Reseñas, Ofertas, Carrito, Checkout, Compra exitosa, Pago fallido | Login, Registro, Perfil y `pages/admin` | Nosotros, Blogs, Detalle blog, Contacto, 404 |
| Componentes | ListaProductos, TarjetaProducto, Galeria, TablaCarrito, FormularioCheckout, ResumenOrden, Boleta | FormularioLogin, FormularioUsuario, FormularioProducto, FormularioCategoria, RutaProtegida, LayoutAdmin | Átomos, CampoFormulario, Header, Footer, LayoutTienda, Avisos, LimiteDeErrores |
| Lógica | Estado del carrito en `App.jsx`, carritoService, ordenesService, pagosService | Sesión en `App.jsx`, usuarios, productos, categorías y reportes, validaciones.js | `data/db.js`, seed.js, images.js, useFormulario.js, `tema.css`, `vite.config.js` (pruebas) |
| Pruebas | 1, 5, 8, 12, 15 | 6, 7, 9, 10, 13 | 2, 3, 4, 11, 14 |

La presentación es individual: cada integrante debe poder explicar todo el proyecto. El reparto indica
quién lidera y mantiene cada parte.

## Cómo ejecutarlo

```bash
npm install            # instala las dependencias (una sola vez)
npm run dev            # servidor de desarrollo -> http://localhost:5173
npm run build          # genera la versión final en /dist
npm run preview        # sirve /dist para revisarla
npm test               # corre las 20 pruebas con Vitest
npm run test:watch     # modo interactivo: vuelve a correr las pruebas al guardar
npm run test:coverage  # pruebas + informe de cobertura (resumen en la terminal y coverage/index.html)
```

> Las pruebas corren en Node con **jsdom**, que simula el navegador: no hace falta tener Chrome abierto.

### ¿Y con "Open with Live Server" de VS Code?

El `index.html` de la raíz es código fuente (JSX): un servidor estático no puede ejecutarlo y por eso
saldría en blanco. Para usar Live Server:

1. Abre en VS Code la carpeta del proyecto (la que tiene `package.json`).
2. Ejecuta `npm run build`: crea la carpeta `dist/` con la versión compilada.
3. Clic derecho en `index.html` → *Open with Live Server*. El archivo `.vscode/settings.json` le indica a
   Live Server que sirva `dist/` y que responda `index.html` en cualquier ruta (necesario con BrowserRouter).

`dist/` no se sube al repositorio porque se genera sola; si cambias el código, vuelve a correr `npm run build`.

## Catálogo y diseño visual

- **5 estilos con 5 diseños cada uno (25 en total):** Kawaii, Anime, Tribal Y2K, Celestial y Cybersigilism.
  Las imágenes de los diseños están en `src/assets/images/disenos` (JPG optimizados, referenciados desde `src/assets/images.js`). Son material de referencia: antes de publicar, confirma su autoría o reemplázalas por arte propio o con licencia.
  No se usan personajes ni marcas de series existentes.
- **Estética manga** (`src/assets/css/tema.css`): tinta negra, trama de puntos de fondo, tarjetas como viñetas con
  borde grueso y sombra dura, portada con líneas de velocidad, acento rojo y tipografías Dela Gothic One + Jost.

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin.foreverink@gmail.com | Admin#123 |
| Vendedor | vendedor.foreverink@gmail.com | Venta#123 |
| Cliente | cliente.demo@gmail.com | Cliente#1 |

El **Vendedor** solo ve Órdenes y Productos (productos en modo lectura). El **Administrador** ve todo.

## Estructura del proyecto (Atomic Design)

```
src/
  main.jsx                 Arranque: estilos globales y <BrowserRouter> envolviendo a <App />
  App.jsx                  Estado compartido (sesión, carrito, avisos) que baja por props, Error Boundary
                           y todas las rutas (panel con React.lazy)
  assets/                  Recursos (diapositivas React III): lo que se ve pero no se programa
    images/                disenos/ · portadas/ · blog/ · marca/
    images.js              Importa todas las imágenes y las junta en un objeto (images.logo…)
    css/tema.css           Única hoja de estilos propia (sobre Bootstrap)
  components/
    atomos/                Piezas mínimas: Boton, Logo, InsigniaEstado, Cargando
    moleculas/             Combinan átomos: CampoFormulario, TarjetaProducto, Galeria, Migas…
    organismos/            Secciones completas: Header, ListaProductos, formularios, Boleta…
    plantillas/            Estructura de página: LayoutTienda y LayoutAdmin
    utilidades/            Sin interfaz propia: RutaProtegida, ScrollArriba, LimiteDeErrores
  pages/tienda, pages/admin  Páginas (una por ruta)
  data/                    "Base de datos" simulada: db.js (CRUD sobre localStorage), seed.js y datos fijos
                           (estudio.js: nombre, horarios y reglas de agenda; regiones, tatuadores, blogs)
  services/                Reglas de negocio (productos, carrito, órdenes, usuarios, pagos, reportes…)
  utils/                   Funciones de apoyo: validaciones.js, formato.js, boleta.js y el hook
                           personalizado useFormulario.js (validación en tiempo real)
test/
  defensa.test.jsx         Las 10 pruebas de la defensa (propuesta de pruebas del Anexo 1)
  complementarias.test.jsx 5 pruebas más: CRUD, compra aprobada, todas las vistas, XSS y Error Boundary
  nuevas.test.jsx          5 pruebas de las reglas nuevas: stock, zonas, estrellas, 3 días hábiles y reembolso de productos
  ayudas.jsx, setup.js     Funciones de apoyo y configuración inicial de Vitest (matchers de jest-dom)
docs/                      ERS, documento de cobertura de testing, guía de defensa y plan de estudio
e2e/                       Prueba de punta a punta del frontend con el backend (Playwright, la corre el CI)
backend/                   (no se sube) Copia local del repo Forever_Ink_Backend, la usa docker-compose
  pruebas/integracion.sh   Prueba de integración de la API completa
despliegue/                nginx.conf, .env.example y GUIA_AWS.md (EC2 paso a paso)
Dockerfile                 Imagen del frontend (Vite -> Nginx)
docker-compose.yml         MySQL + 3 microservicios + frontend: todo el sistema con un comando
```

## Decisiones técnicas (según el material de la asignatura)

- **Vite + React** (diapositivas React I) y **BrowserRouter en `main.jsx`** con `Routes`/`Route` en `App.jsx`
  (React II). Los detalles leen el id con `useParams` y el catálogo lee `?q=` con `useLocation` (2.2.1).
- **Imágenes importadas desde `src/assets`** (React III): `images.js` tiene un import por imagen y las junta en un
  objeto que se usa como `images.logo`.
- **Estado en el componente padre** (React II, Generador de Memes): sesión, carrito y avisos viven en `App.jsx` y
  bajan a las páginas por props.
- **Fuentes de Google Fonts** (Dela Gothic One y Jost) con `<link>` en el `<head>` de `index.html` (clase Css 2).
- **Atomic Design** para organizar los componentes (2.2.1) y principio de responsabilidad única (Anexo 1).
- **react-bootstrap** con solo el CSS de Bootstrap importado (guía 2.1.2): el JS de Bootstrap no es necesario.
- **Hoja de estilos** (1.2.4 y 1.2.6): una sola hoja propia, formato estándar, tabla de contenido, mobile first
  (`min-width`), imágenes con `max-width: 100%` y sin estilos en línea ni `!important`.
- **Animación del index con GSAP** (clase GSAP + React): `useRef` + `useGSAP` con `scope` en `Home.jsx`. Una
  *timeline* hace entrar el texto de la portada, las estrellas flotan con `repeat: -1` y `yoyo`, y cada sección
  aparece al hacer scroll con `ScrollTrigger` y `stagger`. Con `gsap.matchMedia` se respeta la preferencia de
  "reducir movimiento" del sistema.
- **Error Boundary** (2.3.5) y **carga diferida** del panel con `React.lazy` + `Suspense` (2.3.3).
- **Pruebas con Vitest** (clase React IV, por indicación del docente en lugar de Jasmine y Karma): se configura en
  `vite.config.js` con `environment: 'jsdom'`, archivos `*.test.jsx`, `describe` / `it` / `expect`, mocks con `vi.fn()`,
  `renderHook`, `MemoryRouter` y comprobaciones `toBe` / `toBeTruthy` / `toContain`. Cobertura con `@vitest/coverage-v8`.

## Backend: microservicios Spring Boot ([Forever_Ink_Backend](https://github.com/ISXOOX2/Forever_Ink_Backend))

| Microservicio | Puerto | Ruta base | Qué hace | Swagger local |
|---|---|---|---|---|
| `ms-auth` | 8081 | `/api/v1/usuarios` | Registro (solo mayores de 18), login y renovación con **JWT**, mantenedor de usuarios por rol | http://localhost:8081/swagger-ui.html |
| `ms-catalogo` | 8082 | `/api/v1/catalogo` y `/api/v1/blog` | Diseños (código FI-###), estilos, tatuadores, insumos con stock crítico, Tienda, reseñas y blog (el front lo vuelve a pedir cada 30 s) | http://localhost:8082/swagger-ui.html |
| `ms-reservas` | 8083 | `/api/v1/reservas` | Agenda, órdenes, pago simulado, reembolsos, cambios de hora, historial, Mi proyecto y contacto | http://localhost:8083/swagger-ui.html |

Cada microservicio sigue la estructura de la guía 3.1.2: `modelo` (entidades JPA), `repositorio`, `servicio`
(reglas de negocio), `controlador` (REST con rutas versionadas `/api/v1`), `dto` (validaciones), `seguridad`
(JWT) y `config` (Swagger, CORS, datos iniciales). Swagger usa **springdoc-openapi**, porque springfox (el de la
guía) no funciona con Spring Boot 3.

Buenas prácticas de las clases de Spring Boot (2.2.1, 2.3.1 y 2.3.2):

- **Migraciones con Flyway:** las tablas las crean los scripts `src/main/resources/db/migration/V1__....sql` de cada
  microservicio (y `V2__datos_iniciales_tatuadores.sql` carga datos). Hibernate solo valida (`ddl-auto=validate`).
- **ResponseEntity + DTOs:** los controladores responden `ResponseEntity` con el código correcto (200, 201 Created,
  204 No Content) y devuelven DTOs (`...Respuesta`), nunca la entidad JPA. Las entradas se validan con Bean Validation.
- **Manejo global de errores** con `@RestControllerAdvice` (`ManejadorErrores`): 400 con el detalle por campo,
  403, 404, 409 y 500 sin mostrar el stack trace.
- **Logs con SLF4J + Logback** en controladores y servicios (login, órdenes, pagos, stock y errores de comunicación).
- **Comunicación entre microservicios por API** (nunca a la base de otro): `ms-reservas` llama a `ms-catalogo`
  con RestClient, con timeouts y manejo de errores.

- **Seguridad:** `ms-auth` firma el token JWT (id, correo y rol) y los tres lo verifican con la misma clave.
  El token dura 8 horas. Si le quedan menos de 15 minutos, el front lo renueva solo (`POST /auth/renovar`). Si el
  backend responde 401 (token vencido o alterado), se cierra la sesión. La sesión sobrevive a la recarga.
  Los permisos se revisan con `@PreAuthorize("hasRole('ADMINISTRADOR')")`. Las contraseñas se guardan con BCrypt.
- **Comunicación entre microservicios:** `ms-reservas` consulta a `ms-catalogo` (RestClient) los precios reales
  (el navegador no puede cambiarlos) y le pide descontar o reponer el stock de la Tienda.
- **Base de datos:** MySQL, una base por microservicio (`foreverink_auth`, `_catalogo`, `_reservas`).
  Se crean solas, Flyway crea las tablas y se llenan con los mismos datos de ejemplo del frontend.

### Levantar el backend en tu PC

Requisitos: Java 17, Maven (o IntelliJ) y MySQL de XAMPP o Laragon encendido (usuario `root` sin contraseña).

El backend está en su propio repositorio. Lo más cómodo es abrirlo en **IntelliJ IDEA** (File → Open sobre la
carpeta del repo: el `pom.xml` principal importa los 3 microservicios).

```bash
git clone https://github.com/ISXOOX2/Forever_Ink_Backend.git
cd Forever_Ink_Backend/ms-catalogo && mvn spring-boot:run   # repetir en otra terminal para cada microservicio
```

Sin MySQL, con base en memoria: `mvn spring-boot:run -Dspring-boot.run.profiles=h2`.
`ms-reservas` necesita a `ms-catalogo` encendido.

Para usar el frontend con el backend, crea un `.env` (ver `.env.example`) con `VITE_USAR_API=true` y las
direcciones `http://localhost:808X/api/v1/...`, y ejecuta `npm run dev`.

### Todo junto con Docker (igual que en AWS)

```bash
git clone https://github.com/ISXOOX2/Forever_Ink_Backend.git backend   # el backend dentro de la carpeta backend/
cp despliegue/.env.example .env
docker compose up -d --build      # luego abre http://localhost
```

El paso a paso para **AWS EC2** está en [`despliegue/GUIA_AWS.md`](despliegue/GUIA_AWS.md).

### Pruebas automáticas en GitHub Actions

Cada cambio se prueba solo (`.github/workflows/ci.yml`), descargando el backend desde su repositorio:

1. Pruebas unitarias del front (Vitest).
2. `e2e/integracion-front.mjs` (Playwright) usa el frontend real conectado a los 3 microservicios.
3. `despliegue-docker` levanta el `docker-compose.yml` y revisa el link único y los 3 Swagger.

El repositorio del backend tiene su propio CI, que compila los 3 microservicios y recorre la API completa.

## Persistencia y modo sin backend

Con `VITE_USAR_API=true`, la API es la fuente de verdad. `src/services/sincronizacion.js` trae los datos de
los microservicios y guarda una copia en `src/data/db.js`, que es lo que leen las páginas. Así funcionan sin
cambios.

Con `VITE_USAR_API=false` (el valor por defecto), el sitio funciona sin backend. `src/data/db.js` ofrece un CRUD
genérico (`crear`, `listar`, `obtenerPorId`, `actualizar`, `eliminar`) sobre `localStorage`, sembrado desde
`seed.js`. Las 20 pruebas de Vitest usan este modo.

### Qué pasa por la API (con `VITE_USAR_API=true`)

| Ya va por la API | Sigue local (pendiente de conectar) |
|---|---|
| Login, registro y **renovación del token** (JWT), catálogo, Tienda, checkout y pago, horas libres, órdenes, reembolsos y cambios de hora, respuesta del admin, cambio de estado, blog, **CRUD del panel** (crear, editar y eliminar diseños, estilos, insumos y usuarios) y **Mi perfil** | Reseñas, Mi proyecto y contacto |

## Reglas de negocio agregadas por la retroalimentación

- **Tamaño en centímetros:** cada diseño tiene ancho y alto (`anchoCm`, `altoCm`) entre 1 y 20 cm. El cliente
  puede pedir su propio tamaño en el detalle del diseño, y queda en el carrito, la orden y la boleta.
- **Cambio de fecha y hora:** desde *Mi perfil*, hasta 24 horas antes de la cita, con motivo y justificativo.
  La nueva hora tiene que estar libre para el mismo tatuador.
- **Reembolso:** hasta 48 horas antes de la cita, con motivo y justificativo. Si se aprueba, la orden queda
  *Reembolsada* y la hora se libera.
- **Reembolso de productos de la tienda:** si el cliente se arrepiente, lo pide desde *Mi perfil* hasta 10 días
  después de la compra (producto sin abrir). Al aprobarlo, la orden queda *Reembolsada* y el stock vuelve a bodega.
- El **administrador** aprueba o rechaza las solicitudes desde el detalle de la orden (el vendedor solo las ve).
  Los plazos están en `src/data/estudio.js`.
- **Código de producto automático:** al crear un diseño se asigna el siguiente (`FI-031`, `FI-032`…) y no se
  puede editar.
- **Cambio manual de estado de una orden** (solo administrador, con motivo e historial). Cambios permitidos:
  Pendiente → Pagada o Pago rechazado · Pagada → Pago rechazado o Reembolsada · Pago rechazado → Pagada o
  Pendiente · Reembolsada no cambia más. Pasar a Pagada solo se permite si la hora sigue libre.
- **Se venden reservas, no productos con stock:** un diseño (por ejemplo, la nubecita kawaii) no se acaba; lo que
  se limita es la agenda. Por eso los diseños no tienen stock y el máximo es de 5 por reserva.
- **Insumos con stock crítico** (`/admin/insumos`, solo administrador): tintas, agujas, guantes, film, etc. Cada
  insumo tiene stock y stock crítico; cuando el stock es igual o menor al crítico aparece la alerta en el panel.
- **Tienda** (`/tienda`): algunos insumos se venden a los clientes (jabón, crema, film, bálsamo, protector solar,
  kit de cuidado y gift cards de $20.000, $50.000 y $100.000). En el panel se marcan con «Se vende en la Tienda»,
  con precio, descripción e imagen. No se puede llevar más de lo que hay en stock y el stock baja solo cuando el pago
  se aprueba. Si el carrito solo tiene artículos, no se pide cita: se retiran en el estudio.
- **Diseños como opción:** los diseños se siguen mostrando para el cliente que aún no tiene idea; se agregan a la
  reserva y al pagar se elige tatuador, fecha y hora.
- **Mi proyecto** (`/mi-proyecto`): el cliente que ya tiene una idea envía su nombre, correo, zona, la idea y una
  imagen de referencia opcional desde su dispositivo (JPG, PNG o WEBP de hasta 1 MB). El estudio lo contacta en
  **3 días hábiles**; el personal lo gestiona en `/admin/proyectos` (atrasado si pasa la fecha y sigue «Nuevo»).
- **Reseñas** (`/resenas`): estrellas de 1 (la peor) a 5 (la mejor), comentario y foto opcional. Solo los clientes
  con sesión pueden opinar (una reseña por cliente); el administrador puede eliminarlas. El Home muestra el promedio.
- **Zonas del cuerpo en lista desplegable:** en la reserva y en Mi proyecto la zona se elige de una lista fija
  (`ZONAS_CUERPO` en `estudio.js`) más el lado (izquierdo, derecho o centro); ya no se escribe a mano.
- **Sin menú de Estilos:** era redundante con Diseños; los estilos se filtran dentro de la página Diseños.
- **Alerta de agenda:** el panel muestra las horas libres de cada tatuador en los próximos 6 días de atención y
  avisa cuando a alguno le quedan 6 horas o menos. En el pago también se avisa al cliente si el tatuador elegido
  tiene pocas horas.
- **Usuarios mayores de 18:** la fecha de nacimiento y el teléfono son obligatorios (registro y panel). No se
  aceptan menores de edad.
- **Mapa en Nosotros:** un mapa interactivo de Google Maps (iframe, sin clave de API) con la dirección del
  estudio, más los botones «Cómo llegar» y «Abrir en Google Maps». Componente `moleculas/MapaUbicacion.jsx`.
- **Pruébalo en 3D:** el detalle de cada diseño enlaza a TryTattoo3D, un simulador gratuito para ver el tatuaje
  sobre un cuerpo en 3D.


## Limitaciones conocidas (proyecto académico)

- En el modo sin backend, las contraseñas de los usuarios de ejemplo están en texto plano en `localStorage`.
  Con el backend se guardan cifradas con BCrypt en MySQL.
- El pago es una **simulación** (`pagosService`): no se cobra dinero real ni se envían correos reales.
