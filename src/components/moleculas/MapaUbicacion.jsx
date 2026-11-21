// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • MOLÉCULA: mapa interactivo con la dirección del estudio (se puede mover, hacer zoom y
//   ver la calle). Es un <iframe> de Google Maps, igual que se inserta un video de YouTube:
//   no necesita instalar nada ni una clave de API.
// • La dirección se arma con encodeURIComponent para que los espacios y tildes viajen bien en la URL.
// • La clase "ratio ratio-16x9" de Bootstrap hace que el mapa sea responsivo (sin estilos en línea).
// ───────────────────────────────────────────────────────────────────────────

/** Props: direccion (texto, ej. "Av. Providencia 1234, Providencia, Santiago") y zoom (1 a 20). */
export default function MapaUbicacion({ direccion, zoom = 16 }) {
  const consulta = encodeURIComponent(direccion);
  const urlMapa = `https://maps.google.com/maps?q=${consulta}&z=${zoom}&output=embed`;
  const urlComoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${consulta}`;

  return (
    <div className="mapa-ubicacion">
      <div className="ratio ratio-16x9">
        <iframe
          src={urlMapa}
          title={`Mapa: ${direccion}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="d-flex flex-wrap gap-2 mt-3">
        <a href={urlComoLlegar} target="_blank" rel="noreferrer" className="btn btn-dark">Cómo llegar</a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${consulta}`}
          target="_blank" rel="noreferrer" className="btn btn-outline-dark"
        >
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
}
