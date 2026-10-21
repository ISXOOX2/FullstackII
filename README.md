# Forever Ink · Estudio de tatuajes (tienda + agendamiento de citas)

Proyecto de la asignatura **Desarrollo Fullstack II (DSY1104)** · DuocUC · Evaluación Parcial 2.
Sitio web de un estudio de tatuajes minimalista: el cliente elige diseños del catálogo, agenda su cita
(tatuador, fecha y hora) y paga en línea (pago simulado). El personal del estudio administra el catálogo,
las órdenes y los usuarios desde un panel.

**Tecnologías:** React 19 · Vite · react-router-dom (BrowserRouter) · react-bootstrap / Bootstrap 5 ·
Jasmine + Karma + Testing Library (pruebas unitarias y cobertura).

**Autora:** Isabel Cántaro.

## Cómo ejecutarlo

```bash
npm install            # instala las dependencias (una sola vez)
npm run dev            # servidor de desarrollo -> http://localhost:5173
npm run build          # genera la versión final en /dist
npm run preview        # sirve /dist para revisarla
npm test               # corre las 15 pruebas (Karma + Jasmine) y genera el informe en /coverage
npm run test:defensa   # corre solo las 10 pruebas de la defensa, mostrando el nombre de cada una
```

> `npm test` usa Chrome sin ventana (ChromeHeadless). Si Chrome no está en la ruta habitual,
> indica el ejecutable con la variable `CHROME_BIN`. En Linux como root o en GitHub Actions usa
> `npm test -- --browsers=ChromeHeadlessCI` (agrega `--no-sandbox`).

### ¿Y con "Open with Live Server" de VS Code?

El `index.html` de la raíz es código fuente (JSX): un servidor estático no puede ejecutarlo y por eso
saldría en blanco. Por eso el repo incluye la carpeta **`dist/`** (la versión ya compilada) y el archivo
`.vscode/settings.json`, que le indica a Live Server que sirva `dist/` y que responda `index.html` en
cualquier ruta (necesario con BrowserRouter). Clic derecho en `index.html` → *Open with Live Server*.

Si cambias el código, vuelve a compilar con `npm run build` para actualizar `dist/`.

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
  App.jsx                  Contextos, Error Boundary y todas las rutas (panel con React.lazy)
  assets/                  Recursos (diapositivas React III): images/ + images.js que las importa todas,
                           y css/tema.css, la única hoja de estilos propia (sobre Bootstrap)
  components/
    atomos/                Piezas mínimas: Boton, Logo, InsigniaEstado, Cargando
    moleculas/             Combinan átomos: CampoFormulario, TarjetaProducto, Galeria, Migas…
    organismos/            Secciones completas: BarraNavegacion, ListaProductos, formularios, Boleta…
    plantillas/            Estructura de página: LayoutTienda y LayoutAdmin
    utilidades/            Sin interfaz propia: RutaProtegida, ScrollArriba, LimiteDeErrores
  pages/tienda, pages/admin  Páginas (una por ruta)
  config/estudio.js        Datos del estudio, horarios y reglas de agenda
  data/                    "Base de datos" simulada: db.js (CRUD sobre localStorage) + seed.js
  services/                Reglas de negocio (productos, carrito, órdenes, usuarios, pagos, reportes…)
  context/                 Context API: sesión, carrito y avisos
  hooks/                   useFormulario (validación en tiempo real), useAgregarAlCarrito
  utils/                   validaciones.js (RUN, correo, contraseña, fecha de cita…), formato.js, boleta.js
test/
  defensa.spec.jsx         Las 10 pruebas de la defensa (propuesta de pruebas del Anexo 1)
  complementarias.spec.jsx 5 pruebas más: CRUD, compra aprobada, todas las vistas, XSS y Error Boundary
  ayudas.jsx, index.js     Funciones de apoyo y punto de entrada de Karma
docs/                      ERS, documento de cobertura de testing, guía de defensa y plan de estudio
```

## Decisiones técnicas (según el material de la asignatura)

- **Vite + React** (diapositivas React I) y **BrowserRouter en `main.jsx`** con `Routes`/`Route` en `App.jsx`
  (React II). Los detalles leen el id con `useParams` y el catálogo lee `?q=` con `useLocation` (2.2.1).
- **Imágenes importadas desde `src/assets`** con `images.js` (React III). Se usa `import.meta.glob(..., { eager: true })`,
  que es el reemplazo actual de `import.meta.globEager`.
- **Atomic Design** para organizar los componentes (2.2.1) y principio de responsabilidad única (Anexo 1).
- **react-bootstrap** con solo el CSS de Bootstrap importado (guía 2.1.2): el JS de Bootstrap no es necesario.
- **Hoja de estilos** (1.2.4 y 1.2.6): una sola hoja propia, formato estándar, tabla de contenido, mobile first
  (`min-width`), imágenes con `max-width: 100%` y sin estilos en línea ni `!important`.
- **Error Boundary** (2.3.5) y **carga diferida** del panel con `React.lazy` + `Suspense` (2.3.3).
- **Pruebas** con Jasmine y Karma: `karma.conf.js` como la guía 2.3.2 (jasmine, ChromeHeadless, progress y coverage),
  webpack + babel para JSX (2.3.5), `renderHook`, `jasmine.createSpyObj`, `spyOn` y matchers de jasmine-dom.

## Persistencia simulada

No hay backend. `src/data/db.js` ofrece un CRUD genérico (`crear`, `listar`, `obtenerPorId`, `actualizar`,
`eliminar`) sobre `localStorage`, sembrado desde `seed.js`. Para volver a los datos originales basta con borrar
el almacenamiento del sitio en el navegador (o llamar a `reiniciarBD()`).

## Publicar en GitHub Pages

1. Subir el proyecto a GitHub (rama `main`).
2. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml`: corre las pruebas, compila con
   `--base=/FullstackII/` y publica una copia de `index.html` como `404.html`, para que las rutas de
   BrowserRouter (por ejemplo `/productos/3`) también carguen la aplicación.

## Limitaciones conocidas (proyecto académico)

- Sin backend: las contraseñas de los usuarios de ejemplo se guardan en texto plano en `localStorage`.
  En un sistema real se almacenarían cifradas en un servidor.
- El pago es una **simulación** (`pagosService`): no se cobra dinero real ni se envían correos reales.
