-- V1: estructura de la base de datos de producto-service.
-- Cada microservicio tiene su propia base y sus propios scripts (nunca compartidos).
-- CREATE TABLE IF NOT EXISTS permite ejecutar el script en cada arranque sin errores.

CREATE TABLE IF NOT EXISTS categorias (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(50)  NOT NULL,
  descripcion VARCHAR(200),
  imagen      VARCHAR(100),
  PRIMARY KEY (id),
  UNIQUE KEY uk_categorias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS productos (
  id             BIGINT       NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(30)  NOT NULL,
  nombre         VARCHAR(100) NOT NULL,
  descripcion    VARCHAR(500),
  categoria_id   BIGINT       NOT NULL,
  precio         INT          NOT NULL,
  precio_oferta  INT,
  stock          INT          NOT NULL,
  stock_critico  INT,
  tamano         VARCHAR(30),
  duracion_horas DOUBLE,
  zonas          VARCHAR(150),
  nivel_dolor    INT,
  color_tinta    VARCHAR(30),
  tatuador_id    INT,
  destacado      BOOLEAN      NOT NULL DEFAULT FALSE,
  imagen         VARCHAR(100),
  PRIMARY KEY (id),
  UNIQUE KEY uk_productos_codigo (codigo),
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Galería de cada diseño (una fila por imagen, en orden).
CREATE TABLE IF NOT EXISTS producto_imagenes (
  producto_id BIGINT       NOT NULL,
  orden       INT          NOT NULL,
  imagen      VARCHAR(100) NOT NULL,
  PRIMARY KEY (producto_id, orden),
  CONSTRAINT fk_imagenes_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
