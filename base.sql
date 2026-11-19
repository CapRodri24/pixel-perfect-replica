-- ============================================================
-- ASOCIACIÓN ARMONÍA - PROPUESTA DE BASE DE DATOS POSTGRESQL
-- Ejecutar una sola vez en una base de datos vacía (PostgreSQL 12+).
-- No elimina tablas ni crea credenciales de acceso.
-- ============================================================
BEGIN;
SET LOCAL TIME ZONE 'America/La_Paz';

-- ============================================================
-- 1. SEGURIDAD
-- ============================================================
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE permiso (
    id_permiso SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL REFERENCES rol(id_rol),
    nombre VARCHAR(150) NOT NULL,
    usuario VARCHAR(80) NOT NULL UNIQUE,
    correo VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','inactivo','eliminado')),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_usuario_correo ON usuario (LOWER(correo));
CREATE TABLE rol_permiso (
    id_rol_permiso SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL REFERENCES rol(id_rol) ON DELETE CASCADE,
    id_permiso INTEGER NOT NULL REFERENCES permiso(id_permiso) ON DELETE CASCADE,
    UNIQUE(id_rol,id_permiso)
);
CREATE TABLE usuario_permiso (
    id_usuario_permiso SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_permiso INTEGER NOT NULL REFERENCES permiso(id_permiso) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('concedido','revocado')),
    UNIQUE(id_usuario,id_permiso)
);

-- ============================================================
-- 2. ARCHIVOS Y CONTENIDO EDITORIAL
-- ============================================================
-- Los binarios se guardan fuera de PostgreSQL; URL/ruta y metadatos aquí.
CREATE TABLE archivo (
    id_archivo SERIAL PRIMARY KEY,
    url TEXT NOT NULL CHECK (BTRIM(url) <> ''),
    nombre_archivo VARCHAR(255),
    mime_type VARCHAR(100),
    tamanio_bytes BIGINT CHECK (tamanio_bytes >= 0),
    credito_fotografico VARCHAR(200),
    alt_es TEXT,
    alt_en TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE contenido (
    id_contenido SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('paisaje','programa','noticia')),
    estado VARCHAR(20) NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','publicado','inactivo','eliminado')),
    id_usuario_creacion INTEGER REFERENCES usuario(id_usuario),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_publicacion TIMESTAMPTZ,
    UNIQUE(id_contenido,tipo),
    CHECK (estado <> 'publicado' OR fecha_publicacion IS NOT NULL)
);
CREATE TABLE bloque_contenido (
    id_bloque_contenido SERIAL PRIMARY KEY,
    id_contenido INTEGER NOT NULL REFERENCES contenido(id_contenido) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('title','subtitle','text','image','gallery','video')),
    orden INTEGER NOT NULL CHECK (orden >= 0),
    valor_es TEXT NOT NULL DEFAULT '',
    valor_en TEXT NOT NULL DEFAULT '',
    pie_es TEXT NOT NULL DEFAULT '',
    pie_en TEXT NOT NULL DEFAULT '',
    id_archivo INTEGER REFERENCES archivo(id_archivo),
    youtube_id VARCHAR(11),
    UNIQUE(id_bloque_contenido,tipo),
    CONSTRAINT uq_bloque_orden UNIQUE(id_contenido,orden) DEFERRABLE INITIALLY DEFERRED,
    CHECK ((tipo = 'title' AND orden = 0) OR (tipo <> 'title' AND orden > 0)),
    CHECK (tipo <> 'title' OR BTRIM(valor_es) <> ''),
    CHECK ((tipo = 'image' AND id_archivo IS NOT NULL) OR (tipo <> 'image' AND id_archivo IS NULL)),
    CHECK ((tipo = 'video' AND youtube_id IS NOT NULL AND youtube_id ~ '^[A-Za-z0-9_-]{11}$') OR (tipo <> 'video' AND youtube_id IS NULL))
);
CREATE UNIQUE INDEX idx_bloque_titulo_unico ON bloque_contenido(id_contenido) WHERE tipo = 'title';
CREATE TABLE bloque_imagen (
    id_bloque_imagen SERIAL PRIMARY KEY,
    id_bloque_contenido INTEGER NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'gallery' CHECK (tipo = 'gallery'),
    id_archivo INTEGER NOT NULL REFERENCES archivo(id_archivo),
    orden INTEGER NOT NULL CHECK (orden >= 0),
    pie_es TEXT,
    pie_en TEXT,
    FOREIGN KEY(id_bloque_contenido,tipo) REFERENCES bloque_contenido(id_bloque_contenido,tipo) ON DELETE CASCADE,
    CONSTRAINT uq_bloque_imagen_orden UNIQUE(id_bloque_contenido,orden) DEFERRABLE INITIALLY DEFERRED
);

