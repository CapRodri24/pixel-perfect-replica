-- =============================================================
-- ASOCIACIÓN CIVIL ARMONÍA - BASE DE DATOS (POSTGRESQL)
-- Esquema normalizado para el CMS bilingüe ES/EN.
-- Imágenes y PDF almacenados como BYTEA; fechas en hora local de La Paz.
-- Ejecutar sobre una base de datos vacía ya creada.
-- =============================================================
BEGIN;

-- 1. USUARIOS. Guardar hashes seguros, NUNCA contraseñas en texto plano.
CREATE TABLE usuario (
    id_usuario BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario VARCHAR(80) NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    CONSTRAINT usuario_nombre_no_vacio CHECK (btrim(usuario) <> ''),
    CONSTRAINT usuario_hash_no_vacio CHECK (btrim(contrasena_hash) <> '')
);

-- 2. IMÁGENES: se guarda el archivo binario directamente en PostgreSQL (BYTEA).
-- alt_es / alt_en: texto alternativo para accesibilidad, lectores de pantalla
-- y cuando una imagen no puede visualizarse. No es la descripción editorial.
-- descripcion_es / descripcion_en: explicación o descripción de la fotografía.
-- credito: autoría o crédito fotográfico.
CREATE TABLE imagen (
    id_imagen BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    archivo BYTEA NOT NULL,
    nombre_archivo VARCHAR(255),
    mime VARCHAR(30) NOT NULL CHECK (mime IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif')),
    alt_es TEXT,
    alt_en TEXT,
    descripcion_es TEXT,
    descripcion_en TEXT,
    credito TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT imagen_archivo_no_vacio CHECK (octet_length(archivo) > 0)
);

-- 3. CONTENIDO EDITORIAL: datos comunes de paisaje, programa y noticia.
-- El título es fijo; los bloques ordenables empiezan DESPUÉS del título.
CREATE TABLE contenido_editorial (
    id_contenido BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(12) NOT NULL CHECK (tipo IN ('paisaje', 'programa', 'noticia')),
    titulo_es TEXT NOT NULL,
    titulo_en TEXT NOT NULL,
    fecha_publicacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT contenido_titulo_es_no_vacio CHECK (btrim(titulo_es) <> ''),
    CONSTRAINT contenido_titulo_en_no_vacio CHECK (btrim(titulo_en) <> '')
);

-- 4. PAISAJES: un paisaje puede tener muchos programas.
CREATE TABLE paisaje (
    id_paisaje BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_contenido BIGINT NOT NULL UNIQUE REFERENCES contenido_editorial(id_contenido) ON DELETE CASCADE,
    color CHAR(7) NOT NULL DEFAULT '#2381C4',
    CONSTRAINT paisaje_color_hex CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

-- 5. PROGRAMAS: cada programa pertenece obligatoriamente a un paisaje.
CREATE TABLE programa (
    id_programa BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_contenido BIGINT NOT NULL UNIQUE REFERENCES contenido_editorial(id_contenido) ON DELETE CASCADE,
    id_paisaje BIGINT NOT NULL REFERENCES paisaje(id_paisaje) ON DELETE RESTRICT
);

-- 6. CATEGORÍAS DE NOTICIAS.
CREATE TABLE categoria_noticia (
    id_categoria_noticia VARCHAR(30) PRIMARY KEY,
    nombre_es VARCHAR(100) NOT NULL,
    nombre_en VARCHAR(100) NOT NULL
);

INSERT INTO categoria_noticia (id_categoria_noticia, nombre_es, nombre_en) VALUES
('institutional', 'Noticias institucionales', 'Institutional news'),
('stories', 'Historias de conservación', 'Conservation stories'),
('events', 'Agenda y eventos', 'Events calendar'),
('social', 'Redes sociales', 'Social media'),
('videos', 'Videos de YouTube', 'YouTube videos'),
('infographics', 'Infografías', 'Infographics'),
('gallery', 'Fotogalería', 'Photo gallery');

-- 7. NOTICIAS: pueden estar vinculadas a un programa o ser independientes.
CREATE TABLE noticia (
    id_noticia BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_contenido BIGINT NOT NULL UNIQUE REFERENCES contenido_editorial(id_contenido) ON DELETE CASCADE,
    id_programa BIGINT REFERENCES programa(id_programa) ON DELETE SET NULL,
    id_categoria_noticia VARCHAR(30) NOT NULL REFERENCES categoria_noticia(id_categoria_noticia)
);

-- 8. BLOQUES EDITORIALES CON ORDEN LIBRE.
-- Tipos: párrafo, subtítulo, imagen, carrusel, enlace y video.
-- 'orden' puede reorganizarse sin cambiar el contenido del bloque.
CREATE TABLE bloque_editorial (
    id_bloque BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_contenido BIGINT NOT NULL REFERENCES contenido_editorial(id_contenido) ON DELETE CASCADE,
    tipo VARCHAR(12) NOT NULL CHECK (tipo IN ('parrafo', 'subtitulo', 'imagen', 'carrusel', 'enlace', 'video')),
    orden INTEGER NOT NULL CHECK (orden > 0),
    texto_es TEXT,
    texto_en TEXT,
    id_imagen BIGINT REFERENCES imagen(id_imagen) ON DELETE RESTRICT,
    pie_es TEXT,
    pie_en TEXT,
    url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT bloque_orden_unico UNIQUE (id_contenido, orden) DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT bloque_campos_segun_tipo CHECK (
        (tipo IN ('parrafo', 'subtitulo')
            AND NULLIF(btrim(texto_es), '') IS NOT NULL
            AND NULLIF(btrim(texto_en), '') IS NOT NULL
            AND id_imagen IS NULL AND url IS NULL)
        OR (tipo = 'imagen' AND id_imagen IS NOT NULL AND url IS NULL)
        OR (tipo = 'carrusel' AND id_imagen IS NULL AND url IS NULL)
        OR (tipo IN ('enlace', 'video') AND NULLIF(btrim(url), '') IS NOT NULL AND id_imagen IS NULL)
    )
);

-- 9. IMÁGENES DE CARRUSEL: N imágenes, cada una con su orden.
CREATE TABLE carrusel_imagen (
    id_carrusel_imagen BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_bloque BIGINT NOT NULL REFERENCES bloque_editorial(id_bloque) ON DELETE CASCADE,
    id_imagen BIGINT NOT NULL REFERENCES imagen(id_imagen) ON DELETE RESTRICT,
    orden INTEGER NOT NULL CHECK (orden > 0),
    pie_es TEXT,
    pie_en TEXT,
    CONSTRAINT carrusel_posicion_unica UNIQUE (id_bloque, orden) DEFERRABLE INITIALLY DEFERRED
);

-- 10. CARGOS, bilingües para el equipo.
CREATE TABLE cargo (
    id_cargo BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_cargo_es VARCHAR(150) NOT NULL UNIQUE,
    nombre_cargo_en VARCHAR(150) NOT NULL
);

-- 11. CATEGORÍAS DE SOCIOS / ALIADOS.
CREATE TABLE categoria_socio (
    id_categoria_socio VARCHAR(35) PRIMARY KEY,
    nombre_es VARCHAR(120) NOT NULL,
    nombre_en VARCHAR(120) NOT NULL
);
INSERT INTO categoria_socio (id_categoria_socio, nombre_es, nombre_en) VALUES
('socios_financieros', 'Socios y financieros', 'Partners and funders'),
('aliados_estrategicos', 'Aliados estratégicos', 'Strategic allies'),
('miembros_corporativos', 'Miembros corporativos', 'Corporate members');

-- 12. NOSOTROS: junta directiva / nuestro equipo / socios y aliados.
CREATE TABLE nosotros (
    id_nosotros BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('junta_directiva', 'nuestro_equipo', 'socios_y_aliados')),
    nombre VARCHAR(200) NOT NULL,
    texto_es TEXT NOT NULL,
    texto_en TEXT NOT NULL,
    id_imagen BIGINT NOT NULL REFERENCES imagen(id_imagen) ON DELETE RESTRICT,
    id_cargo BIGINT REFERENCES cargo(id_cargo) ON DELETE RESTRICT,
    id_categoria_socio VARCHAR(35) REFERENCES categoria_socio(id_categoria_socio) ON DELETE RESTRICT,
    orden INTEGER NOT NULL DEFAULT 1 CHECK (orden > 0),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT nosotros_nombre_no_vacio CHECK (btrim(nombre) <> ''),
    CONSTRAINT nosotros_tipo_relaciones CHECK (
        (tipo = 'nuestro_equipo' AND id_cargo IS NOT NULL AND id_categoria_socio IS NULL)
        OR (tipo = 'junta_directiva' AND id_cargo IS NULL AND id_categoria_socio IS NULL)
        OR (tipo = 'socios_y_aliados' AND id_cargo IS NULL AND id_categoria_socio IS NOT NULL)
    )
);

-- 13. CATEGORÍAS DE RECURSOS.
CREATE TABLE tipo_recurso (
    id_tipo_recurso VARCHAR(25) PRIMARY KEY,
    nombre_es VARCHAR(120) NOT NULL,
    nombre_en VARCHAR(120) NOT NULL
);
INSERT INTO tipo_recurso (id_tipo_recurso, nombre_es, nombre_en) VALUES
('informes', 'Informes y memorias', 'Reports and annual reviews'),
('publicaciones', 'Publicaciones científicas y técnicas', 'Scientific and technical publications'),
('sig', 'Recursos SIG / mapas', 'GIS resources and maps'),
('colaboraciones', 'Colaboraciones', 'Collaborations'),
('legales', 'Herramientas legales', 'Legal tools');

-- 14. ARCHIVOS PDF: se guarda el documento binario en PostgreSQL (BYTEA).
-- No se utiliza ninguna ruta ni URL para almacenar el PDF.
CREATE TABLE archivo_pdf (
    id_archivo_pdf BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    archivo BYTEA NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    mime VARCHAR(30) NOT NULL DEFAULT 'application/pdf' CHECK (mime = 'application/pdf'),
    tamano_bytes BIGINT GENERATED ALWAYS AS (octet_length(archivo)::BIGINT) STORED,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT archivo_pdf_no_vacio CHECK (octet_length(archivo) > 0)
);

-- 15. RECURSOS: exactamente una imagen de portada y uno o más PDF.
CREATE TABLE recurso (
    id_recurso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo_recurso VARCHAR(25) NOT NULL REFERENCES tipo_recurso(id_tipo_recurso),
    titulo_es TEXT NOT NULL,
    titulo_en TEXT NOT NULL,
    descripcion_es TEXT NOT NULL,
    descripcion_en TEXT NOT NULL,
    id_imagen BIGINT NOT NULL REFERENCES imagen(id_imagen) ON DELETE RESTRICT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT TIMEZONE('America/La_Paz', NOW()),
    CONSTRAINT recurso_titulo_es_no_vacio CHECK (btrim(titulo_es) <> ''),
    CONSTRAINT recurso_titulo_en_no_vacio CHECK (btrim(titulo_en) <> '')
);

-- 16. UN RECURSO PUEDE TENER VARIOS PDF EN UN ORDEN DETERMINADO.
CREATE TABLE recurso_pdf (
    id_recurso_pdf BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_recurso BIGINT NOT NULL REFERENCES recurso(id_recurso) ON DELETE CASCADE,
    id_archivo_pdf BIGINT NOT NULL REFERENCES archivo_pdf(id_archivo_pdf) ON DELETE RESTRICT,
    orden INTEGER NOT NULL CHECK (orden > 0),
    CONSTRAINT recurso_pdf_posicion_unica UNIQUE (id_recurso, orden) DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT recurso_pdf_sin_duplicados UNIQUE (id_recurso, id_archivo_pdf)
);

-- 17. VALIDAR QUE CADA SUBTIPO USE EL TIPO CORRECTO DE CONTENIDO.
CREATE FUNCTION validar_tipo_contenido() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE tipo_real TEXT;
BEGIN
    SELECT c.tipo INTO tipo_real FROM contenido_editorial c WHERE c.id_contenido = NEW.id_contenido;
    IF tipo_real IS DISTINCT FROM TG_ARGV[0] THEN
        RAISE EXCEPTION 'El contenido % debe ser de tipo %, pero es %', NEW.id_contenido, TG_ARGV[0], tipo_real;
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER paisaje_validar_tipo BEFORE INSERT OR UPDATE OF id_contenido ON paisaje
    FOR EACH ROW EXECUTE FUNCTION validar_tipo_contenido('paisaje');
CREATE TRIGGER programa_validar_tipo BEFORE INSERT OR UPDATE OF id_contenido ON programa
    FOR EACH ROW EXECUTE FUNCTION validar_tipo_contenido('programa');
CREATE TRIGGER noticia_validar_tipo BEFORE INSERT OR UPDATE OF id_contenido ON noticia
    FOR EACH ROW EXECUTE FUNCTION validar_tipo_contenido('noticia');

CREATE FUNCTION impedir_cambio_tipo_contenido() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.tipo IS DISTINCT FROM NEW.tipo THEN
        RAISE EXCEPTION 'No se permite cambiar el tipo de un contenido editorial existente';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER contenido_tipo_inmutable BEFORE UPDATE OF tipo ON contenido_editorial
    FOR EACH ROW EXECUTE FUNCTION impedir_cambio_tipo_contenido();

-- 18. ACTUALIZAR updated_at AUTOMÁTICAMENTE.
CREATE FUNCTION actualizar_timestamp() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = TIMEZONE('America/La_Paz', NOW());
    RETURN NEW;
END;
$$;
CREATE TRIGGER contenido_actualizado BEFORE UPDATE ON contenido_editorial
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER bloque_actualizado BEFORE UPDATE ON bloque_editorial
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER nosotros_actualizado BEFORE UPDATE ON nosotros
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();
CREATE TRIGGER recurso_actualizado BEFORE UPDATE ON recurso
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- 19. IMPEDIR AGREGAR FOTOS A BLOQUES QUE NO SEAN CARRUSELES.
CREATE FUNCTION validar_foto_carrusel() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM bloque_editorial WHERE id_bloque = NEW.id_bloque AND tipo = 'carrusel') THEN
        RAISE EXCEPTION 'Las imágenes del carrusel requieren un bloque de tipo carrusel';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER carrusel_tipo_valido BEFORE INSERT OR UPDATE OF id_bloque ON carrusel_imagen
    FOR EACH ROW EXECUTE FUNCTION validar_foto_carrusel();

