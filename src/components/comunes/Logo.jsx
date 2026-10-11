import { ESTUDIO } from '../../config/estudio.js';

/** Logo del estudio: marca (SVG) + nombre. Componente de presentación, sin estado. */
export default function Logo({ alto = 34, mostrarNombre = true }) {
  return (
    <span className="logo-estudio d-inline-flex align-items-center gap-2">
      <img src="img/marca/logo.svg" alt="" height={alto} width={alto} />
      {mostrarNombre && <span className="logo-nombre">{ESTUDIO.nombre}</span>}
    </span>
  );
}
