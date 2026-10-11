/**
 * Configuración de Karma + Jasmine para las pruebas unitarias del frontend.
 *
 *  - Jasmine  : escribe las pruebas (describe / it / expect / spyOn).
 *  - Karma    : corre las pruebas dentro de un navegador real (Chrome sin ventana).
 *  - webpack + babel-loader : compilan JSX y módulos ES para que el navegador entienda el código.
 *  - babel-plugin-istanbul + karma-coverage : miden qué parte del código ejecutaron las pruebas.
 *
 * Comandos:
 *   npm test          -> corre todo una vez y genera el informe en /coverage
 *   npm run test:watch-> queda escuchando cambios
 */
const path = require('path');

const presets = [
  ['@babel/preset-env', { targets: { chrome: '100' } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
    ],

    // Un único punto de entrada: test/index.cjs junta todos los *.spec.jsx
    files: [{ pattern: 'test/index.cjs', watched: false }],
    preprocessors: { 'test/index.cjs': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            // Código de la app: se instrumenta para medir cobertura
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            use: {
              loader: 'babel-loader',
              options: {
                presets,
                plugins: [['istanbul', { cwd: __dirname, include: ['src/**'] }]],
              },
            },
          },
          {
            // Código de las pruebas: sin instrumentar
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'test'),
            use: { loader: 'babel-loader', options: { presets } },
          },
        ],
      },
    },

    reporters: ['spec', 'coverage'],
    specReporter: {
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: true,
    },
    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'json-summary', subdir: '.', file: 'resumen.json' },
        { type: 'lcov', subdir: 'lcov' },
      ],
    },

    // Chrome sin ventana (como en la guía 2.3.2). El flag --no-sandbox permite
    // ejecutarlo en servidores/contenedores (por ejemplo EC2 de AWS).
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
    // Para correr solo algunas pruebas durante una demostración:
    //    PRUEBAS="RUN" npm test        (ejecuta solo las pruebas cuyo nombre contenga "RUN")
    client: {
      args: process.env.PRUEBAS ? ['--grep', process.env.PRUEBAS] : [],
    },
    singleRun: true,
    restartOnFileChange: true,
    browserNoActivityTimeout: 120000,
  });
};
