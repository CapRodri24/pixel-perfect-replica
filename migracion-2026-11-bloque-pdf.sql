-- Migración: bloques de PDF en noticias, programas y paisajes.
-- Idempotente: se puede ejecutar más de una vez sin errores.
-- El PDF se guarda en archivo_pdf (BYTEA), igual que en Recursos.
-- Los enlaces (YouTube, SoundCloud, Genially, PDF por URL o páginas web) no
-- necesitan cambios: siguen siendo bloques 'enlace' y la web reconoce el tipo.

BEGIN;

ALTER TABLE bloque_editorial
    ADD COLUMN IF NOT EXISTS id_archivo_pdf BIGINT REFERENCES archivo_pdf(id_archivo_pdf) ON DELETE RESTRICT;

ALTER TABLE bloque_editorial DROP CONSTRAINT IF EXISTS bloque_editorial_tipo_check;
ALTER TABLE bloque_editorial ADD CONSTRAINT bloque_editorial_tipo_check
    CHECK (tipo IN ('parrafo', 'subtitulo', 'imagen', 'carrusel', 'enlace', 'video', 'pdf'));

ALTER TABLE bloque_editorial DROP CONSTRAINT IF EXISTS bloque_campos_segun_tipo;
ALTER TABLE bloque_editorial ADD CONSTRAINT bloque_campos_segun_tipo CHECK (
    (tipo IN ('parrafo', 'subtitulo')
        AND NULLIF(btrim(texto_es), '') IS NOT NULL
        AND NULLIF(btrim(texto_en), '') IS NOT NULL
        AND id_imagen IS NULL AND url IS NULL AND id_archivo_pdf IS NULL)
    OR (tipo = 'imagen' AND id_imagen IS NOT NULL AND url IS NULL AND id_archivo_pdf IS NULL)
    OR (tipo = 'carrusel' AND id_imagen IS NULL AND url IS NULL AND id_archivo_pdf IS NULL)
    OR (tipo IN ('enlace', 'video') AND NULLIF(btrim(url), '') IS NOT NULL AND id_imagen IS NULL AND id_archivo_pdf IS NULL)
    OR (tipo = 'pdf' AND id_archivo_pdf IS NOT NULL AND id_imagen IS NULL AND url IS NULL)
);

CREATE INDEX IF NOT EXISTS idx_bloque_pdf ON bloque_editorial (id_archivo_pdf) WHERE id_archivo_pdf IS NOT NULL;

COMMENT ON COLUMN bloque_editorial.id_archivo_pdf IS 'PDF subido para los bloques de tipo pdf; se puede ver o descargar desde la página.';
COMMENT ON COLUMN bloque_editorial.url IS 'Enlace de los bloques enlace/video: YouTube, SoundCloud, Genially, PDF o página web; la web detecta el tipo. No guarda imágenes ni PDF subidos.';

COMMIT;