CREATE FUNCTION impedir_cambio_bloque_carrusel() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.tipo = 'carrusel' AND NEW.tipo <> 'carrusel'
       AND EXISTS (SELECT 1 FROM carrusel_imagen WHERE id_bloque = OLD.id_bloque) THEN
        RAISE EXCEPTION 'Elimina antes las imágenes del carrusel para cambiar su tipo';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER bloque_carrusel_tipo BEFORE UPDATE OF tipo ON bloque_editorial
    FOR EACH ROW EXECUTE FUNCTION impedir_cambio_bloque_carrusel();

-- 20. VERIFICAR AL FINAL DE LA TRANSACCIÓN: CARRUSEL >= 2 IMÁGENES.
-- Un carrusel y sus fotos deben insertarse en la MISMA transacción.
CREATE FUNCTION comprobar_minimo_carrusel() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE objetivo BIGINT;
BEGIN
    IF TG_TABLE_NAME = 'bloque_editorial' THEN
        objetivo := NEW.id_bloque;
    ELSE
        objetivo := CASE WHEN TG_OP = 'DELETE' THEN OLD.id_bloque ELSE NEW.id_bloque END;
    END IF;
    IF EXISTS (SELECT 1 FROM bloque_editorial WHERE id_bloque = objetivo AND tipo = 'carrusel')
       AND (SELECT COUNT(*) FROM carrusel_imagen WHERE id_bloque = objetivo) < 2 THEN
        RAISE EXCEPTION 'El carrusel % necesita como mínimo dos imágenes', objetivo;
    END IF;
    IF TG_TABLE_NAME = 'carrusel_imagen' AND TG_OP = 'UPDATE'
       AND OLD.id_bloque IS DISTINCT FROM NEW.id_bloque
       AND EXISTS (SELECT 1 FROM bloque_editorial WHERE id_bloque = OLD.id_bloque AND tipo = 'carrusel')
       AND (SELECT COUNT(*) FROM carrusel_imagen WHERE id_bloque = OLD.id_bloque) < 2 THEN
        RAISE EXCEPTION 'El carrusel % necesita como mínimo dos imágenes', OLD.id_bloque;
    END IF;
    RETURN NULL;