-- ============================================================
-- 3. PAISAJES, PROGRAMAS Y NOTICIAS
-- ============================================================
-- El título se guarda en el bloque title; la descripción en los bloques text.
-- slug identifica la URL y facilita importar los identificadores mock.
CREATE TABLE paisaje (
    id_paisaje SERIAL PRIMARY KEY,
    id_contenido INTEGER NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL DEFAULT 'paisaje' CHECK (tipo = 'paisaje'),
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    color VARCHAR(7) NOT NULL DEFAULT '#2381C4' CHECK (color ~ '^#[A-Fa-f0-9]{6}$'),
    id_imagen_portada INTEGER REFERENCES archivo(id_archivo),
    orden INTEGER NOT NULL DEFAULT 0 CHECK (orden >= 0),
    FOREIGN KEY(id_contenido,tipo) REFERENCES contenido(id_contenido,tipo) ON DELETE RESTRICT
);
CREATE TABLE programa (
    id_programa SERIAL PRIMARY KEY,
    id_contenido INTEGER NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL DEFAULT 'programa' CHECK (tipo = 'programa'),
    id_paisaje INTEGER NOT NULL REFERENCES paisaje(id_paisaje) ON DELETE RESTRICT,
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    id_imagen_portada INTEGER REFERENCES archivo(id_archivo),
    orden INTEGER NOT NULL DEFAULT 0 CHECK (orden >= 0),
    FOREIGN KEY(id_contenido,tipo) REFERENCES contenido(id_contenido,tipo) ON DELETE RESTRICT
);
CREATE TABLE tipo_noticia (
    id_tipo_noticia SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    nombre_en VARCHAR(100) NOT NULL
);
CREATE TABLE noticia (
    id_noticia SERIAL PRIMARY KEY,
    id_contenido INTEGER NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL DEFAULT 'noticia' CHECK (tipo = 'noticia'),
    id_programa INTEGER REFERENCES programa(id_programa) ON DELETE RESTRICT,
    id_tipo_noticia INTEGER NOT NULL REFERENCES tipo_noticia(id_tipo_noticia),
    slug VARCHAR(150) NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    id_imagen_portada INTEGER REFERENCES archivo(id_archivo),
    fecha_noticia DATE NOT NULL DEFAULT (NOW() AT TIME ZONE 'America/La_Paz')::DATE,
    FOREIGN KEY(id_contenido,tipo) REFERENCES contenido(id_contenido,tipo) ON DELETE RESTRICT
);

