// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Un hook personalizado es una función que empieza con "use" y reúne useState para reutilizarlos.
// • Así los 7 formularios del proyecto (login, registro, checkout...) no repiten el mismo código.
// • Tres estados: valores (lo que escribe), tocados (campos que ya visitó) e intentoEnvio.
// • visibles = errores que se muestran: solo de campos tocados, o todos si ya intentó enviar.
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';

/**
 * Hook personalizado para manejar formularios con validación en tiempo real.
 *
 *  - valores   : estado con lo que el usuario va escribiendo.
 *  - errores   : todos los errores actuales (los calcula la función "validar").
 *  - visibles  : solo los errores que se muestran en pantalla: los de campos que el usuario
 *                ya tocó, o todos si ya intentó enviar el formulario.
 *
 * Uso típico dentro de un componente:
 *    const f = useFormulario({ correo: '' }, validarFormularioLogin);
 *    <input name="correo" value={f.valores.correo} onChange={f.manejarCambio} onBlur={f.manejarBlur} />
 */
export default function useFormulario(valoresIniciales, validar) {
  const [valores, setValores] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const errores = validar(valores);

  const visibles = {};
  Object.keys(errores).forEach((campo) => {
    if (intentoEnvio || tocados[campo]) visibles[campo] = errores[campo];
  });

  const cambiar = (campo, valor) => {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setTocados((actuales) => ({ ...actuales, [campo]: true }));
  };

  const manejarCambio = (evento) => {
    const { name, type, checked, value } = evento.target;
    cambiar(name, type === 'checkbox' ? checked : value);
  };

  const manejarBlur = (evento) => {
    const { name } = evento.target;
    setTocados((actuales) => ({ ...actuales, [name]: true }));
  };

  /** Marca el intento de envío (muestra todos los errores). Devuelve true si no hay errores. */
  const intentarEnviar = () => {
    setIntentoEnvio(true);
    return Object.keys(errores).length === 0;
  };

  const reiniciar = (nuevosValores = valoresIniciales) => {
    setValores(nuevosValores);
    setTocados({});
    setIntentoEnvio(false);
  };

  return { valores, errores, visibles, cambiar, manejarCambio, manejarBlur, intentarEnviar, reiniciar, setValores };
}
