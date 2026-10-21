// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • Cada <input> es CONTROLADO: su value viene del estado (f.valores) y onChange lo actualiza.
// • useFormulario es un HOOK PERSONALIZADO (src/hooks): guarda valores, errores y qué campos tocó.
// • Los errores aparecen en tiempo real: al escribir o al salir del campo (onBlur).
// • Al enviar: preventDefault() evita recargar la página; si hay errores no se envía.
// • onEnviar llega por PROPS: este componente no sabe cómo se inicia sesión, solo avisa al padre.
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import CampoFormulario from '../comunes/CampoFormulario.jsx';
import useFormulario from '../../hooks/useFormulario.js';
import { validarFormularioLogin } from '../../utils/validaciones.js';

/**
 * Formulario de inicio de sesión.
 * Props: onEnviar(valores) -> devuelve '' si todo salió bien o el mensaje de error a mostrar.
 */
export default function FormularioLogin({ onEnviar }) {
  const f = useFormulario({ correo: '', password: '' }, validarFormularioLogin);
  const [errorGeneral, setErrorGeneral] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    if (!f.intentarEnviar()) return;
    setErrorGeneral(onEnviar(f.valores) || '');
  };

  return (
    <Form onSubmit={enviar} noValidate aria-label="Iniciar sesión">
      {errorGeneral && <Alert variant="danger" role="alert">{errorGeneral}</Alert>}
      <CampoFormulario
        id="login-correo"
        etiqueta="Correo electrónico"
        tipo="email"
        name="correo"
        autoComplete="email"
        placeholder="tucorreo@gmail.com"
        value={f.valores.correo}
        onChange={f.manejarCambio}
        onBlur={f.manejarBlur}
        error={f.visibles.correo}
      />
      <CampoFormulario
        id="login-password"
        etiqueta="Contraseña"
        tipo="password"
        name="password"
        autoComplete="current-password"
        value={f.valores.password}
        onChange={f.manejarCambio}
        onBlur={f.manejarBlur}
        error={f.visibles.password}
      />
      <Button type="submit" variant="dark" className="w-100">Iniciar sesión</Button>
    </Form>
  );
}
