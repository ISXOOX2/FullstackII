/** Mensaje que se muestra cuando una lista no tiene elementos. */
export default function MensajeVacio({ titulo = 'No hay resultados', texto = '', children }) {
  return (
    <div className="mensaje-vacio text-center py-5" role="status">
      <h2 className="h4 mb-2">{titulo}</h2>
      {texto && <p className="text-muted mb-3">{texto}</p>}
      {children}
    </div>
  );
}
