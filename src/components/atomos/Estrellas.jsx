/**
 * ÁTOMO · Estrellas de una valoración (solo muestra, no se puede hacer clic).
 * Props: valor (de 0 a 5, admite decimales como 4.3) y tamano ('sm' o 'lg').
 * Se pintan 5 estrellas: las primeras Math.round(valor) llenas y el resto vacías.
 */
export default function Estrellas({ valor = 0, tamano = 'sm' }) {
  const llenas = Math.round(valor);
  return (
    <span className={`estrellas estrellas-${tamano}`} role="img" aria-label={`${valor} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= llenas ? 'estrella-llena' : 'estrella-vacia'}>★</span>
      ))}
    </span>
  );
}
