-- ms-auth · V1: tabla de usuarios (cuentas, roles y contraseñas cifradas con BCrypt).
-- Las cuentas iniciales (admin, vendedor, cliente) las crea DatosIniciales.java al arrancar,
-- porque la contraseña se cifra con BCrypt y puede venir del .env del servidor.
CREATE TABLE usuarios (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    run              VARCHAR(9)   NOT NULL,
    nombre           VARCHAR(50)  NOT NULL,
    apellidos        VARCHAR(100) NOT NULL,
    correo           VARCHAR(100) NOT NULL,
    password         VARCHAR(100) NOT NULL,
    tipo             VARCHAR(20)  NOT NULL,
    fecha_nacimiento DATE         NOT NULL,
    telefono         VARCHAR(15)  NOT NULL,
    region           VARCHAR(80),
    comuna           VARCHAR(80),
    direccion        VARCHAR(300),
    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_run UNIQUE (run),
    CONSTRAINT uk_usuarios_correo UNIQUE (correo)
);
