// karma.conf.js
// Configuración de Karma + Jasmine (guías 2.3.2 y 2.3.5 de la asignatura).
//
//  - Jasmine  : escribe las pruebas (describe / it / expect / jasmine.createSpy).
//  - Karma    : corre las pruebas dentro de un navegador (Chrome sin ventana).
//  - webpack + babel-loader : compilan JSX y módulos ES para que el navegador entienda el
//               código (guía 2.3.5: "Asegúrate de tener webpack y babel-loader instalados").
//  - karma-coverage + babel-plugin-istanbul : miden qué parte del código ejecutaron las
//               pruebas (informe de cobertura, material 2.3.4).
//
// Comando:  npm test   -> corre las 15 pruebas una vez y genera el informe en coverage/
const path = require('path');

const presets = [
  ['@babel/preset-env', { targets: { chrome: '100' } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];

module.exports = function (config) {
  config.set({
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
              options: { presets, plugins: [['istanbul', { cwd: __dirname, include: ['src/**'] }]] },
            },
          },
          {
            // Código de las pruebas: sin instrumentar
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'test'),
            use: { loader: 'babel-loader', options: { presets } },
          },
          {
            // Imágenes importadas desde src/assets: en las pruebas se incrustan en el código,
            // así el navegador de Karma no tiene que pedirlas a ningún servidor.
            test: /\.(png|jpe?g|svg)$/,
            type: 'asset/inline',
          },
        ],
      },
    },

    // Guía 2.3.2: reporters "progress" y "coverage", e informe html en coverage/
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' }, // informe navegable: coverage/html/index.html
        { type: 'text-summary' },         // resumen en la terminal
      ],
    },

    browsers: ['ChromeHeadless'],
    singleRun: true,
  });
};
