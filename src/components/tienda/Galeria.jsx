// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • useState(0) guarda cuál imagen se ve ahora (el "índice"). Es el ESTADO del componente.
// • Al hacer clic en una miniatura se llama a setIndice(i): React cambia el estado y vuelve a
//   dibujar el componente con la imagen nueva. Nunca se cambia `indice` directamente.
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react';

/** Galería de imágenes del diseño: una imagen grande y miniaturas para cambiarla. */
export default function Galeria({ imagenes, nombre }) {
  const [indice, setIndice] = useState(0);
  const lista = imagenes && imagenes.length > 0 ? imagenes : [];
  if (lista.length === 0) return null;

  return (
    <div className="galeria">
      <div className="marco-imagen galeria-principal">
        <img src={lista[indice]} alt={`${nombre}, vista ${indice + 1} de ${lista.length}`} />
      </div>
      {lista.length > 1 && (
        <div className="d-flex gap-2 mt-2" role="group" aria-label="Miniaturas">
          {lista.map((src, i) => (
            <button
              type="button" key={src}
              className={`miniatura-galeria ${i === indice ? 'activa' : ''}`}
              aria-label={`Ver imagen ${i + 1}`} aria-pressed={i === indice}
              onClick={() => setIndice(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
