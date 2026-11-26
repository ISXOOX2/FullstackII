package cl.foreverink.catalogo.dto;

import cl.foreverink.catalogo.modelo.Bloque;

/** Lo que la API devuelve de Bloque: un DTO, para no exponer la entidad JPA directamente. */
public record BloqueRespuesta(
        String tipo,
        String texto) {

    public static BloqueRespuesta de(Bloque e) {
        return new BloqueRespuesta(
                e.getTipo(),
                e.getTexto());
    }
}
