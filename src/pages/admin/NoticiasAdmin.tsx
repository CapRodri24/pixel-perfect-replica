import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Eye, ImagePlus, Loader2, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import {
  actualizarNoticia,
  crearNoticia,
  eliminarNoticia,
  listarNoticias,
  obtenerNoticia,
  listarCategoriasNoticias,
  type CategoriaNoticia,
  type NoticiaEntrada,
  type NoticiaResumen,
} from "@/api/noticiasApi";
import { listarProgramas, type ProgramaResumen } from "@/api/programasApi";
import { type BloquePaisaje, type ImagenPaisaje, type TipoBloquePaisaje } from "@/api/paisajesApi";
import { AdminHeading, Notice, Empty, Gallery, Video, field, primary, secondary, panel } from "./ui";
import { sanitize, plain } from "./datos";
import { withTranslator } from "./traduccion";
import { Selector } from "./Selector";

type Borrador = NoticiaEntrada & { id_noticia?: string };
type ErrorCampo = { mensaje: string; destino: string };
type BloqueLocal = BloquePaisaje & { localId: string };
type BorradorLocal = Omit<Borrador, "bloques"> & { bloques: BloqueLocal[] };

const tipos: { tipo: TipoBloquePaisaje; nombre: string }[] = [
  { tipo: "parrafo", nombre: "Párrafo" },
  { tipo: "subtitulo", nombre: "Subtítulo" },
  { tipo: "imagen", nombre: "Imagen" },
  { tipo: "carrusel", nombre: "Carrusel" },
  { tipo: "enlace", nombre: "Enlace de YouTube" },
];

// Fecha local de hoy en formato YYYY-MM-DD (valor por defecto de la noticia).
const hoy = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const vacio = (): BorradorLocal => ({ titulo_es: "", titulo_en: "", fecha_publicacion: hoy(), autor: "", id_programa: "", id_categoria_noticia: "", bloques: [] });
let numeroLocal = 0;
const idLocal = () => `bloque-${++numeroLocal}`;
const crearBloque = (tipo: TipoBloquePaisaje): BloqueLocal => ({
  localId: idLocal(), tipo, texto_es: "", texto_en: "", pie_es: "", pie_en: "", url: "",
  ...(tipo === "carrusel" ? { imagenes: [] } : {}),
});