-- ============================================================
-- 4. EQUIPO Y RECURSOS
-- ============================================================
CREATE TABLE area_equipo (
    id_area_equipo SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    nombre_en VARCHAR(100) NOT NULL
);
CREATE TABLE equipo (
    id_equipo SERIAL PRIMARY KEY,
    id_area_equipo INTEGER NOT NULL REFERENCES area_equipo(id_area_equipo),
    nombre VARCHAR(150) NOT NULL,
    cargo VARCHAR(150) NOT NULL,
    cargo_en VARCHAR(150),
    descripcion TEXT,
    descripcion_en TEXT,
    id_archivo INTEGER REFERENCES archivo(id_archivo),
    orden INTEGER NOT NULL DEFAULT 0 CHECK (orden >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','inactivo','eliminado')),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE tipo_recurso (
    id_tipo_recurso SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    nombre_en VARCHAR(150) NOT NULL
);
CREATE TABLE recurso (
    id_recurso SERIAL PRIMARY KEY,
    id_tipo_recurso INTEGER NOT NULL REFERENCES tipo_recurso(id_tipo_recurso),
    titulo VARCHAR(250) NOT NULL,
    titulo_en VARCHAR(250),
    descripcion TEXT,
    descripcion_en TEXT,
    anio SMALLINT CHECK (anio BETWEEN 1800 AND 2200),
    formato VARCHAR(20) NOT NULL CHECK (formato IN ('PDF','GeoJSON','KML','ZIP','DOCX','XLSX','Enlace','Otro')),
    id_archivo INTEGER REFERENCES archivo(id_archivo),
    estado VARCHAR(20) NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','publicado','inactivo','eliminado')),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (estado <> 'publicado' OR id_archivo IS NOT NULL)
);

-- ============================================================
-- 5. MEMBRESÍAS (SOLICITUDES, NO COBROS)
-- ============================================================
CREATE TABLE plan_membresia (
    id_plan_membresia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    nombre_en VARCHAR(100),
    descripcion TEXT,
    descripcion_en TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    moneda CHAR(3) NOT NULL DEFAULT 'BOB' CHECK (moneda ~ '^[A-Z]{3}$'),
    periodicidad VARCHAR(15) NOT NULL DEFAULT 'mensual' CHECK (periodicidad IN ('mensual','anual')),
    color VARCHAR(7) NOT NULL DEFAULT '#2381C4' CHECK (color ~ '^#[A-Fa-f0-9]{6}$'),
    id_archivo INTEGER REFERENCES archivo(id_archivo),
    orden INTEGER NOT NULL DEFAULT 0 CHECK (orden >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'inactivo' CHECK (estado IN ('activo','inactivo','eliminado'))
);
CREATE TABLE beneficio_plan (
    id_beneficio_plan SERIAL PRIMARY KEY,
    id_plan_membresia INTEGER NOT NULL REFERENCES plan_membresia(id_plan_membresia) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    descripcion_en TEXT,
    orden INTEGER NOT NULL DEFAULT 0 CHECK (orden >= 0)
);
CREATE TABLE solicitud_membresia (
    id_solicitud_membresia SERIAL PRIMARY KEY,
    id_plan_membresia INTEGER NOT NULL REFERENCES plan_membresia(id_plan_membresia) ON DELETE RESTRICT,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(254) NOT NULL,
    celular VARCHAR(30),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    precio_acordado DECIMAL(10,2) NOT NULL CHECK (precio_acordado >= 0),
    moneda CHAR(3) NOT NULL CHECK (moneda ~ '^[A-Z]{3}$'),
    periodicidad VARCHAR(15) NOT NULL CHECK (periodicidad IN ('mensual','anual')),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobada','rechazada','cancelada')),
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_respuesta TIMESTAMPTZ,
    id_usuario_respuesta INTEGER REFERENCES usuario(id_usuario)
);

-- ============================================================
-- 6. RESERVAS NATURALES Y SOLICITUDES DE VISITA
-- ============================================================
CREATE TABLE reserva_natural (
    id_reserva_natural SERIAL PRIMARY KEY,
    id_paisaje INTEGER NOT NULL REFERENCES paisaje(id_paisaje) ON DELETE RESTRICT,
    nombre VARCHAR(200) NOT NULL,
    nombre_en VARCHAR(200),
    descripcion TEXT,
    descripcion_en TEXT,
    ubicacion VARCHAR(200),
    recomendaciones TEXT,
    recomendaciones_en TEXT,
    id_archivo INTEGER REFERENCES archivo(id_archivo),
    estado VARCHAR(20) NOT NULL DEFAULT 'inactivo' CHECK (estado IN ('activo','inactivo','eliminado')),
    UNIQUE(id_paisaje,nombre)
);
CREATE TABLE solicitud_visita (
    id_solicitud_visita SERIAL PRIMARY KEY,
    id_reserva_natural INTEGER NOT NULL REFERENCES reserva_natural(id_reserva_natural) ON DELETE RESTRICT,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(254) NOT NULL,
    celular VARCHAR(30),
    fecha_preferida DATE NOT NULL,
    cantidad_visitantes INTEGER NOT NULL CHECK (cantidad_visitantes > 0),
    comentarios TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmada','rechazada','cancelada','realizada')),
    fecha_solicitud TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_respuesta TIMESTAMPTZ,
    id_usuario_respuesta INTEGER REFERENCES usuario(id_usuario)
);

-- ============================================================
-- 7. CONTACTO, PRENSA Y SOUVENIRS
-- ============================================================
CREATE TABLE consulta (
    id_consulta SERIAL PRIMARY KEY,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('general','membresia','donaciones','turismo','prensa','souvenirs','oficinas','otros')),
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(254) NOT NULL,
    celular VARCHAR(30),
    medio_institucion VARCHAR(200),
    asunto VARCHAR(250),
    mensaje TEXT NOT NULL CHECK (BTRIM(mensaje) <> ''),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','en_revision','respondida','cerrada')),
    fecha_consulta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_respuesta TIMESTAMPTZ,
    id_usuario_respuesta INTEGER REFERENCES usuario(id_usuario)
);
CREATE TABLE souvenir (
    id_souvenir SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nombre_en VARCHAR(150),
    descripcion TEXT,
    descripcion_en TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    moneda CHAR(3) NOT NULL DEFAULT 'BOB' CHECK (moneda ~ '^[A-Z]{3}$'),
    id_archivo INTEGER REFERENCES archivo(id_archivo),
    estado VARCHAR(20) NOT NULL DEFAULT 'inactivo' CHECK (estado IN ('activo','inactivo','eliminado')),
    orden INTEGER NOT NULL DEFAULT 0 CHECK (orden >= 0)
);
-- El carrito actual es local y genera un mensaje WhatsApp; no crea pedidos.
-- No se almacenan pagos QR/Givebutter ni se simula su confirmación.

-- ============================================================
-- 8. ÍNDICES (PK y UNIQUE ya tienen índice)
-- ============================================================
CREATE INDEX idx_usuario_id_rol ON usuario(id_rol);
CREATE INDEX idx_rol_permiso_id_permiso ON rol_permiso(id_permiso);
CREATE INDEX idx_usuario_permiso_id_permiso ON usuario_permiso(id_permiso);
CREATE INDEX idx_contenido_tipo_estado_fecha ON contenido(tipo,estado,fecha_publicacion DESC);
CREATE INDEX idx_contenido_usuario ON contenido(id_usuario_creacion);
CREATE INDEX idx_bloque_archivo ON bloque_contenido(id_archivo);
CREATE INDEX idx_bloque_imagen_archivo ON bloque_imagen(id_archivo);
CREATE INDEX idx_paisaje_orden ON paisaje(orden);
CREATE INDEX idx_paisaje_portada ON paisaje(id_imagen_portada);
CREATE INDEX idx_programa_paisaje ON programa(id_paisaje,orden);
CREATE INDEX idx_programa_portada ON programa(id_imagen_portada);
CREATE INDEX idx_noticia_programa ON noticia(id_programa,fecha_noticia DESC);
CREATE INDEX idx_noticia_tipo_fecha ON noticia(id_tipo_noticia,fecha_noticia DESC);
CREATE INDEX idx_noticia_portada ON noticia(id_imagen_portada);
CREATE INDEX idx_noticia_fecha ON noticia(fecha_noticia DESC);
CREATE INDEX idx_equipo_area_estado ON equipo(id_area_equipo,estado,orden);
CREATE INDEX idx_equipo_archivo ON equipo(id_archivo);
CREATE INDEX idx_recurso_tipo_estado ON recurso(id_tipo_recurso,estado,anio DESC);
CREATE INDEX idx_recurso_archivo ON recurso(id_archivo);
CREATE INDEX idx_beneficio_plan ON beneficio_plan(id_plan_membresia,orden);
CREATE INDEX idx_plan_archivo ON plan_membresia(id_archivo);
CREATE INDEX idx_solicitud_membresia_plan ON solicitud_membresia(id_plan_membresia);
CREATE INDEX idx_solicitud_membresia_estado ON solicitud_membresia(estado,fecha_solicitud DESC);
CREATE INDEX idx_solicitud_membresia_correo ON solicitud_membresia(LOWER(correo));
CREATE INDEX idx_solicitud_membresia_usuario ON solicitud_membresia(id_usuario_respuesta);
CREATE INDEX idx_reserva_archivo ON reserva_natural(id_archivo);
CREATE INDEX idx_solicitud_visita_reserva ON solicitud_visita(id_reserva_natural,fecha_preferida);
CREATE INDEX idx_solicitud_visita_estado ON solicitud_visita(estado,fecha_solicitud DESC);
CREATE INDEX idx_solicitud_visita_usuario ON solicitud_visita(id_usuario_respuesta);
CREATE INDEX idx_consulta_estado ON consulta(estado,fecha_consulta DESC);
CREATE INDEX idx_consulta_usuario ON consulta(id_usuario_respuesta);
CREATE INDEX idx_souvenir_estado_orden ON souvenir(estado,orden);
CREATE INDEX idx_souvenir_archivo ON souvenir(id_archivo);

-- ============================================================
-- 9. FUNCIONES Y TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_usuario_actualizacion BEFORE UPDATE ON usuario FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();
CREATE TRIGGER trg_contenido_actualizacion BEFORE UPDATE ON contenido FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();
CREATE TRIGGER trg_equipo_actualizacion BEFORE UPDATE ON equipo FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();
CREATE TRIGGER trg_recurso_actualizacion BEFORE UPDATE ON recurso FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- La aplicación crea contenido, entidad y bloques en una sola transacción.
-- La validación diferida permite insertar/reordenar bloques durante esa transacción.
CREATE OR REPLACE FUNCTION validar_contenido_publicado(p_id INTEGER)
RETURNS VOID AS $$
DECLARE c contenido%ROWTYPE;
BEGIN
    SELECT * INTO c FROM contenido WHERE id_contenido = p_id;
    IF NOT FOUND OR c.estado <> 'publicado' THEN RETURN; END IF;
    IF NOT EXISTS (SELECT 1 FROM bloque_contenido WHERE id_contenido=p_id AND tipo='title' AND BTRIM(valor_es)<>'') THEN
        RAISE EXCEPTION 'El contenido % necesita un título', p_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM bloque_contenido WHERE id_contenido=p_id AND tipo<>'title' AND (BTRIM(valor_es)<>'' OR id_archivo IS NOT NULL OR youtube_id IS NOT NULL OR tipo='gallery')) THEN
        RAISE EXCEPTION 'El contenido % necesita un bloque adicional', p_id;
    END IF;
    IF EXISTS (SELECT 1 FROM bloque_contenido b WHERE b.id_contenido=p_id AND b.tipo='gallery' AND NOT EXISTS (SELECT 1 FROM bloque_imagen i WHERE i.id_bloque_contenido=b.id_bloque_contenido)) THEN
        RAISE EXCEPTION 'El contenido % tiene un carrusel vacío', p_id;
    END IF;
    IF c.tipo='paisaje' AND NOT EXISTS (SELECT 1 FROM paisaje WHERE id_contenido=p_id) THEN RAISE EXCEPTION 'Falta el paisaje del contenido %',p_id; END IF;
    IF c.tipo='programa' AND NOT EXISTS (SELECT 1 FROM programa WHERE id_contenido=p_id) THEN RAISE EXCEPTION 'Falta el programa del contenido %',p_id; END IF;
    IF c.tipo='noticia' AND NOT EXISTS (SELECT 1 FROM noticia WHERE id_contenido=p_id) THEN RAISE EXCEPTION 'Falta la noticia del contenido %',p_id; END IF;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION trg_validar_editorial()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP <> 'INSERT' THEN PERFORM validar_contenido_publicado(OLD.id_contenido); END IF;
    IF TG_OP <> 'DELETE' THEN PERFORM validar_contenido_publicado(NEW.id_contenido); END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE CONSTRAINT TRIGGER trg_validar_contenido AFTER INSERT OR UPDATE ON contenido DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION trg_validar_editorial();
