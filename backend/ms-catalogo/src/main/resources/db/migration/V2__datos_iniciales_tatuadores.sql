-- ms-catalogo · V2: datos iniciales (seed) de los tatuadores del estudio.
-- Ejemplo de migración con datos. Nunca se edita un script ya ejecutado: un cambio va en un V3.
-- El WHERE NOT EXISTS evita duplicarlos si la base ya los tenía (bases creadas antes de usar Flyway).
INSERT INTO tatuadores (nombre, especialidad, descripcion)
SELECT 'Isabel Cántaro', 'Todos los estilos', 'Te ayuda a elegir el diseño, el tamaño y la zona ideal para tu tatuaje.'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tatuadores WHERE nombre = 'Isabel Cántaro');

INSERT INTO tatuadores (nombre, especialidad, descripcion)
SELECT 'Eduardo Caro', 'Todos los estilos', 'Cuida que cada línea quede limpia y que tu tatuaje se vea bien por muchos años.'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tatuadores WHERE nombre = 'Eduardo Caro');

INSERT INTO tatuadores (nombre, especialidad, descripcion)
SELECT 'Yeremi Vásquez', 'Todos los estilos', 'Adapta los diseños del catálogo a tu cuerpo y a tu estilo personal.'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tatuadores WHERE nombre = 'Yeremi Vásquez');
