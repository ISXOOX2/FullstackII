// Punto de entrada de las pruebas para Karma + webpack.
// (Es .cjs porque el proyecto usa "type": "module" y require.context solo existe en CommonJS.)
//
// 1) Carga todos los archivos *.spec.jsx de la carpeta /test.
// 2) Carga también todo el código de /src (menos main.jsx) para que el informe de
//    cobertura muestre TAMBIÉN los archivos que todavía no tienen pruebas (con 0%).
const specs = require.context('.', true, /\.spec\.jsx?$/);
specs.keys().forEach(specs);

const codigoFuente = require.context('../src', true, /^(?!.*main\.jsx$).*\.jsx?$/);
codigoFuente.keys().forEach(codigoFuente);