CREATE CONSTRAINT TRIGGER trg_validar_bloque AFTER INSERT OR UPDATE OR DELETE ON bloque_contenido DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION trg_validar_editorial();
CREATE CONSTRAINT TRIGGER trg_validar_paisaje AFTER INSERT OR UPDATE OR DELETE ON paisaje DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION trg_validar_editorial();
CREATE CONSTRAINT TRIGGER trg_validar_programa AFTER INSERT OR UPDATE OR DELETE ON programa DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION trg_validar_editorial();
CREATE CONSTRAINT TRIGGER trg_validar_noticia AFTER INSERT OR UPDATE OR DELETE ON noticia DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION trg_validar_editorial();
CREATE OR REPLACE FUNCTION trg_validar_galeria()
RETURNS TRIGGER AS $$
DECLARE p_id INTEGER;
BEGIN
    IF TG_OP <> 'INSERT' THEN SELECT id_contenido INTO p_id FROM bloque_contenido WHERE id_bloque_contenido=OLD.id_bloque_contenido; PERFORM validar_contenido_publicado(p_id); END IF;
    IF TG_OP <> 'DELETE' THEN SELECT id_contenido INTO p_id FROM bloque_contenido WHERE id_bloque_contenido=NEW.id_bloque_contenido; PERFORM validar_contenido_publicado(p_id); END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE CONSTRAINT TRIGGER trg_validar_imagen_galeria AFTER INSERT OR UPDATE OR DELETE ON bloque_imagen DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION trg_validar_galeria();

