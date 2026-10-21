import { Button } from 'react-bootstrap';

/**
 * ÁTOMO · Botón del proyecto.
 *
 * Es la pieza más básica de la interfaz (Atomic Design): no conoce el carrito, la sesión ni
 * ninguna regla de negocio. Solo dibuja un botón de Bootstrap con la etiqueta que recibe y
 * avisa el clic al componente padre.
 *
 * Props (son de solo lectura: el botón nunca las modifica):
 *  - etiqueta       : texto visible del botón.
 *  - onClick        : función que se ejecuta al hacer clic (la decide el padre).
 *  - variante       : estilo de Bootstrap ('dark' por defecto, 'outline-dark', 'danger'…).
 *  - tipo           : 'button' (por defecto) o 'submit' dentro de un formulario.
 *  - deshabilitado  : true para bloquearlo (por ejemplo, sin cupos).
 *  - tamano         : 'sm' o 'lg' (opcional).
 *  - className      : clases extra (por ejemplo 'w-100').
 *  - ariaLabel      : texto para lectores de pantalla cuando la etiqueta no basta (opcional).
 */
export default function Boton({
  etiqueta,
  onClick,
  variante = 'dark',
  tipo = 'button',
  deshabilitado = false,
  tamano,
  className = '',
  ariaLabel,
}) {
  return (
    <Button
      type={tipo}
      variant={variante}
      size={tamano}
      className={className}
      disabled={deshabilitado}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {etiqueta}
    </Button>
  );
}
