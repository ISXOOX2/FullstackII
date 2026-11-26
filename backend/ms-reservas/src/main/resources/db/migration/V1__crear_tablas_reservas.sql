-- ms-reservas · V1: órdenes con su detalle, solicitudes de reembolso o cambio, historial de estados,
-- proyectos de clientes ("Mi proyecto") y mensajes de contacto.
CREATE TABLE ordenes (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    numero            VARCHAR(20)  NOT NULL,
    usuario_id        BIGINT       NOT NULL,
    cliente_nombre    VARCHAR(50)  NOT NULL,
    cliente_apellidos VARCHAR(100) NOT NULL,
    cliente_correo    VARCHAR(100) NOT NULL,
    cliente_telefono  VARCHAR(15)  NOT NULL,
    fecha             DATETIME(6)  NOT NULL,
    estado            VARCHAR(20)  NOT NULL,
    total             INT          NOT NULL,
    cita_fecha        DATE,
    cita_hora         VARCHAR(5),
    tatuador_id       BIGINT,
    zona_cuerpo       VARCHAR(80),
    indicaciones      VARCHAR(300),
    PRIMARY KEY (id),
    CONSTRAINT uk_ordenes_numero UNIQUE (numero)
);

CREATE TABLE items_orden (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    orden_id    BIGINT,
    tipo        VARCHAR(10)  NOT NULL,
    producto_id BIGINT,
    articulo_id BIGINT,
    nombre      VARCHAR(100) NOT NULL,
    precio      INT          NOT NULL,
    cantidad    INT          NOT NULL,
    ancho_cm    DOUBLE,
    alto_cm     DOUBLE,
    PRIMARY KEY (id),
    CONSTRAINT fk_items_orden_orden FOREIGN KEY (orden_id) REFERENCES ordenes (id)
);

CREATE TABLE solicitudes (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    orden_id      BIGINT       NOT NULL,
    tipo          VARCHAR(10)  NOT NULL,
    motivo        VARCHAR(120) NOT NULL,
    justificativo VARCHAR(300) NOT NULL,
    nueva_fecha   DATE,
    nueva_hora    VARCHAR(5),
    estado        VARCHAR(12)  NOT NULL,
    respuesta     VARCHAR(300),
    fecha         DATETIME(6)  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE historial_estados (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    orden_id        BIGINT       NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo    VARCHAR(20)  NOT NULL,
    motivo          VARCHAR(300),
    responsable     VARCHAR(100),
    fecha           DATETIME(6)  NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE proyectos (
    id                 BIGINT       NOT NULL AUTO_INCREMENT,
    nombre             VARCHAR(80)  NOT NULL,
    correo             VARCHAR(100) NOT NULL,
    zona_cuerpo        VARCHAR(60)  NOT NULL,
    lado               VARCHAR(20),
    idea               VARCHAR(600) NOT NULL,
    imagen             LONGTEXT,
    fecha              DATE         NOT NULL,
    contactar_antes_de DATE         NOT NULL,
    estado             VARCHAR(30)  NOT NULL,
    usuario_id         BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE mensajes (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(100) NOT NULL,
    correo     VARCHAR(100) NOT NULL,
    comentario VARCHAR(500) NOT NULL,
    fecha      DATETIME(6)  NOT NULL,
    PRIMARY KEY (id)
);