-- Impedir eliminación lógica del padre mientras existan hijos no eliminados.
CREATE OR REPLACE FUNCTION proteger_eliminacion_editorial()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado='eliminado' AND OLD.estado IS DISTINCT FROM NEW.estado THEN
        IF NEW.tipo='paisaje' AND EXISTS (SELECT 1 FROM paisaje p JOIN programa g USING(id_paisaje) JOIN contenido c ON c.id_contenido=g.id_contenido WHERE p.id_contenido=NEW.id_contenido AND c.estado<>'eliminado') THEN
            RAISE EXCEPTION 'Reasigna o elimina los programas asociados primero';
        END IF;
        IF NEW.tipo='programa' AND EXISTS (SELECT 1 FROM programa p JOIN noticia n USING(id_programa) JOIN contenido c ON c.id_contenido=n.id_contenido WHERE p.id_contenido=NEW.id_contenido AND c.estado<>'eliminado') THEN
            RAISE EXCEPTION 'Desvincula, reasigna o elimina las noticias asociadas primero';
        END IF;
        IF NEW.tipo='paisaje' AND EXISTS (SELECT 1 FROM paisaje p JOIN reserva_natural r USING(id_paisaje) WHERE p.id_contenido=NEW.id_contenido AND r.estado<>'eliminado') THEN
            RAISE EXCEPTION 'Reasigna o elimina las reservas naturales asociadas primero';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_proteger_eliminacion BEFORE UPDATE OF estado ON contenido FOR EACH ROW EXECUTE FUNCTION proteger_eliminacion_editorial();

