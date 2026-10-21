# Forever Ink · Estudio de tatuajes (tienda + agendamiento de citas)

Proyecto de la asignatura **Desarrollo Fullstack II (DSY1104)** · DuocUC · Evaluación Parcial 2.
Sitio web de un estudio de tatuajes minimalista: el cliente elige diseños del catálogo, agenda su cita
(tatuador, fecha y hora) y paga en línea (pago simulado). El personal del estudio administra el catálogo,
las órdenes y los usuarios desde un panel.

**Tecnologías:** React 19 · Vite · react-router-dom (BrowserRouter) · react-bootstrap / Bootstrap 5 · axios ·
Jasmine + Karma + Testing Library (pruebas unitarias y cobertura).
**Backend:** 3 microservicios Spring Boot (Java 17) con MySQL, JWT y OpenFeign → ver [`backend/README.md`](backend/README.md).

## Equipo y reparto de responsabilidades

| | Isabel Cántaro · Tienda y compra | Eduardo Caro · Usuarios y panel | Yeremi Vásquez · Diseño, componentes base y datos |
|---|---|---|---|
| Páginas | Home, Productos, Detalle, Categorías, Ofertas, Carrito, Checkout, Compra exitosa, Pago fallido | Login, Registro, Perfil y `pages/admin` | Nosotros, Blogs, Detalle blog, Contacto, 404 |
| Componentes | ListaProductos, TarjetaProducto, Galeria, TablaCarrito, FormularioCheckout, ResumenOrden, Boleta | FormularioLogin, FormularioUsuario, FormularioProducto, FormularioCategoria, RutaProtegida, LayoutAdmin | Átomos, CampoFormulario, Header, Footer, LayoutTienda, Avisos, LimiteDeErrores |
| Lógica | Estado del carrito en `App.jsx`, carritoService, ordenesService, pagosService | Sesión en `App.jsx`, usuarios, productos, categorías y reportes, validaciones.js | `data/db.js`, seed.js, images.js, useFormulario.js, `tema.css`, `karma.conf.js` |
| Microservicio | carrito-service (8083) | usuario-service (8082) | producto-service (8081) |
| Pruebas | 1, 5, 8, 12, 15 | 6, 7, 9, 10, 13 | 2, 3, 4, 11, 14 |

La presentación es individual: cada integrante debe poder explicar todo el proyecto. El reparto indica
quién lidera y mantiene cada parte.

## Cómo ejecutarlo

Para usar los microservicios, primero enciende MySQL (XAMPP/Laragon) y levanta los 3 servicios como dice
[`backend/README.md`](backend/README.md). Si no están encendidos, la tienda funciona igual con sus datos locales.

```bash
npm install            # instala las dependencias (una sola vez)
npm run dev            # servidor de desarrollo -> http://localhost:5173
npm run build          # genera la versión final en /dist
npm run preview        # sirve /dist para revisarla
npm test               # corre las 15 pruebas (Karma + Jasmine) y genera el informe en /coverage
```

> `npm test` usa Chrome sin ventana (ChromeHeadless). Si Chrome no está en la ruta habitual,
> indica el ejecutable con la variable `CHROME_BIN`.

### ¿Y con "Open with Live Server" de VS Code?

El `index.html` de la raíz es código fuente (JSX): un servidor estático no puede ejecutarlo y por eso
saldría en blanco. Para usar Live Server:

1. Abre en VS Code la carpeta del proyecto (la que tiene `package.json`).
2. Ejecuta `npm run build`: crea la carpeta `dist/` con la versión compilada.
3. Clic derecho en `index.html` → *Open with Live Server*. El archivo `.vscode/settings.json` le indica a
   Live Server que sirva `dist/` y que responda `index.html` en cualquier ruta (necesario con BrowserRouter).

`dist/` no se sube al repositorio porque se genera sola; si cambias el código, vuelve a correr `npm run build`.

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
                           y api.js: conexión con los 3 microservicios usando axios
  utils/                   Funciones de apoyo: validaciones.js, formato.js, boleta.js y el hook
                           personalizado useFormulario.js (validación en tiempo real)
test/
  defensa.spec.jsx         Las 10 pruebas de la defensa (propuesta de pruebas del Anexo 1)
  complementarias.spec.jsx 5 pruebas más: CRUD, compra aprobada, todas las vistas, mock de producto-service
                           y Error Boundary
  ayudas.jsx, index.js     Funciones de apoyo y punto de entrada de Karma
docs/                      ERS, documento de cobertura de testing, guía de defensa y plan de estudio
backend/                   producto-service, usuario-service, carrito-service (Spring Boot) y colección Postman
```

## Decisiones técnicas (según el material de la asignatura)

- **Vite + React** (diapositivas React I) y **BrowserRouter en `main.jsx`** con `Routes`/`Route` en `App.jsx`
  (React II). Los detalles leen el id con `useParams` y el catálogo lee `?q=` con `useLocation` (2.2.1).
- **Imágenes importadas desde `src/assets`** (React III): `images.js` tiene un import por imagen y las junta en un
  objeto que se usa como `images.logo`.
- **Estado en el componente padre** (React II, Generador de Memes): sesión, carrito y avisos viven en `App.jsx` y
  bajan a las páginas por props.
- **Fuentes de Google Fonts** con `<link>` en el `<head>` de `index.html` (clase Css 2).
- **Atomic Design** para organizar los componentes (2.2.1) y principio de responsabilidad única (Anexo 1).
- **react-bootstrap** con solo el CSS de Bootstrap importado (guía 2.1.2): el JS de Bootstrap no es necesario.
- **Hoja de estilos** (1.2.4 y 1.2.6): una sola hoja propia, formato estándar, tabla de contenido, mobile first
  (`min-width`), imágenes con `max-width: 100%` y sin estilos en línea ni `!important`.
- **Error Boundary** (2.3.5) y **carga diferida** del panel con `React.lazy` + `Suspense` (2.3.3).
- **Pruebas** con Jasmine y Karma: `karma.conf.js` como la guía 2.3.2 (jasmine, ChromeHeadless, progress y coverage),
  webpack + babel para JSX (2.3.5), `renderHook`, `jasmine.createSpy`,
  `jasmine.createSpyObj`, `MemoryRouter` y comprobaciones `toBe` / `toBeTruthy` (React IV).
- **Conexión a la API con axios** (React V): `services/api.js` agrupa las peticiones GET/POST/PUT a los
  microservicios. Catálogo y detalle leen de producto-service, login y registro van a usuario-service (token JWT)
  y el carrito se guarda en carrito-service. En las pruebas, `api` se reemplaza por mocks (`jasmine.createSpy`).

## Datos: microservicios + respaldo local

Con los microservicios encendidos, catálogo, detalle, login, registro y carrito usan sus APIs. El panel de
administración, las órdenes y la agenda siguen sobre `src/data/db.js`, que además es el respaldo cuando un
microservicio no responde. `db.js` ofrece un CRUD genérico (`crear`, `listar`, `obtenerPorId`, `actualizar`,
`eliminar`) sobre `localStorage`, sembrado desde `seed.js`. Para volver a los datos originales basta con borrar
el almacenamiento del sitio en el navegador (o llamar a `reiniciarBD()`).


## Limitaciones conocidas (proyecto académico)

- En usuario-service las contraseñas se guardan cifradas con BCrypt. La copia local de respaldo (`localStorage`)
  las guarda en texto plano solo para que la demostración funcione sin backend.
- El panel de administración y las órdenes todavía trabajan sobre los datos locales.
- El pago es una **simulación** (`pagosService`): no se cobra dinero real ni se envían correos reales.
