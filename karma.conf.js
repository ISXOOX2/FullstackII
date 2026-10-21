// karma.conf.js
// Configuración de Karma + Jasmine (guías 2.3.2 y 2.3.5 de la asignatura).
//
//  - Jasmine  : escribe las pruebas (describe / it / expect / spyOn / createSpyObj).
//  - Karma    : corre las pruebas dentro de un navegador real (Chrome sin ventana).
//  - webpack + babel-loader : compilan JSX y módulos ES para que el navegador entienda el
//               código (guía 2.3.5: "Asegúrate de tener webpack y babel-loader instalados").
//  - karma-coverage + babel-plugin-istanbul : miden qué parte del código ejecutaron las pruebas.
//
// Comandos:
//   npm test               -> corre las 15 pruebas una vez y genera el informe en coverage/
//   npm run test:defensa   -> corre solo las 10 pruebas de la defensa
//   npm run test:watch     -> queda escuchando cambios
const path = require('path');

const presets = [
  ['@babel/preset-env', { targets: { chrome: '100' } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];
// Vite resuelve import.meta.glob (src/assets/images.js). Webpack no lo conoce, así que en las
// pruebas este plugin de Babel lo traduce a imports normales.
const plugins = ['babel-plugin-transform-vite-meta-glob'];

// npm run test:defensa agrega --defensa: Jasmine corre solo las pruebas marcadas [DEFENSA].
const soloDefensa = process.argv.includes('--defensa');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],

    // Un único punto de entrada: test/index.js reúne todos los *.spec.jsx
    files: [{ pattern: 'test/index.js', watched: false }],
    preprocessors: { 'test/index.js': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            // Código de la aplicación: se instrumenta para medir cobertura
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            use: {
              loader: 'babel-loader',
              options: {
                presets,
                plugins: [...plugins, ['istanbul', { cwd: __dirname, include: ['src/**'] }]],
              },
            },
          },
          {
            // Código de las pruebas: sin instrumentar
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'test'),
            use: { loader: 'babel-loader', options: { presets, plugins } },
          },
          {
            // Imágenes importadas desde src/assets: en las pruebas se incrustan como texto
            // (data URI), así el navegador de Karma no tiene que pedirlas a ningún servidor.
            test: /\.(png|jpe?g|svg)$/,
            type: 'asset/inline',
          },
        ],
      },
    },

    // Guía 2.3.2: reporters "progress" y "coverage".
    // En la defensa se usa "spec", que escribe el nombre de cada prueba con ✓ o ✗.
    reporters: soloDefensa ? ['spec'] : ['progress', 'coverage'],
    specReporter: { suppressSkipped: true, showSpecTiming: true },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },          // informe navegable: coverage/html/index.html
        { type: 'text-summary' },                  // resumen en la terminal
        { type: 'json-summary', subdir: '.', file: 'resumen.json' }, // cifras para el documento
      ],
    },

    // Guía 2.3.2: Chrome sin ventana
    browsers: ['ChromeHeadless'],
    // En GitHub Actions (o Linux como root) Chrome necesita --no-sandbox:
    //   npm test -- --browsers=ChromeHeadlessCI
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },

    client: {
      args: soloDefensa ? ['--grep', 'DEFENSA'] : [],
      jasmine: { random: false }, // orden fijo: más fácil de seguir al presentar
    },

    // Guía 2.3.2, paso 14: paralelización. Con un solo navegador basta 1.
    concurrency: 1,
    singleRun: true,
    browserNoActivityTimeout: 120000,
  });
};