-- ============================================================
-- 10. VISTAS PARA CONSULTAS PÚBLICAS (SIN DATOS PERSONALES)
-- ============================================================
CREATE VIEW vista_paisaje_publicado AS
SELECT p.id_paisaje,p.id_contenido,p.slug,p.color,p.orden,b.valor_es AS nombre,b.valor_en AS nombre_en,a.url AS imagen
FROM paisaje p JOIN contenido c USING(id_contenido)
JOIN bloque_contenido b ON b.id_contenido=c.id_contenido AND b.tipo='title'
LEFT JOIN archivo a ON a.id_archivo=p.id_imagen_portada
WHERE c.estado='publicado' AND c.fecha_publicacion<=NOW();
CREATE VIEW vista_programa_publicado AS
SELECT p.id_programa,p.id_contenido,p.id_paisaje,p.slug,p.orden,b.valor_es AS nombre,b.valor_en AS nombre_en,a.url AS imagen
FROM programa p JOIN contenido c USING(id_contenido)
JOIN vista_paisaje_publicado v ON v.id_paisaje=p.id_paisaje
JOIN bloque_contenido b ON b.id_contenido=c.id_contenido AND b.tipo='title'
LEFT JOIN archivo a ON a.id_archivo=p.id_imagen_portada
WHERE c.estado='publicado' AND c.fecha_publicacion<=NOW();
CREATE VIEW vista_noticia_publicada AS
SELECT n.id_noticia,n.id_contenido,n.id_programa,n.slug,n.fecha_noticia,t.codigo AS categoria,b.valor_es AS titulo,b.valor_en AS titulo_en,a.url AS imagen
FROM noticia n JOIN contenido c USING(id_contenido)
JOIN tipo_noticia t USING(id_tipo_noticia)
JOIN bloque_contenido b ON b.id_contenido=c.id_contenido AND b.tipo='title'
LEFT JOIN archivo a ON a.id_archivo=n.id_imagen_portada
WHERE c.estado='publicado' AND c.fecha_publicacion<=NOW()
AND (n.id_programa IS NULL OR EXISTS (SELECT 1 FROM vista_programa_publicado p WHERE p.id_programa=n.id_programa));
CREATE VIEW vista_recurso_publicado AS
SELECT r.id_recurso,t.codigo AS tipo,r.titulo,r.titulo_en,r.descripcion,r.descripcion_en,r.anio,r.formato,a.url
FROM recurso r JOIN tipo_recurso t USING(id_tipo_recurso) JOIN archivo a USING(id_archivo)
WHERE r.estado='publicado';
CREATE VIEW vista_equipo_activo AS
SELECT e.id_equipo,e.nombre,e.cargo,e.cargo_en,e.descripcion,e.descripcion_en,e.orden,t.codigo AS grupo,a.url AS imagen
FROM equipo e JOIN area_equipo t USING(id_area_equipo) LEFT JOIN archivo a USING(id_archivo)
WHERE e.estado='activo';

