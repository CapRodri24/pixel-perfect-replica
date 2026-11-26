-- Migración: «Fotos por» en noticias y tienda de Souvenirs (productos y promociones).
-- Idempotente: se puede ejecutar más de una vez sin errores.

BEGIN;

-- 1. NOTICIAS: autor de las fotografías.
ALTER TABLE noticia ADD COLUMN IF NOT EXISTS fotos_por VARCHAR(200);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'noticia_fotos_por_no_vacio') THEN
        ALTER TABLE noticia ADD CONSTRAINT noticia_fotos_por_no_vacio CHECK (fotos_por IS NULL OR btrim(fotos_por) <> '');
    END IF;
END $$;
COMMENT ON COLUMN noticia.fotos_por IS 'Autor o autores de las fotografías; se muestra al final, antes de «Texto escrito por», como «Fotos por».';

-- 2. SOUVENIRS: productos con colores, tallas, precio e imagen.
CREATE TABLE IF NOT EXISTS souvenir (
    id_souvenir BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_es VARCHAR(150) NOT NULL,
    nombre_en VARCHAR(150) NOT NULL,
    colores_es TEXT[] NOT NULL DEFAULT '{}',
    colores_en TEXT[] NOT NULL DEFAULT '{}',
    tallas TEXT[] NOT NULL DEFAULT '{}',
    precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    id_imagen BIGINT NOT NULL REFERENCES imagen(id_imagen) ON DELETE RESTRICT,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT souvenir_nombre_no_vacio CHECK (btrim(nombre_es) <> '' AND btrim(nombre_en) <> ''),
    CONSTRAINT souvenir_colores_traducidos CHECK (cardinality(colores_es) = cardinality(colores_en))
);

-- 3. PROMOCIONES: apartado especial con productos incluidos, precio y vigencia.
CREATE TABLE IF NOT EXISTS souvenir_promocion (
    id_promocion BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo_es VARCHAR(150) NOT NULL,
    titulo_en VARCHAR(150) NOT NULL,
    descripcion_es TEXT,
    descripcion_en TEXT,
    id_imagen BIGINT REFERENCES imagen(id_imagen) ON DELETE RESTRICT,
    precio NUMERIC(10,2) CHECK (precio IS NULL OR precio >= 0),
    fecha_inicio DATE,
    fecha_fin DATE,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT promocion_titulo_no_vacio CHECK (btrim(titulo_es) <> '' AND btrim(titulo_en) <> ''),
    CONSTRAINT promocion_fechas CHECK (fecha_inicio IS NULL OR fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE IF NOT EXISTS souvenir_promocion_producto (
    id_promocion BIGINT NOT NULL REFERENCES souvenir_promocion(id_promocion) ON DELETE CASCADE,
    id_souvenir BIGINT NOT NULL REFERENCES souvenir(id_souvenir) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad BETWEEN 1 AND 99),
    orden INTEGER NOT NULL CHECK (orden > 0),
    PRIMARY KEY (id_promocion, id_souvenir)
);

DROP TRIGGER IF EXISTS souvenir_actualizado ON souvenir;
CREATE TRIGGER souvenir_actualizado BEFORE UPDATE ON souvenir
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
DROP TRIGGER IF EXISTS promocion_actualizada ON souvenir_promocion;
CREATE TRIGGER promocion_actualizada BEFORE UPDATE ON souvenir_promocion
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

CREATE INDEX IF NOT EXISTS idx_souvenir_disponible ON souvenir (disponible, created_at);
CREATE INDEX IF NOT EXISTS idx_promocion_vigencia ON souvenir_promocion (activa, fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_promocion_producto_souvenir ON souvenir_promocion_producto (id_souvenir);

COMMENT ON TABLE souvenir IS 'Productos de la tienda de souvenirs que se muestran en la web.';
COMMENT ON COLUMN souvenir.colores_es IS 'Colores disponibles en español; colores_en guarda la traducción en el mismo orden.';
COMMENT ON COLUMN souvenir.tallas IS 'Tallas disponibles (S, M, L, Talla única…); vacío si el producto no tiene tallas.';
COMMENT ON COLUMN souvenir.precio IS 'Precio en bolivianos (Bs).';
COMMENT ON COLUMN souvenir.disponible IS 'Si es falso, el producto no se muestra en la web.';
COMMENT ON TABLE souvenir_promocion IS 'Promociones o combos destacados en la tienda de souvenirs.';
COMMENT ON COLUMN souvenir_promocion.precio IS 'Precio promocional en Bs; el precio normal se calcula sumando los productos incluidos.';
COMMENT ON COLUMN souvenir_promocion.id_imagen IS 'Imagen o banner de la promoción (por ejemplo, exportado desde Canva); opcional.';
COMMENT ON COLUMN souvenir_promocion.fecha_inicio IS 'Desde cuándo se muestra; vacío = desde ya.';
COMMENT ON COLUMN souvenir_promocion.fecha_fin IS 'Último día que se muestra; vacío = sin fecha de fin.';

COMMIT;