END;
$$;
CREATE CONSTRAINT TRIGGER bloque_carrusel_minimo AFTER INSERT OR UPDATE ON bloque_editorial
    DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION comprobar_minimo_carrusel();
CREATE CONSTRAINT TRIGGER foto_carrusel_minimo AFTER INSERT OR UPDATE OR DELETE ON carrusel_imagen
    DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION comprobar_minimo_carrusel();

-- 21. VERIFICAR AL FINAL DE LA TRANSACCIÓN: RECURSO >= 1 PDF.
-- Crear el recurso y adjuntar al menos un PDF en la MISMA transacción.
CREATE FUNCTION comprobar_minimo_pdf_recurso() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE objetivo BIGINT;
BEGIN
    IF TG_TABLE_NAME = 'recurso' THEN
        objetivo := NEW.id_recurso;
    ELSE
        objetivo := CASE WHEN TG_OP = 'DELETE' THEN OLD.id_recurso ELSE NEW.id_recurso END;
    END IF;
    IF EXISTS (SELECT 1 FROM recurso WHERE id_recurso = objetivo)
       AND NOT EXISTS (SELECT 1 FROM recurso_pdf WHERE id_recurso = objetivo) THEN
        RAISE EXCEPTION 'El recurso % debe contener al menos un PDF', objetivo;
    END IF;
    IF TG_TABLE_NAME = 'recurso_pdf' AND TG_OP = 'UPDATE'
       AND OLD.id_recurso IS DISTINCT FROM NEW.id_recurso
       AND EXISTS (SELECT 1 FROM recurso WHERE id_recurso = OLD.id_recurso)
       AND NOT EXISTS (SELECT 1 FROM recurso_pdf WHERE id_recurso = OLD.id_recurso) THEN
        RAISE EXCEPTION 'El recurso % debe contener al menos un PDF', OLD.id_recurso;
    END IF;
    RETURN NULL;