-- ============================================================
-- 11. DATOS INICIALES: CATÁLOGOS Y PERMISOS
-- ============================================================
INSERT INTO rol(nombre) VALUES ('Administrador'),('Editor'),('Consulta');
INSERT INTO permiso(nombre) VALUES
('dashboard'),('paisajes'),('programas'),('noticias'),('equipo'),('recursos'),
('membresias'),('reservas'),('consultas'),('souvenirs'),('usuarios'),('configuracion');
INSERT INTO rol_permiso(id_rol,id_permiso)
SELECT r.id_rol,p.id_permiso FROM rol r CROSS JOIN permiso p WHERE r.nombre='Administrador';
INSERT INTO rol_permiso(id_rol,id_permiso)
SELECT r.id_rol,p.id_permiso FROM rol r CROSS JOIN permiso p WHERE r.nombre='Editor' AND p.nombre IN ('dashboard','paisajes','programas','noticias','equipo','recursos');
INSERT INTO rol_permiso(id_rol,id_permiso)
SELECT r.id_rol,p.id_permiso FROM rol r CROSS JOIN permiso p WHERE r.nombre='Consulta' AND p.nombre='dashboard';
INSERT INTO tipo_noticia(codigo,nombre,nombre_en) VALUES
('institutional','Noticias institucionales','Institutional news'),
('stories','Historias de conservación','Conservation stories'),
('events','Agenda y eventos','Agenda and events'),
('social','Redes sociales','Social media'),
('videos','Videos de YouTube','YouTube videos'),
('infographics','Infografías','Infographics'),
('gallery','Fotogalería / Flickr','Photo gallery / Flickr');
INSERT INTO tipo_recurso(codigo,nombre,nombre_en) VALUES
('informes','Informes y memorias','Reports and annual reviews'),
('publicaciones','Publicaciones científicas y técnicas','Scientific and technical publications'),
('sig','Recursos SIG / mapas','GIS resources / maps'),
('colaboraciones','Colaboraciones','Collaborations'),
('legales','Herramientas legales','Legal tools');
INSERT INTO area_equipo(codigo,nombre,nombre_en) VALUES
('direccion','Dirección','Management'),('programas','Programas','Programmes'),('apoyo','Áreas de apoyo','Support areas');

-- ============================================================
-- 12. DATOS MOCK: SE MANTIENEN COMO BORRADORES / INACTIVOS
-- ============================================================
DO $$
DECLARE
    r RECORD; c_id INTEGER; a_id INTEGER; p_id INTEGER; g_id INTEGER;
BEGIN
    FOR r IN SELECT * FROM (VALUES
        ('beni','Pastizales del Beni','Beni Grasslands','#9b793c',1),
        ('yungas','Yungas','Yungas','#34734e',2),
        ('andes','Andes Altos','High Andes','#648497',3),
        ('seco','Bosque Seco Interandino','Inter-Andean Dry Forest','#ad7851',4),
        ('amazonia','Amazonía','Amazon','#668f37',5)
    ) AS v(slug,es,en,color,orden) LOOP
        INSERT INTO archivo(url,mime_type) VALUES ('/images/home/'||r.orden||'.jpg','image/jpeg') RETURNING id_archivo INTO a_id;
        INSERT INTO contenido(tipo) VALUES ('paisaje') RETURNING id_contenido INTO c_id;
        INSERT INTO paisaje(id_contenido,slug,color,id_imagen_portada,orden) VALUES(c_id,r.slug,r.color,a_id,r.orden);
        INSERT INTO bloque_contenido(id_contenido,tipo,orden,valor_es,valor_en) VALUES
            (c_id,'title',0,r.es,r.en),(c_id,'text',1,'Contenido de demostración del paisaje.','Sample landscape content.');
        INSERT INTO bloque_contenido(id_contenido,tipo,orden,id_archivo) VALUES(c_id,'image',2,a_id);
    END LOOP;
    SELECT id_paisaje,id_imagen_portada INTO p_id,a_id FROM paisaje WHERE slug='beni';
    INSERT INTO contenido(tipo) VALUES ('programa') RETURNING id_contenido INTO c_id;
    INSERT INTO programa(id_contenido,id_paisaje,slug,id_imagen_portada) VALUES(c_id,p_id,'barbaazul',a_id) RETURNING id_programa INTO g_id;
    INSERT INTO bloque_contenido(id_contenido,tipo,orden,valor_es,valor_en) VALUES
        (c_id,'title',0,'Paraba Barba Azul','Blue-throated Macaw'),(c_id,'text',1,'Ejemplo de programa de conservación.','Sample conservation programme.');
    INSERT INTO contenido(tipo) VALUES ('noticia') RETURNING id_contenido INTO c_id;
    INSERT INTO noticia(id_contenido,id_programa,id_tipo_noticia,slug,id_imagen_portada) VALUES(c_id,g_id,(SELECT id_tipo_noticia FROM tipo_noticia WHERE codigo='stories'),'demo-n1',a_id);
    INSERT INTO bloque_contenido(id_contenido,tipo,orden,valor_es,valor_en) VALUES
        (c_id,'title',0,'Monitoreo de aves — ejemplo','Bird monitoring — sample'),(c_id,'text',1,'Noticia de demostración asociada a un programa.','Sample news linked to a programme.');
    INSERT INTO contenido(tipo) VALUES ('noticia') RETURNING id_contenido INTO c_id;
    INSERT INTO noticia(id_contenido,id_tipo_noticia,slug) VALUES(c_id,(SELECT id_tipo_noticia FROM tipo_noticia WHERE codigo='institutional'),'demo-n2');
    INSERT INTO bloque_contenido(id_contenido,tipo,orden,valor_es,valor_en) VALUES
        (c_id,'title',0,'Noticias institucionales — ejemplo','Institutional news — sample'),(c_id,'text',1,'Noticia independiente de demostración.','Independent sample news.');
