// ── PARA EXPLICAR (defensa) ───────────────────────────────────────────────
// • MOLÉCULA: video embebido de YouTube (requisito de la pauta: "videos embebidos").
//   Es un <iframe> que apunta a youtube-nocookie.com (modo de privacidad ampliada: no deja
//   cookies hasta que el usuario le da play).
// • "ratio ratio-16x9" de Bootstrap lo hace responsivo; "loading=lazy" lo carga solo cuando se ve.
// • Solo se guarda el ID del video (lo que va después de youtu.be/), no la URL completa.
// ───────────────────────────────────────────────────────────────────────────

/** Props: idVideo (ej. "gX7tSE8b2Bk"), titulo (texto accesible del iframe) y pie (leyenda opcional). */
export default function VideoYoutube({ idVideo, titulo, pie = '' }) {
  const id = encodeURIComponent(idVideo);
  return (
    <figure className="video-youtube mb-0">
      <div className="ratio ratio-16x9">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={titulo}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className="small text-muted mt-2">
        {pie}{pie && ' · '}
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer" className="enlace-sutil">
          Ver en YouTube
        </a>
      </figcaption>
    </figure>
  );
}
