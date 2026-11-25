package cl.foreverink.blog.modelo;

import jakarta.persistence.*;

/**
 * Parrafo ("p") o subtitulo ("h") del cuerpo de un articulo.
 */
@Embeddable
public class Bloque {

    @Column(length = 10)
    private String tipo;

    @Column(length = 2000)
    private String texto;

    public Bloque() {
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

}