END;
$$;
INSERT INTO plan_membresia(nombre,nombre_en,descripcion,precio,color,orden) VALUES
('Alas libres','Free wings','Plan de demostración.',30,'#185e91',1),
('Hábitat vivo','Living habitat','Plan de demostración.',60,'#246344',2),
('Guardianes de la naturaleza','Nature guardians','Plan de demostración.',120,'#805b19',3);
INSERT INTO reserva_natural(id_paisaje,nombre) VALUES
((SELECT id_paisaje FROM paisaje WHERE slug='beni'),'Reserva Natural Barba Azul'),
((SELECT id_paisaje FROM paisaje WHERE slug='beni'),'Reserva Laney Rickman'),
((SELECT id_paisaje FROM paisaje WHERE slug='seco'),'Reserva Natural Comunitaria de la Paraba Frente Roja');
INSERT INTO souvenir(nombre,nombre_en,precio,orden) VALUES
('Bolsa reutilizable','Reusable bag',35,1),('Polera institucional','Institutional T-shirt',90,2),
('Set de postales de aves','Bird postcard set',25,3),('Cuaderno de campo','Field notebook',45,4);
COMMIT;

-- ============================================================
-- 13. CONSULTAS DE EJEMPLO (NO MODIFICAN DATOS)
-- ============================================================
-- Header de paisajes:
-- SELECT * FROM vista_paisaje_publicado ORDER BY orden,id_paisaje;
-- Programas asociados a un paisaje:
-- SELECT * FROM vista_programa_publicado WHERE id_paisaje=1 ORDER BY orden,id_programa;
-- Noticias de un programa:
-- SELECT * FROM vista_noticia_publicada WHERE id_programa=1 ORDER BY fecha_noticia DESC,id_noticia DESC;
-- Noticias independientes:
-- SELECT * FROM vista_noticia_publicada WHERE id_programa IS NULL ORDER BY fecha_noticia DESC;
-- Bloques del contenido (la API debe verificar estado y visibilidad antes de consultar):
-- SELECT * FROM bloque_contenido WHERE id_contenido=1 ORDER BY orden;
-- Fotografías de un carrusel:
-- SELECT i.*,a.url FROM bloque_imagen i JOIN archivo a USING(id_archivo) WHERE id_bloque_contenido=1 ORDER BY i.orden;
-- Recursos por categoría:
-- SELECT * FROM vista_recurso_publicado WHERE tipo='informes' ORDER BY anio DESC;
-- Publicar un mock para pruebas locales (NO en producción):
-- UPDATE contenido SET estado='publicado',fecha_publicacion=NOW() WHERE id_contenido=(SELECT id_contenido FROM paisaje WHERE slug='beni');
-- IMPORTANTE: la API debe usar consultas parametrizadas, validar permisos por operación,
-- sanear HTML antes de persistir/renderizar, validar URLs y proteger datos personales.
-- Las solicitudes deben copiar precio/moneda/periodicidad desde el plan en el servidor.
-- Los roles de esta aplicación NO son roles SQL ni sustituyen GRANT/restricciones de acceso.
