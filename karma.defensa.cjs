/**
 * Configuración de Karma SOLO para la demostración de la presentación.
 *
 * Corre únicamente las 10 pruebas que se muestran en la defensa (las mismas de la guía),
 * en lugar de las 132. Usa la configuración normal (karma.conf.cjs) y cambia dos cosas:
 *   - client.args : filtra por nombre las 10 pruebas.
 *   - reporters   : muestra solo la lista de pruebas (sin cobertura, para no pisar /coverage).
 *
 *   npm run test:defensa
 */
const base = require('./karma.conf.cjs');

const DIEZ_PRUEBAS = [
  'rechaza un RUN con dígito verificador incorrecto',                       // 1  lógica pura
  'no permite más de 5 unidades del mismo diseño',                          // 2  regla del carrito
  'detecta stock crítico cuando el stock es igual o menor al crítico',      // 3  valores límite
  'TarjetaProducto: al hacer clic llama a onAgregar',                       // 4  props + spy
  'ListaProductos muestra un mensaje cuando la lista viene vacía',          // 5  render condicional
  'Galeria cambia la imagen principal al hacer clic en una miniatura',      // 6  useState
  'FormularioLogin muestra los errores en tiempo real',                     // 7  hook + eventos
  'RutaProtegida manda al login si no hay sesión',                          // 8  contexto + rutas
  'con pago RECHAZADO',                                                     // 9  mock (spyOn)
  'una hora solo queda ocupada cuando la orden está pagada',                // 10 regla + datos
];

module.exports = function (config) {
  base(config);
  config.set({
    // karma-jasmine escapa el texto normal; entre /barras/ lo interpreta como expresión regular.
    client: { args: ['--grep', '/' + DIEZ_PRUEBAS.join('|') + '/'] },
    // Sin informe de cobertura: con solo 10 pruebas saldría un % bajo y confundiría.
    reporters: ['spec'],
  });
};