END;
$$;
CREATE CONSTRAINT TRIGGER recurso_pdf_minimo AFTER INSERT OR UPDATE ON recurso
    DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION comprobar_minimo_pdf_recurso();
CREATE CONSTRAINT TRIGGER adjunto_pdf_minimo AFTER INSERT OR UPDATE OR DELETE ON recurso_pdf
    DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION comprobar_minimo_pdf_recurso();

-- 22. ÍNDICES PARA CONSULTAS Y RELACIONES FRECUENTES.
CREATE INDEX idx_contenido_tipo_fecha ON contenido_editorial (tipo, fecha_publicacion DESC);
CREATE INDEX idx_programa_paisaje ON programa (id_paisaje);
CREATE INDEX idx_noticia_programa ON noticia (id_programa);
CREATE INDEX idx_noticia_categoria ON noticia (id_categoria_noticia);
CREATE INDEX idx_bloque_contenido_orden ON bloque_editorial (id_contenido, orden);
CREATE INDEX idx_carrusel_bloque_orden ON carrusel_imagen (id_bloque, orden);
CREATE INDEX idx_nosotros_tipo_orden ON nosotros (tipo, orden);
CREATE INDEX idx_nosotros_cargo ON nosotros (id_cargo);
CREATE INDEX idx_nosotros_categoria_socio ON nosotros (id_categoria_socio);
CREATE INDEX idx_recurso_tipo ON recurso (id_tipo_recurso);
CREATE INDEX idx_recurso_pdf_orden ON recurso_pdf (id_recurso, orden);


