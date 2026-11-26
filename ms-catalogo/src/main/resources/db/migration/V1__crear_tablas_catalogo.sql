-- ms-catalogo · V1: estilos, diseños, insumos y tienda, tatuadores, reseñas y blog.
CREATE TABLE categorias (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(60)  NOT NULL,
    descripcion VARCHAR(500),
    imagen      VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE disenos (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    codigo         VARCHAR(20)  NOT NULL,
    nombre         VARCHAR(100) NOT NULL,
    descripcion    VARCHAR(500),
    categoria_id   BIGINT       NOT NULL,
    precio         INT          NOT NULL,
    precio_oferta  INT,
    ancho_cm       DOUBLE,
    alto_cm        DOUBLE,
    duracion_horas DOUBLE,
    zonas          VARCHAR(200),
    nivel_dolor    INT,
    color_tinta    VARCHAR(60),
    destacado      BOOLEAN,
    imagen         VARCHAR(100),
    PRIMARY KEY (id),
    CONSTRAINT uk_disenos_codigo UNIQUE (codigo)
);

-- Galería de cada diseño (lista ordenada de imágenes)
CREATE TABLE diseno_imagenes (
    diseno_id BIGINT NOT NULL,
    orden     INT    NOT NULL,
    imagen    VARCHAR(100),
    PRIMARY KEY (diseno_id, orden),
    CONSTRAINT fk_diseno_imagenes_diseno FOREIGN KEY (diseno_id) REFERENCES disenos (id)
);

CREATE TABLE insumos (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    codigo        VARCHAR(20)  NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    tipo          VARCHAR(40)  NOT NULL,
    unidad        VARCHAR(30)  NOT NULL,
    stock         INT          NOT NULL,
    stock_critico INT          NOT NULL,
    a_la_venta    BOOLEAN      NOT NULL,
    precio        INT,
    descripcion   VARCHAR(200),
    imagen        VARCHAR(100),
    PRIMARY KEY (id),
    CONSTRAINT uk_insumos_codigo UNIQUE (codigo)
);

CREATE TABLE tatuadores (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    nombre       VARCHAR(80) NOT NULL,
    especialidad VARCHAR(120),
    descripcion  VARCHAR(500),
    PRIMARY KEY (id)
);

-- Una reseña por cliente (usuario_id viene del token de ms-auth)
CREATE TABLE resenas (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT       NOT NULL,
    nombre     VARCHAR(60)  NOT NULL,
    estrellas  INT          NOT NULL,
    comentario VARCHAR(400) NOT NULL,
    imagen     LONGTEXT,
    fecha      DATE         NOT NULL,
    diseno_id  BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT uk_resenas_usuario UNIQUE (usuario_id)
);

-- Blog: artículo + sus párrafos y subtítulos en orden
CREATE TABLE articulos (
    id       BIGINT       NOT NULL AUTO_INCREMENT,
    titulo   VARCHAR(150) NOT NULL,
    resumen  VARCHAR(300) NOT NULL,
    imagen   VARCHAR(100),
    fecha    DATE         NOT NULL,
    autor    VARCHAR(80),
    etiqueta VARCHAR(40),
    PRIMARY KEY (id)
);

CREATE TABLE articulo_bloques (
    articulo_id BIGINT NOT NULL,
    orden       INT    NOT NULL,
    tipo        VARCHAR(10),
    texto       VARCHAR(2000),
    PRIMARY KEY (articulo_id, orden),
    CONSTRAINT fk_articulo_bloques_articulo FOREIGN KEY (articulo_id) REFERENCES articulos (id)
);
