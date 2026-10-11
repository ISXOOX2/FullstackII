/**
 * Simulación de una pasarela de pago.
 *
 * El proyecto no tiene backend ni procesa pagos reales (así lo define el ERS). Este servicio
 * imita la respuesta de una pasarela: tarda un momento y responde aprobado o rechazado.
 *
 * Se exporta como OBJETO (y no como función suelta) a propósito: así en las pruebas con
 * Jasmine se puede reemplazar con spyOn(pagosService, 'procesar') y simular un pago
 * aprobado o rechazado sin esperar ni depender de nada externo (mock).
 */
export const pagosService = {
  /**
   * @param {{ total: number, resultado?: 'aprobado'|'rechazado' }} datos
   * @returns {Promise<{ aprobado: boolean, referencia?: string, motivo?: string }>}
   */
  procesar({ resultado = 'aprobado' }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (resultado === 'rechazado') {
          resolve({ aprobado: false, motivo: 'La tarjeta fue rechazada por el emisor (simulación).' });
        } else {
          resolve({ aprobado: true, referencia: 'PAY-' + Date.now() });
        }
      }, 700);
    });
  },
};
