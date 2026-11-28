-- Migración: «Texto escrito por» admite enlaces y formato (HTML).
-- Se amplía la columna para que quepa el código del enlace; el texto visible sigue limitado a 200 caracteres.
-- Idempotente: se puede ejecutar más de una vez sin errores.
BEGIN;
ALTER TABLE noticia ALTER COLUMN autor TYPE VARCHAR(1000);
COMMENT ON COLUMN noticia.autor IS 'Quién escribió la noticia (puede incluir formato y enlaces en HTML; máximo 200 caracteres visibles); se muestra al final como «Texto escrito por».';
COMMIT;
