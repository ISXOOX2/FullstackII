-- V1: estructura de la base de datos de usuario-service.

CREATE TABLE IF NOT EXISTS usuarios (
  id               BIGINT       NOT NULL AUTO_INCREMENT,
  run              VARCHAR(9)   NOT NULL,
  nombre           VARCHAR(50)  NOT NULL,
  apellidos        VARCHAR(100) NOT NULL,
  correo           VARCHAR(100) NOT NULL,
  password         VARCHAR(100) NOT NULL,   -- hash BCrypt, nunca la clave en texto plano
  telefono         VARCHAR(20),
  fecha_nacimiento DATE,
  region           VARCHAR(80)  NOT NULL,
  comuna           VARCHAR(80)  NOT NULL,
  direccion        VARCHAR(300) NOT NULL,
  tipo             VARCHAR(20)  NOT NULL,   -- Administrador, Vendedor o Cliente
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_correo (correo),
  UNIQUE KEY uk_usuarios_run (run)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
