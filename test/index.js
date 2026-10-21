// Punto de entrada de las pruebas para Karma + webpack.
//
// 1) Carga todos los archivos *.spec.jsx de la carpeta /test.
// 2) Carga también todo el código de /src (menos main.jsx) para que el informe de cobertura
//    muestre TAMBIÉN los archivos que no tienen pruebas (con 0 %), en vez de ocultarlos.
const specs = require.context('.', true, /\.spec\.jsx?$/);
specs.keys().forEach(specs);

const codigoFuente = require.context('../src', true, /^(?!.*main\.jsx$).*\.jsx?$/);
codigoFuente.keys().forEach(codigoFuente);