-- 23. DICCIONARIO DE CAMPOS: aclaraciones para mantenimiento.
COMMENT ON COLUMN imagen.archivo IS 'Contenido binario de la imagen, almacenado en PostgreSQL mediante BYTEA.';
COMMENT ON COLUMN imagen.nombre_archivo IS 'Nombre original del archivo, por ejemplo paraba-barba-azul.jpg.';
COMMENT ON COLUMN imagen.mime IS 'Tipo de archivo de imagen: JPEG, PNG, WEBP o GIF.';
COMMENT ON COLUMN imagen.alt_es IS 'Texto alternativo en español para accesibilidad y lectores de pantalla.';
COMMENT ON COLUMN imagen.alt_en IS 'Texto alternativo en inglés para accesibilidad y lectores de pantalla.';
COMMENT ON COLUMN imagen.descripcion_es IS 'Descripción de la imagen en español, independiente del texto alternativo.';
COMMENT ON COLUMN imagen.descripcion_en IS 'Descripción de la imagen en inglés, independiente del texto alternativo.';
COMMENT ON COLUMN imagen.credito IS 'Nombre de quien tomó la fotografía o fuente que debe recibir crédito.';
COMMENT ON COLUMN imagen.created_at IS 'Fecha y hora de incorporación de la imagen en horario de La Paz.';
COMMENT ON COLUMN archivo_pdf.archivo IS 'Contenido binario completo del documento PDF, sin ruta externa.';
COMMENT ON COLUMN archivo_pdf.nombre_archivo IS 'Nombre del archivo PDF original.';
COMMENT ON COLUMN archivo_pdf.mime IS 'Tipo MIME del archivo; siempre application/pdf.';
COMMENT ON COLUMN archivo_pdf.tamano_bytes IS 'Tamaño del PDF, calculado automáticamente en bytes desde el BYTEA.';
COMMENT ON COLUMN bloque_editorial.orden IS 'Posición del bloque bajo el título fijo: 1, 2, 3, etc.';
COMMENT ON COLUMN bloque_editorial.texto_es IS 'Contenido textual en español para bloques de párrafo, subtítulo o enlace.';
COMMENT ON COLUMN bloque_editorial.texto_en IS 'Contenido textual en inglés del mismo bloque.';
COMMENT ON COLUMN bloque_editorial.pie_es IS 'Pie de imagen o de galería en español, opcional.';
COMMENT ON COLUMN bloque_editorial.pie_en IS 'Pie de imagen o de galería en inglés, opcional.';
COMMENT ON COLUMN bloque_editorial.url IS 'Enlace externo o dirección de video; no se usa para guardar imágenes ni PDF.';
COMMENT ON COLUMN contenido_editorial.fecha_publicacion IS 'Fecha y hora de publicación en horario local America/La_Paz.';
COMMENT ON COLUMN contenido_editorial.created_at IS 'Fecha y hora local de creación del registro.';
COMMENT ON COLUMN contenido_editorial.updated_at IS 'Fecha y hora local de la última actualización del registro.';

COMMIT;

-- FECHAS: TIMESTAMP WITHOUT TIME ZONE guarda la hora local de Bolivia.
-- TIMEZONE('America/La_Paz', NOW()) produce esa hora directamente.
-- No almacena el desplazamiento de zona horaria ni el instante UTC.
-- BORRADO EDITORIAL: eliminar la fila de contenido_editorial (propaga a su subtipo y bloques).
-- La app actual usa localStorage; esta BD requiere un backend/API para conectarla.
