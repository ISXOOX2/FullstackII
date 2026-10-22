-- Datos iniciales de usuario-service (los mismos usuarios de src/data/seed.js).
-- Las contraseñas se guardan cifradas con BCrypt (nunca en texto plano).
-- Claves de demostración: Admin#123 (administrador), Venta#123 (vendedor), Cliente#1 (clientes).

INSERT IGNORE INTO usuarios (id, run, nombre, apellidos, correo, password, telefono, fecha_nacimiento, region, comuna, direccion, tipo) VALUES
  (1, '123456785', 'Administrador', 'Forever Ink', 'admin.foreverink@gmail.com', '$2a$10$zg2Q0okPj0LS0XpF8NG1GuLjmceRm/I4Zr3JJKBq6BpeNOUVzmTGq', '+56912345678', '1990-05-12', 'Metropolitana de Santiago', 'Providencia', 'Av. Providencia 1234', 'Administrador'),
  (2, '111111111', 'Vendedor', 'Recepción', 'vendedor.foreverink@gmail.com', '$2a$10$NycelQb7LwSBqKiQz7pm5eKchYyyhABdx7amQGHRWHg.VxbzIqYGS', NULL, '1995-03-02', 'Metropolitana de Santiago', 'Providencia', 'Av. Providencia 1234', 'Vendedor'),
  (3, '190110222', 'Cliente', 'Demo', 'cliente.demo@gmail.com', '$2a$10$eo3qo1JyoclvML.6p5/ZIu1YYk.V6iRgd32eNwzyGlpIkZxUtKVD2', '+56911112222', '2000-08-21', 'Metropolitana de Santiago', 'Ñuñoa', 'Calle Los Olmos 456, depto 12', 'Cliente'),
  (4, '176543213', 'Camila', 'Fuentes Rojas', 'camila.fuentes@gmail.com', '$2a$10$I6ulOlQp9yGUur1OPP81pewXK0UQnS58/fbePKmDXD1GE44zjovzC', '+56922223333', '1998-11-03', 'Valparaíso', 'Viña del Mar', 'Calle 5 Norte 789', 'Cliente'),
  (5, '201234565', 'Joaquín', 'Araya Soto', 'joaquin.araya@gmail.com', '$2a$10$ByJ9n5h0LwgExDuN4Z4g/uvfZC6AqOFQ9R4eECbETL6vfRS4K7qge', NULL, '2001-02-17', 'Metropolitana de Santiago', 'Maipú', 'Pasaje Las Rosas 321', 'Cliente'),
  (6, '182223336', 'Antonia', 'Muñoz Paredes', 'antonia.munoz@gmail.com', '$2a$10$2B0/A6pXukr4DVFDY/qmEuIMd.FrTtMiUF0IWjHMqmBzw./nsSFim', '+56933334444', '1996-07-29', 'Biobío', 'Concepción', 'Barros Arana 1020', 'Cliente'),
  (7, '167890121', 'Tomás', 'Rojas Vera', 'tomas.rojas@gmail.com', '$2a$10$Dc3INgFiaNLTBZ7B0O0IQOWZJ0jLql6BgT83BLclNeR7Q.0DVQ6Z2', '+56944445555', '1994-12-09', 'Metropolitana de Santiago', 'La Florida', 'Av. Vicuña Mackenna 5500', 'Cliente');
