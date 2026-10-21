// Punto de entrada de las pruebas para Karma + webpack.
//
// 1) Agrega los "matchers" de @testing-library/jasmine-dom (toBeInTheDocument, toHaveValue,
//    toHaveAttribute…), los mismos que usan los ejemplos de la guía 2.3.2, pero para Jasmine.
// 2) Carga todos los archivos *.spec.jsx de la carpeta /test.
// 3) Carga también todo el código de /src (menos main.jsx) para que el informe de cobertura
//    muestre TAMBIÉN los archivos que no tienen pruebas (con 0 %), en vez de ocultarlos.
import JasmineDOM from '@testing-library/jasmine-dom';

beforeAll(() => {
  jasmine.addMatchers(JasmineDOM);
});

const specs = require.context('.', true, /\.spec\.jsx?$/);
specs.keys().forEach(specs);

const codigoFuente = require.context('../src', true, /^(?!.*main\.jsx$).*\.jsx?$/);
codigoFuente.keys().forEach(codigoFuente);
