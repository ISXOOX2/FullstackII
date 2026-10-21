-- Datos iniciales de producto-service (los mismos de src/data/seed.js del frontend).
-- INSERT IGNORE: si el registro ya existe no se vuelve a insertar, así el script se puede
-- ejecutar en cada arranque sin duplicar datos.

INSERT IGNORE INTO categorias (id, nombre, descripcion, imagen) VALUES
  (1, 'Fineline', 'Líneas delgadas y delicadas, ideales para un primer tatuaje.', 'mariposa-lineal'),
  (2, 'Botánico', 'Ramas, hojas y flores dibujadas con trazo suave.', 'rama-de-olivo'),
  (3, 'Geométrico', 'Formas simples, simetría y puntillismo (dotwork).', 'mandala-de-puntos'),
  (4, 'Celestial', 'Luna, sol y constelaciones en versión minimalista.', 'fases-lunares');

INSERT IGNORE INTO productos (id, codigo, nombre, descripcion, categoria_id, precio, precio_oferta, stock, stock_critico,
  tamano, duracion_horas, zonas, nivel_dolor, color_tinta, tatuador_id, destacado, imagen) VALUES
  (1, 'TF-001', 'Mariposa lineal', 'Mariposa de alas simétricas dibujada con una sola línea continua. Delicada y muy versátil.', 1, 65000, NULL, 8, 3, '7 x 6 cm', 1.5, 'Antebrazo, hombro, tobillo', 2, 'Negro', 1, TRUE, 'mariposa-lineal'),
  (2, 'TF-002', 'Ola minimalista', 'Tres olas suaves en trazo muy fino. Perfecta para muñeca, tobillo o costillas.', 1, 45000, 38000, 10, 3, '8 x 3 cm', 1, 'Muñeca, tobillo, costillas', 2, 'Negro', 1, FALSE, 'ola-minimalista'),
  (3, 'TF-003', 'Ancla fina', 'Ancla de líneas delgadas con una cuerda simple. Un clásico reinterpretado en versión fineline.', 1, 52000, NULL, 2, 3, '5 x 7 cm', 1.5, 'Antebrazo, pantorrilla', 3, 'Negro', 3, FALSE, 'ancla-fina'),
  (4, 'TF-004', 'Rama de olivo', 'Rama larga con hojas alternadas. Se adapta a la curva del antebrazo o la clavícula.', 2, 58000, NULL, 9, 3, '12 x 4 cm', 2, 'Antebrazo, clavícula, costillas', 2, 'Negro', 1, TRUE, 'rama-de-olivo'),
  (5, 'TF-005', 'Helecho silvestre', 'Hoja de helecho con nervadura central y foliolos simétricos, pensada para zonas alargadas.', 2, 72000, 64000, 6, 2, '15 x 5 cm', 2.5, 'Costillas, espalda, pantorrilla', 3, 'Negro', 2, FALSE, 'helecho-silvestre'),
  (6, 'TF-006', 'Ramillete de lavanda', 'Tres tallos de lavanda unidos por un lazo mínimo. Pequeño, sutil y con mucho carácter.', 2, 48000, NULL, 7, 2, '9 x 3 cm', 1.5, 'Muñeca, antebrazo, tobillo', 2, 'Negro', 3, FALSE, 'ramillete-de-lavanda'),
  (7, 'TF-007', 'Cubo isométrico', 'Cubo en perspectiva isométrica con aristas limpias. Un diseño geométrico simple y elegante.', 3, 60000, NULL, 6, 2, '6 x 6 cm', 1.5, 'Antebrazo, hombro, pantorrilla', 3, 'Negro', 2, FALSE, 'cubo-isometrico'),
  (8, 'TF-008', 'Mandala de puntos', 'Mandala construido con círculos concéntricos y miles de puntos (dotwork). Pieza de sesión larga.', 3, 95000, NULL, 4, 2, '10 x 10 cm', 3.5, 'Espalda, muslo, hombro', 4, 'Negro', 2, TRUE, 'mandala-de-puntos'),
  (9, 'TF-009', 'Montaña geométrica', 'Cadena de montañas hecha con triángulos y un sol mínimo. Ideal para quienes aman el trekking.', 3, 55000, 49000, 8, 3, '8 x 5 cm', 1.5, 'Antebrazo, tobillo, costillas', 2, 'Negro', 2, FALSE, 'montana-geometrica'),
  (10, 'TF-010', 'Fases lunares', 'Las cinco fases de la luna en una hilera horizontal. Se ve muy bien a lo largo del antebrazo.', 4, 68000, NULL, 5, 2, '14 x 3 cm', 2, 'Antebrazo, columna, pantorrilla', 3, 'Negro', 1, TRUE, 'fases-lunares'),
  (11, 'TF-011', 'Sol y rayos', 'Un sol minimalista con rayos de distinto largo. Simple, luminoso y fácil de combinar.', 4, 50000, NULL, 1, 2, '6 x 6 cm', 1.5, 'Muñeca, hombro, tobillo', 2, 'Negro', 3, FALSE, 'sol-y-rayos'),
  (12, 'TF-012', 'Constelación', 'Puntos unidos por líneas muy finas, inspirados en el cielo del hemisferio sur.', 4, 62000, 55000, 7, 3, '12 x 8 cm', 2, 'Hombro, clavícula, espalda', 3, 'Negro', 1, FALSE, 'constelacion');

INSERT IGNORE INTO producto_imagenes (producto_id, orden, imagen) VALUES
  (1, 0, 'mariposa-lineal'),
  (1, 1, 'mariposa-lineal-cuerpo'),
  (2, 0, 'ola-minimalista'),
  (2, 1, 'ola-minimalista-cuerpo'),
  (3, 0, 'ancla-fina'),
  (3, 1, 'ancla-fina-cuerpo'),
  (4, 0, 'rama-de-olivo'),
  (4, 1, 'rama-de-olivo-cuerpo'),
  (5, 0, 'helecho-silvestre'),
  (5, 1, 'helecho-silvestre-cuerpo'),
  (6, 0, 'ramillete-de-lavanda'),
  (6, 1, 'ramillete-de-lavanda-cuerpo'),
  (7, 0, 'cubo-isometrico'),
  (7, 1, 'cubo-isometrico-cuerpo'),
  (8, 0, 'mandala-de-puntos'),
  (8, 1, 'mandala-de-puntos-cuerpo'),
  (9, 0, 'montana-geometrica'),
  (9, 1, 'montana-geometrica-cuerpo'),
  (10, 0, 'fases-lunares'),
  (10, 1, 'fases-lunares-cuerpo'),
  (11, 0, 'sol-y-rayos'),
  (11, 1, 'sol-y-rayos-cuerpo'),
  (12, 0, 'constelacion'),
  (12, 1, 'constelacion-cuerpo');
