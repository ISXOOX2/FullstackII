-- V1: estructura de la base de datos de carrito-service.
-- Una sola tabla: cada fila es un diseño dentro del carrito de un cliente ("clave").
-- producto_id es solo un número, sin clave foránea: la tabla productos vive en OTRA base
-- de datos (la de producto-service).

CREATE TABLE IF NOT EXISTS carrito_items (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  clave       VARCHAR(80)  NOT NULL,   -- identifica el carrito del cliente (su navegador)
  producto_id BIGINT       NOT NULL,
  nombre      VARCHAR(100) NOT NULL,
  imagen      VARCHAR(100),
  precio      INT          NOT NULL,
  stock       INT          NOT NULL,
  cantidad    INT          NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_carrito_producto (clave, producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
