# Trazo Fino · Estudio de tatuajes (tienda + agendamiento de citas)

Proyecto de la asignatura **Desarrollo Fullstack II (DSY1104)** · DuocUC · Evaluación Parcial 2.
Sitio web de un estudio de tatuajes minimalista: el cliente elige diseños del catálogo, agenda su cita
(tatuador, fecha y hora) y paga en línea (pago simulado). El personal del estudio administra el catálogo,
las órdenes y los usuarios desde un panel.

**Tecnologías:** React 19 · Vite · react-router-dom (HashRouter) · react-bootstrap / Bootstrap 5 ·
Jasmine + Karma (pruebas unitarias y cobertura).

## Cómo ejecutarlo

```bash
npm install          # instala las dependencias (una sola vez)
npm run dev          # servidor de desarrollo -> http://localhost:5173
npm run build        # genera la versión final en /dist
npm run preview      # sirve /dist para revisarla
npm test             # corre las 132 pruebas (Karma + Jasmine) y genera el informe en /coverage
npm run test:defensa # corre solo las 10 pruebas que se muestran en la presentación
```

> `npm test` usa Chrome sin ventana (ChromeHeadless). Si Chrome no está en la ruta habitual,
> indica el ejecutable con la variable `CHROME_BIN` (ej. `CHROME_BIN=/usr/bin/chromium npm test`).

### ¿Y con "Open with Live Server" de VS Code?

El `index.html` de la raíz es código fuente (JSX): un servidor estático no puede ejecutarlo y por eso
saldría en blanco. Por eso el repo incluye la carpeta **`dist/`** (la versión ya compilada) y el archivo
`.vscode/settings.json`, que le indica a Live Server que sirva `dist/`. Así, clic derecho en `index.html`
→ *Open with Live Server* muestra la tienda sin instalar nada.

Si cambias el código, vuelve a compilar con `npm run build` para actualizar `dist/`.

## Equipo y reparto de responsabilidades

| Integrante | Lidera |
|---|---|
| **Isabel Cántaro** | Tienda y agendamiento: catálogo, carrito, checkout con agenda, pago simulado, órdenes y reglas de la agenda. |
| **Valentine Gaete** | Administración, usuarios y diseño: panel admin, roles y sesión, base de datos simulada, validaciones y estilos. |

Ambas explican todo el proyecto en la presentación; el detalle por archivo y por prueba está en
`docs/Guia_Defensa_Presentacion.docx` (sección 1.1).

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin.trazofino@gmail.com | Admin#123 |
| Vendedor | vendedor.trazofino@gmail.com | Venta#123 |
| Cliente | cliente.demo@gmail.com | Cliente#1 |

El **Vendedor** solo ve Órdenes y Productos (productos en modo lectura). El **Administrador** ve todo.

## Estructura del proyecto

```
src/
  App.jsx, main.jsx        Rutas y arranque de la aplicación
  config/estudio.js        Datos del estudio, horarios y reglas de agenda
  data/                    "Base de datos" simulada: db.js (CRUD sobre localStorage) + seed.js (datos iniciales)
  services/                Reglas de negocio (productos, carrito, órdenes, usuarios, pagos, reportes…)
  context/                 Context API: sesión, carrito y avisos
  hooks/                   useFormulario (validación en tiempo real), useAgregarAlCarrito
  utils/                   validaciones.js (RUN, correo, contraseña, fecha de cita…), formato.js, boleta.js
  components/
    comunes/               Componentes reutilizables (Logo, CampoFormulario, Boleta, RutaProtegida…)
    tienda/                Componentes de la tienda (barra, tarjetas, filtros, formularios, checkout…)
    admin/                 Componentes del panel (layout, formularios, alertas)
  pages/tienda, pages/admin  Una página por ruta
  styles/tema.css          Tema minimalista (sobre Bootstrap)
test/                      Pruebas Jasmine (*.spec.jsx) + ayudas.jsx
docs/                      ERS, documento de cobertura de testing y guía de defensa
```

## Persistencia simulada

No hay backend. `src/data/db.js` ofrece un CRUD genérico (`crear`, `listar`, `obtenerPorId`, `actualizar`,
`eliminar`) sobre `localStorage`, sembrado desde `seed.js`. Para volver a los datos originales basta con borrar
el almacenamiento del sitio en el navegador (o llamar a `reiniciarBD()`).

## Publicar en GitHub Pages

1. Subir el proyecto a GitHub (rama `main`).
2. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml` y publica el sitio.
   Se usa `HashRouter` y `base: './'`, por lo que las rutas funcionan sin configuración extra.

## Limitaciones conocidas (proyecto académico)

- Sin backend: las contraseñas de los usuarios de ejemplo se guardan en texto plano en `localStorage`.
  En un sistema real se almacenarían cifradas en un servidor.
- El pago es una **simulación** (`pagosService`): no se cobra dinero real ni se envían correos reales.

## Correr solo algunas pruebas (útil en una demostración)

```bash
PRUEBAS="RUN" npm test              # solo las pruebas cuyo nombre contenga "RUN"
PRUEBAS="pago RECHAZADO" npm test   # solo la prueba del pago rechazado
```

> Ojo: una corrida parcial deja el informe de `coverage/` incompleto. Antes de entregar o presentar,
> vuelve a correr `npm test` completo.