function errorTexto(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

function textoImagen(img: ImagenPaisaje | undefined) {
  return img?.archivo || "";
}

function ImagenEditor({ imagen, idioma, onChange, onRemove }: {
  imagen: ImagenPaisaje | undefined;
  idioma: "es" | "en";
  onChange: (value: ImagenPaisaje) => void;
  onRemove: () => void;
}) {
  const [error, setError] = useState("");
  async function cargar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Utiliza JPG, PNG, WEBP o GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Cada archivo debe pesar como máximo 5 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onerror = () => setError("No se pudo leer la imagen.");
    reader.onload = () => {
      if (typeof reader.result === "string") onChange({
        archivo: reader.result, nombre_archivo: file.name, credito: "",
      });
    };
    reader.readAsDataURL(file);
  }
  function cambiar(campo: keyof ImagenPaisaje, valor: string) {
    if (!imagen) return;
    onChange({ ...imagen, [campo]: valor });
  }
  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-3">
      {imagen && textoImagen(imagen) && (
        <img src={textoImagen(imagen)} alt="Vista previa" className="max-h-52 w-full rounded-xl object-contain" />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${secondary} cursor-pointer`}>
          <ImagePlus className="size-4" /> {imagen ? "Reemplazar fotografía" : "Subir fotografía"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={cargar} className="sr-only" data-field-id="cargar-imagen" />
        </label>
        {imagen && <button type="button" className={`${secondary} text-red-700`} onClick={onRemove}>Quitar imagen</button>}
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {imagen && <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">Crédito fotográfico
          <input className={field} value={imagen.credito || ""} onChange={(e) => cambiar("credito", e.target.value)} />
        </label>
      </div>}
    </div>
  );
}

function TextoEnriquecido({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = sanitize(value);
  }, [value]);
  function commit() { if (ref.current) onChange(sanitize(ref.current.innerHTML)); }
  const commands = [["B", "bold", "Negrita"], ["I", "italic", "Cursiva"], ["U", "underline", "Subrayado"], ["S", "strikeThrough", "Tachado"], ["←", "justifyLeft", "Izquierda"], ["↔", "justifyCenter", "Centrar"], ["→", "justifyRight", "Derecha"], ["↺", "removeFormat", "Quitar formato"]] as const;
  return <div className="overflow-hidden rounded-xl border border-border bg-background">
    <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-1.5">{commands.map(([title, command, labelText]) =>
      <button key={command} type="button" title={labelText} aria-label={labelText} className="rounded px-2 py-1 text-xs font-bold hover:bg-muted" onMouseDown={(e) => e.preventDefault()} onClick={() => { ref.current?.focus(); document.execCommand(command, false); commit(); }}>{title}</button>
    )}</div>
    <div ref={ref} role="textbox" aria-label={label} aria-multiline="true" contentEditable suppressContentEditableWarning onInput={commit} onBlur={commit} onPaste={(e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); commit(); }} className="min-h-24 whitespace-pre-wrap p-3 text-sm text-black outline-none" />
  </div>;
}

function VistaPrevia({ borrador, idioma }: { borrador: BorradorLocal; idioma: "es" | "en" }) {
  return (
    <div className="space-y-5 break-words">
      <h2 className="font-display text-3xl text-brand-deep">{idioma === "es" ? borrador.titulo_es : borrador.titulo_en || "Título"}</h2>
      {borrador.bloques.map((b) => {
        const texto = idioma === "es" ? b.texto_es : b.texto_en;
        const pie = idioma === "es" ? b.pie_es : b.pie_en;
        if (b.tipo === "subtitulo") return <h3 key={b.localId} className="font-display text-xl text-brand-deep">{texto}</h3>;
        if (b.tipo === "parrafo") return <div key={b.localId} className="whitespace-pre-wrap leading-relaxed text-black" dangerouslySetInnerHTML={{ __html: sanitize(texto || "") }} />;
        if (b.tipo === "imagen") return <figure key={b.localId}>{textoImagen(b.imagen) && <img src={textoImagen(b.imagen)} alt="" className="w-full rounded-xl" />}{pie && <figcaption className="mt-2 text-xs text-muted-foreground">{pie}</figcaption>}</figure>;
        if (b.tipo === "carrusel") return <figure key={b.localId}><Gallery images={(b.imagenes || []).map((foto) => textoImagen(foto)).filter(Boolean)} />{pie && <figcaption className="mt-2 text-xs text-muted-foreground">{pie}</figcaption>}</figure>;
        if (b.tipo === "enlace") return <a key={b.localId} className="break-all text-primary underline" href={b.url || "#"} target="_blank" rel="noreferrer">{b.url}</a>;
        return <div key={b.localId}><Video url={b.url || ""} /></div>;
      })}
      {borrador.autor.trim() && <p className="border-t border-border pt-4 text-sm italic text-muted-foreground">{idioma === "es" ? "Texto escrito por:" : "Written by:"} <span className="font-semibold not-italic text-brand-deep">{borrador.autor.trim()}</span></p>}
    </div>
  );
}

export default function NoticiasAdmin() {
  const [items, setItems] = useState<NoticiaResumen[]>([]);
  const [programas, setProgramas] = useState<ProgramaResumen[]>([]);
  const [categorias, setCategorias] = useState<CategoriaNoticia[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [borrador, setBorrador] = useState<BorradorLocal | null>(null);
  const [idioma, setIdioma] = useState<"es" | "en">("es");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fotoError, setFotoError] = useState("");

  async function cargar() {
    setLoading(true);
    try { const [noticias, opciones, cats] = await Promise.all([listarNoticias(), listarProgramas(), listarCategoriasNoticias()]); setItems(noticias); setProgramas(opciones); setCategorias(cats); setError(""); }
    catch (e) { setError(errorTexto(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void cargar(); }, []);

  function patch(next: Partial<BorradorLocal>) {
    setBorrador((old) => old ? { ...old, ...next } : null);
  }
  function patchBloque(id: string, next: Partial<BloqueLocal>) {
    setBorrador((old) => old ? { ...old, bloques: old.bloques.map((b) => b.localId === id ? { ...b, ...next } : b) } : null);
  }
  function mover(id: string, incremento: number) {
    setBorrador((old) => {
      if (!old) return old;
      const i = old.bloques.findIndex((b) => b.localId === id);
      const j = i + incremento;
      if (j < 0 || j >= old.bloques.length) return old;
      const bloques = [...old.bloques];
      const primero = bloques[i];
      const segundo = bloques[j];
      if (!primero || !segundo) return old;
      bloques[i] = segundo;
      bloques[j] = primero;
      return { ...old, bloques };
    });
  }
  async function editar(id: string) {
    setBusy(true); setError(""); setSuccess("");
    try {
      const data = await obtenerNoticia(id);
      setBorrador({ ...data, fecha_publicacion: (data.fecha_publicacion || hoy()).slice(0, 10), autor: data.autor || "", bloques: data.bloques.map((b) => ({ ...b, localId: idLocal() })) });
      setIdioma("es");
    } catch (e) { setError(errorTexto(e)); }
    finally { setBusy(false); }
  }
  function nuevo() {
    setBorrador({ ...vacio(), id_programa: filtroPrograma === "independiente" ? "" : filtroPrograma, id_categoria_noticia: filtroCategoria }); setIdioma("es"); setError(""); setSuccess("");
  }
  function irAError(destino: string) {
    window.requestAnimationFrame(() => {
      const elemento = document.querySelector<HTMLElement>(`[data-field-id="${destino}"]`);
      elemento?.scrollIntoView({ behavior: "smooth", block: "center" });
      elemento?.focus({ preventScroll: true });
    });
  }
  function validar(b: BorradorLocal): ErrorCampo | null {
    if (!categorias.some(c => c.id_categoria_noticia === b.id_categoria_noticia)) return { mensaje: "Selecciona una categoría.", destino: "categoria-noticia" };
    if (b.id_programa && !programas.some(p => p.id_programa === b.id_programa)) return { mensaje: "Selecciona un programa válido.", destino: "programa-asociado" };
    if (!b.titulo_es.trim()) return { mensaje: "Debes completar el título en español.", destino: "titulo-es" };
    for (const bloque of b.bloques) {
      if (["parrafo", "subtitulo"].includes(bloque.tipo) && !plain(bloque.texto_es || ""))
        return { mensaje: "Completa el contenido en español.", destino: `bloque-${bloque.localId}` };
      if (bloque.tipo === "imagen" && !bloque.imagen?.archivo && !bloque.imagen?.id_imagen)
        return { mensaje: "Debes adjuntar la fotografía del bloque imagen.", destino: `bloque-${bloque.localId}` };
      if (bloque.tipo === "carrusel" && ((bloque.imagenes?.length || 0) < 2 || bloque.imagenes?.some((imagen) => !imagen.id_imagen && !imagen.archivo)))
        return { mensaje: "Cada carrusel necesita al menos dos fotografías cargadas.", destino: `bloque-${bloque.localId}` };
      if (["enlace", "video"].includes(bloque.tipo)) {
        if (!bloque.url?.trim()) return { mensaje: "Completa la URL del enlace o video.", destino: `url-${bloque.localId}` };
        try {
          const url = new URL(bloque.url);
          if (!["https:", "http:"].includes(url.protocol)) throw new Error("Protocolo inválido");
        } catch {
          return { mensaje: "Introduce una URL válida que comience con https:// o http://.", destino: `url-${bloque.localId}` };
        }
      }
    }
    return null;
  }
  async function leerFoto(file: File): Promise<ImagenPaisaje> {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) throw new Error("Utiliza JPG, PNG, WEBP o GIF.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Cada archivo debe pesar como máximo 5 MB.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("No se pudo leer la fotografía."));
      reader.onload = () => typeof reader.result === "string"
        ? resolve({ archivo: reader.result, nombre_archivo: file.name, credito: "" })
        : reject(new Error("No se pudo leer la fotografía."));
      reader.readAsDataURL(file);
    });
  }
  async function agregarFotografias(id: string, files: FileList | null) {
    if (!files?.length) return;
    setFotoError("");
    const bloque = borrador?.bloques.find((b) => b.localId === id);
    if (!bloque) return;
    if ((bloque.imagenes?.length || 0) + files.length > 30) {
      setFotoError("El carrusel admite un máximo de 30 fotografías.");
      irAError(`bloque-${id}`);
      return;
    }
    try {
      const imagenes = await Promise.all(Array.from(files).map(leerFoto));
      setBorrador((old) => old ? {
        ...old,
        bloques: old.bloques.map((b) => b.localId === id ? { ...b, imagenes: [...(b.imagenes || []), ...imagenes] } : b),
      } : null);
    } catch (e) {
      setFotoError(errorTexto(e));
      irAError(`bloque-${id}`);
    }
  }
  function esVideoYouTube(url: string) {
    try {
      const dominio = new URL(url).hostname.toLowerCase();
      return dominio === "youtu.be" || dominio === "youtube.com" || dominio.endsWith(".youtube.com") || dominio === "youtube-nocookie.com" || dominio.endsWith(".youtube-nocookie.com");
    } catch { return false; }
  }
  async function traducirCamposPendientes(origen: BorradorLocal): Promise<BorradorLocal> {
    const traducido: BorradorLocal = {
      ...origen,
      bloques: origen.bloques.map((bloque) => ({
        ...bloque,
        ...(bloque.imagen ? { imagen: { ...bloque.imagen } } : {}),
        ...(bloque.imagenes ? { imagenes: bloque.imagenes.map((imagen) => ({ ...imagen })) } : {}),
      })),
    };
    const faltaIngles = (traducido.titulo_es.trim() && !traducido.titulo_en.trim()) ||
      traducido.bloques.some((bloque) =>
        (["parrafo", "subtitulo"].includes(bloque.tipo) && plain(bloque.texto_es || "") && !plain(bloque.texto_en || "")) ||
        (bloque.pie_es?.trim() && !bloque.pie_en?.trim())
      );
    if (!faltaIngles) return traducido;

    await withTranslator(async (traducir) => {
      if (traducido.titulo_es.trim() && !traducido.titulo_en.trim()) {
        traducido.titulo_en = await traducir(traducido.titulo_es);
      }
      for (const bloque of traducido.bloques) {
        if (["parrafo", "subtitulo"].includes(bloque.tipo) &&
            plain(bloque.texto_es || "") && !plain(bloque.texto_en || "")) {
          bloque.texto_en = await traducir(bloque.texto_es || "", bloque.tipo === "parrafo");
        }
        if (bloque.pie_es?.trim() && !bloque.pie_en?.trim()) {
          bloque.pie_en = await traducir(bloque.pie_es);
        }
      }
    });
    return traducido;
  }

  async function cambiarIdioma(siguiente: "es" | "en") {
    if (busy || !borrador || idioma === siguiente) return;
    if (siguiente === "es") { setIdioma("es"); return; }
    setBusy(true);
    setError("");
    try {
      const traducido = await traducirCamposPendientes(borrador);
      setBorrador(traducido);
      setIdioma("en");
    } catch (e) {
      // Si el navegador no ofrece traducción, se muestra la vista previa en inglés con lo que haya.
      setIdioma("en");
      setError(`No se pudo completar la traducción automática: ${errorTexto(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!borrador || busy) return;
    const errorValidacion = validar(borrador);
    if (errorValidacion) { setError(errorValidacion.mensaje); irAError(errorValidacion.destino); return; }
    setBusy(true); setError(""); setSuccess("");
    try {
      const traducido = await traducirCamposPendientes(borrador);
      if (!traducido.titulo_en.trim()) throw new Error("No se pudo traducir el título al inglés. Inténtalo de nuevo.");
      const bloqueIncompleto = traducido.bloques.find((bloque) =>
        ["parrafo", "subtitulo"].includes(bloque.tipo) && !plain(bloque.texto_en || "")
      );
      if (bloqueIncompleto) {
        setIdioma("en");
        irAError(`bloque-${bloqueIncompleto.localId}`);
        throw new Error("No se pudo traducir uno de los bloques al inglés. Inténtalo de nuevo.");
      }
      const { id_noticia, id_programa, id_categoria_noticia, titulo_es, titulo_en, fecha_publicacion, autor, bloques } = traducido;
      const datos: NoticiaEntrada = { titulo_es, titulo_en, fecha_publicacion, autor: autor.trim(), id_programa, id_categoria_noticia, bloques: bloques.map(({ localId, ...bloque }) => bloque) };
      if (id_noticia) await actualizarNoticia(id_noticia, datos);
      else await crearNoticia(datos);
      setBorrador(null);
      await cargar();
      setSuccess(id_noticia ? "" : "Noticia creada correctamente.");
    } catch (e) { setError(errorTexto(e)); }
    finally { setBusy(false); }
  }
  async function borrar(item: NoticiaResumen) {
    if (!window.confirm(`¿Eliminar «${item.titulo_es}»? Esta acción no se puede deshacer.`)) return;
    setBusy(true); setError(""); setSuccess("");
    try { await eliminarNoticia(item.id_noticia); await cargar(); setSuccess("Noticia eliminada correctamente."); }
    catch (e) { setError(errorTexto(e)); }
    finally { setBusy(false); }
  }

  const filtrados = items.filter((item) => (!filtroPrograma || (filtroPrograma === "independiente" ? !item.id_programa : item.id_programa === filtroPrograma)) && (!filtroCategoria || item.id_categoria_noticia === filtroCategoria) && `${item.titulo_es} ${item.titulo_en} ${item.programa_titulo_es} ${item.categoria_titulo_es}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminHeading title="Noticias" description="Gestiona noticias, categorías y asociaciones opcionales con programas." count={items.length} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
        <h2 className="font-display text-xl text-brand-deep">Todas las noticias</h2>
        {!borrador && <button type="button" className={primary} onClick={nuevo} disabled={busy || loading || !categorias.length}><Plus className="size-5" />Añadir noticia</button>}
      </div>
      <Notice error={error} success={success} />
      {!loading && !borrador && !categorias.length && !error && <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground">No hay categorías disponibles. Comprueba la configuración de la base de datos.</p>}
      {!borrador && error && <button type="button" className={secondary} disabled={loading || busy} onClick={() => { void cargar(); }}>Reintentar</button>}
      {borrador ? (
        <div className="grid items-start gap-5 xl:grid-cols-2">
          <form className={`${panel} space-y-5`} onSubmit={guardar}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl text-brand-deep">{borrador.id_noticia ? "Editar noticia" : "Nueva noticia"}</h2>
              <button type="button" className={secondary} onClick={() => { setBorrador(null); setError(""); }} disabled={busy}><X className="size-4" />Cerrar</button>
            </div>
            <fieldset disabled={busy} className="space-y-5">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <Selector label="Categoría de la noticia" required fieldId="categoria-noticia" placeholder="Selecciona una categoría" value={borrador.id_categoria_noticia} onChange={(id_categoria_noticia) => patch({ id_categoria_noticia })}
                  options={categorias.map((c) => ({ id: c.id_categoria_noticia, label: c.nombre_es }))} />
                <Selector label="¿La noticia está vinculada a un programa?" className="mt-4" fieldId="programa-asociado" value={borrador.id_programa} onChange={(id_programa) => patch({ id_programa })}
                  options={[{ id: "", label: "Publicación independiente (sin programa)" }, ...programas.map((p) => ({ id: p.id_programa, label: p.titulo_es, hint: p.paisaje_titulo_es, color: p.color }))]} />
                <p className="mt-2 text-xs text-muted-foreground">La asociación es opcional. Las noticias independientes también aparecen en Noticias.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold">Título
                  <input required data-field-id="titulo-es" className={field} value={borrador.titulo_es} onChange={(e) => patch({ titulo_es: e.target.value, titulo_en: "" })} />
                </label>
                <label className="text-sm font-semibold">Fecha de la noticia
                  <input type="date" required data-field-id="fecha" className={field} value={borrador.fecha_publicacion} onChange={(e) => patch({ fecha_publicacion: e.target.value })} />
                </label>
              </div>

              <p className="text-xs text-muted-foreground">Escribe todo en español. El inglés se traduce automáticamente al guardar; puedes revisarlo con el botón English de la vista previa.</p>
              {borrador.bloques.map((b, i) => (
                <div key={b.localId} data-field-id={`bloque-${b.localId}`} tabIndex={-1} className="space-y-3 rounded-xl border border-border bg-muted/20 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-primary">{i + 1}. {tipos.find((t) => t.tipo === (b.tipo === "video" ? "enlace" : b.tipo))?.nombre}</span>
                    <div className="flex gap-1">
                      <button type="button" className={secondary} disabled={i === 0} title="Mover arriba" onClick={() => mover(b.localId, -1)}><ArrowUp className="size-4" /></button>
                      <button type="button" className={secondary} disabled={i === borrador.bloques.length - 1} title="Mover abajo" onClick={() => mover(b.localId, 1)}><ArrowDown className="size-4" /></button>
                      <button type="button" className={`${secondary} text-red-700`} title="Quitar bloque" onClick={() => patch({ bloques: borrador.bloques.filter((x) => x.localId !== b.localId) })}><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                  {b.tipo === "subtitulo" && (
                    <label className="block text-sm font-medium">Contenido
                      <input className={field} value={b.texto_es || ""} onChange={(e) => patchBloque(b.localId, { texto_es: e.target.value, texto_en: "" })} />
                    </label>
                  )}
                  {/* El editor de párrafo NO puede ir dentro de un <label>: el navegador reenvía cada clic al primer botón (Negrita). */}
                  {b.tipo === "parrafo" && (
                    <div className="block text-sm font-medium">Contenido
                      <TextoEnriquecido label="Párrafo" value={b.texto_es || ""} onChange={(value) => { if (value !== (b.texto_es || "")) patchBloque(b.localId, { texto_es: value, texto_en: "" }); }} />
                    </div>
                  )}
                  {(b.tipo === "imagen") && <ImagenEditor idioma="es" imagen={b.imagen} onChange={(imagen) => patchBloque(b.localId, { imagen })} onRemove={() => setBorrador((old) => old ? { ...old, bloques: old.bloques.map((bloque) => { if (bloque.localId !== b.localId) return bloque; const { imagen: _imagen, ...resto } = bloque; return resto; }) } : null)} />}
                  {b.tipo === "carrusel" && <div className="space-y-3">
                    {(b.imagenes || []).map((imagen, n) => <div key={`${b.localId}-${n}`}>
                      <p className="mb-2 text-xs font-semibold">Fotografía {n + 1}</p>
                      <ImagenEditor idioma="es" imagen={imagen} onChange={(value) => patchBloque(b.localId, { imagenes: (b.imagenes || []).map((old, j) => j === n ? value : old) })} onRemove={() => patchBloque(b.localId, { imagenes: (b.imagenes || []).filter((_, j) => j !== n) })} />
                    </div>)}
                    <label className={`${secondary} inline-flex cursor-pointer items-center`}>
                      <ImagePlus className="size-4" />Añadir fotografías
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => { void agregarFotografias(b.localId, e.target.files); e.target.value = ""; }} />
                    </label>
                    {fotoError && <p role="alert" className="text-sm text-red-700">{fotoError}</p>}
                    <p className="text-xs text-muted-foreground">Mínimo 2 fotografías, máximo 30. Al seleccionar las imágenes se cargan directamente.</p>
                  </div>}
                  {(b.tipo === "enlace" || b.tipo === "video") && <label className="block text-sm font-medium">Enlace de YouTube
                    <input type="url" data-field-id={`url-${b.localId}`} className={field} value={b.url || ""} onChange={(e) => patchBloque(b.localId, { url: e.target.value, tipo: esVideoYouTube(e.target.value) ? "video" : "enlace" })} placeholder="https://" />
                    <span className="mt-1 block text-xs text-muted-foreground">Los enlaces de YouTube se muestran automáticamente como video.</span>
                  </label>}
                  {(["imagen", "carrusel"].includes(b.tipo)) && <label className="block text-sm font-medium">Pie de fotografía
                    <input className={field} value={b.pie_es || ""} onChange={(e) => patchBloque(b.localId, { pie_es: e.target.value, pie_en: "" })} />
                  </label>}
                </div>
              ))}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {tipos.map((tipo) => <button key={tipo.tipo} type="button" className={secondary} onClick={() => patch({ bloques: [...borrador.bloques, crearBloque(tipo.tipo)] })}><Plus className="size-4" />{tipo.nombre}</button>)}
              </div>
              <label className="block rounded-xl border border-border bg-muted/20 p-4 text-sm font-semibold">Texto escrito por:
                <input data-field-id="autor" maxLength={200} className={field} value={borrador.autor} onChange={(e) => patch({ autor: e.target.value })} placeholder="Nombre de quien escribió la noticia" />
                <span className="mt-1 block text-xs font-normal text-muted-foreground">Opcional. Se muestra al final de la noticia.</span>
              </label>
              <button type="submit" className={`${primary} w-full`} disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{busy ? "Guardando…" : "Guardar noticia"}</button>
            </fieldset>
          </form>
          <div className={`${panel} xl:sticky xl:top-20`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase text-primary"><Eye className="size-4" />Vista previa · {idioma.toUpperCase()}</span>
              <div className="flex gap-1 rounded-lg bg-muted/40 p-1">
                {(["es", "en"] as const).map((value) => <button key={value} type="button" className={`rounded-md px-3 py-1 text-xs font-semibold ${idioma === value ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`} onClick={() => { void cambiarIdioma(value); }} disabled={busy}>{value === "es" ? "Español" : "English"}</button>)}
              </div>
            </div>
            <VistaPrevia borrador={borrador} idioma={idioma} />
          </div>
        </div>
      ) : <>
        <div className="grid gap-3 sm:grid-cols-2">
          <Selector label="Filtrar por categoría" value={filtroCategoria} onChange={setFiltroCategoria}
            options={[{ id: "", label: "Todas las categorías", count: items.length }, ...categorias.map((c) => ({ id: c.id_categoria_noticia, label: c.nombre_es, count: items.filter((i) => i.id_categoria_noticia === c.id_categoria_noticia).length }))]} />
          <Selector label="Filtrar por programa" value={filtroPrograma} onChange={setFiltroPrograma}
            options={[{ id: "", label: "Todos los programas", count: items.length }, { id: "independiente", label: "Publicaciones independientes", count: items.filter((i) => !i.id_programa).length }, ...programas.map((p) => ({ id: p.id_programa, label: p.titulo_es, hint: p.paisaje_titulo_es, color: p.color, count: items.filter((i) => i.id_programa === p.id_programa).length }))]} />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3"><Search className="size-4 text-muted-foreground" />
          <input className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Buscar noticias" placeholder="Buscar por título…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="text-xs text-muted-foreground">{filtrados.length}</span>
        </div>
        {loading ? <p className="text-sm text-muted-foreground">Cargando noticias…</p> : filtrados.length === 0 ? <Empty text="No hay noticias para mostrar." /> :
          <div className="grid gap-4 lg:grid-cols-2">{filtrados.map((item) => <article key={item.id_noticia} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-start gap-3"><span className="mt-1 size-4 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <div><h3 className="font-display text-xl text-brand-deep">{item.titulo_es}</h3><p className="text-sm text-muted-foreground">{item.titulo_en}</p><p className="mt-2 text-xs font-semibold text-primary">{item.categoria_titulo_es} · {item.programa_titulo_es || "Publicación independiente"}</p><p className="mt-2 text-xs text-muted-foreground">{item.cantidad_bloques} bloques · {item.fecha_publicacion.replace("T", " ")}</p></div>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-border pt-3">
              <button type="button" className={secondary} disabled={busy} onClick={() => { void editar(item.id_noticia); }}><Pencil className="size-4" />Editar</button>
              <button type="button" className={`${secondary} text-red-700`} disabled={busy} onClick={() => { void borrar(item); }}><Trash2 className="size-4" />Eliminar</button>
            </div>
          </article>)}</div>}
      </>}
    </div>
  );
}
