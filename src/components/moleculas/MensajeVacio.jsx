/**
 * MOLÉCULA · Mensaje que se muestra cuando una lista no tiene elementos.
 * nivelTitulo: 2 por defecto; 1 cuando el mensaje es el contenido principal de la página (404).
 */
export default function MensajeVacio({ titulo = 'No hay resultados', texto = '', nivelTitulo = 2, children }) {
  const Titulo = `h${nivelTitulo}`;
  return (
    <div className="mensaje-vacio text-center py-5" role="status">
      <Titulo className="h4 mb-2">{titulo}</Titulo>
      {texto && <p className="text-muted mb-3">{texto}</p>}
      {children}
    </div>
  );
}
