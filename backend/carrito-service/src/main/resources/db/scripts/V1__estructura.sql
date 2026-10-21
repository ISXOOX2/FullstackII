-- V1: estructura de la base de datos de carrito-service.
-- Ojo: items_carrito guarda solo el id del producto (producto_id), sin clave foránea:
-- la tabla productos vive en OTRA base de datos (la de producto-service).

CREATE TABLE IF NOT EXISTS carritos (
  id          BIGINT      NOT NULL AUTO_INCREMENT,
  clave       VARCHAR(80) NOT NULL,   -- identifica al cliente o al navegador
  actualizado DATETIME    NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_carritos_clave (clave)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS items_carrito (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  carrito_id  BIGINT       NOT NULL,
  producto_id BIGINT       NOT NULL,
  nombre      VARCHAR(100) NOT NULL,
  imagen      VARCHAR(100),
  precio      INT          NOT NULL,
  stock       INT          NOT NULL,
  cantidad    INT          NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_item_producto (carrito_id, producto_id),
  CONSTRAINT fk_items_carrito FOREIGN KEY (carrito_id) REFERENCES carritos (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
