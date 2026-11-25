import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ImageOff, RefreshCw, Search, X, LayoutGrid, Mountain } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { sanitize } from "@/pages/admin/datos";
import {
  imagenPaisajeUrl, listarPaisajesPublicos, obtenerPaisajePublico,
  type FotoPublica, type PaisajePublicoResumen, type PaisajePublicoDetalle,
  type BloquePublico, type ProgramaAsociado,
} from "@/api/paisajesPublicosApi";

function Mensaje({ mensaje, onRetry }: { mensaje: string; onRetry?: (() => void) | undefined }) {
  const { lang } = useI18n();
  return <div role="status" className="mx-auto max-w-xl rounded-3xl border border-border bg-muted/40 p-8 text-center">
    <p className="leading-relaxed text-muted-foreground">{mensaje}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><RefreshCw className="size-4" />{lang === "es" ? "Volver a intentar" : "Try again"}</button>}
  </div>;
}

function Imagen({ id, alt, className }: { id: string | null | undefined; alt: string; className: string }) {
  const [fallo, setFallo] = useState(false);
  const url = imagenPaisajeUrl(id);
  useEffect(() => { setFallo(false); }, [url]);
  if (!url || fallo) return <div aria-label={alt} role="img" className={`${className} grid place-items-center bg-muted text-muted-foreground`}><ImageOff className="size-10 opacity-40" aria-hidden="true" /></div>;
  return <img src={url} alt={alt} loading="lazy" decoding="async" className={className} onError={() => setFallo(true)} />;
}

function Youtube({ url, titulo }: { url: string; titulo: string }) {
  let id: string | null = null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be" || parsed.hostname === "www.youtu.be") id = parsed.pathname.split("/")[1] || null;
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com", "youtube-nocookie.com"].includes(parsed.hostname)) {
      id = parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] || null;
    }
  } catch { /* URL no válida: no mostrar reproductor */ }
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return null;
  return <div className="aspect-video overflow-hidden rounded-2xl bg-muted"><iframe className="size-full border-0" src={`https://www.youtube-nocookie.com/embed/${id}`} title={titulo} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>;
}

function Galeria({ fotos, pie }: { fotos: FotoPublica[]; pie: string }) {
  const { lang } = useI18n();
  const [indice, setIndice] = useState(0);
  useEffect(() => { setIndice(0); }, [fotos]);
  if (fotos.length === 0) return null;
  const actual = fotos[indice % fotos.length];
  if (!actual) return null;
  const credit = actual.credito || "";
  const descripcion = (lang === "es" ? actual.pie_es : actual.pie_en) || "";
  const alt = descripcion || pie;
  return <figure className="space-y-3">
    <div className="relative overflow-hidden rounded-2xl">
      <Imagen id={actual.id_imagen} alt={alt} className="aspect-[4/3] w-full object-contain bg-muted sm:aspect-video" />
      {fotos.length > 1 && <>
        <button type="button" onClick={() => setIndice(v => (v + fotos.length - 1) % fotos.length)} aria-label={lang === "es" ? "Imagen anterior" : "Previous image"} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"><ChevronLeft className="size-5" /></button>
        <button type="button" onClick={() => setIndice(v => (v + 1) % fotos.length)} aria-label={lang === "es" ? "Imagen siguiente" : "Next image"} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white"><ChevronRight className="size-5" /></button>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{indice + 1} / {fotos.length}</span>
      </>}
    </div>
    {(descripcion || credit || pie) && <figcaption className="text-center text-sm text-muted-foreground">{descripcion || pie}{descripcion || pie ? credit ? " · " : "" : ""}{credit}</figcaption>}
  </figure>;
}

function RenderBloque({ bloque }: { bloque: BloquePublico }) {
  const { lang } = useI18n();
  const text = (lang === "es" ? bloque.texto_es : bloque.texto_en) || "";
  const pie = (lang === "es" ? bloque.pie_es : bloque.pie_en) || "";
  if (bloque.tipo === "parrafo") return <div className="whitespace-pre-wrap break-words text-base leading-[1.8] text-black sm:text-lg" dangerouslySetInnerHTML={{ __html: sanitize(text) }} />;
  if (bloque.tipo === "subtitulo") return <h2 className="pt-3 font-display text-2xl font-semibold leading-tight text-brand-deep sm:text-3xl">{text.replace(/<[^>]*>/g, "")}</h2>;
  if (bloque.tipo === "imagen") {
    const credito = bloque.imagen?.credito || "";
    return <figure><Imagen id={bloque.id_imagen} alt={pie} className="max-h-[650px] w-full rounded-2xl bg-muted object-contain" />{(pie || credito) && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{pie}{pie && credito ? " · " : ""}{credito}</figcaption>}</figure>;
  }
  if (bloque.tipo === "carrusel") return <Galeria fotos={bloque.imagenes || []} pie={pie} />;
  if (bloque.tipo === "video" || bloque.tipo === "enlace") return bloque.url ? <Youtube url={bloque.url} titulo="YouTube" /> : null;
  return null;
}

// Los filtros y las tarjetas se generan únicamente desde PostgreSQL.
function textoPlano(valor: string | null | undefined): string {
  if (!valor) return "";
  return new DOMParser().parseFromString(valor, "text/html").body.textContent?.trim() || "";
}

function normalizar(valor: string): string {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

export function ListadoPaisajesPublicos() {
  const { lang } = useI18n();
  const es = lang === "es";
  const [items, setItems] = useState<PaisajePublicoResumen[]>([]);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");
  const [intento, setIntento] = useState(0);
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState("all");
  useEffect(() => {
    const controller = new AbortController();
    setEstado("cargando");
    listarPaisajesPublicos(controller.signal).then(data => {
      if (!controller.signal.aborted) {
        setItems(data);
        setFiltro(actual => actual === "all" || data.some(p => p.id_paisaje === actual) ? actual : "all");
        setEstado("listo");
      }
    }).catch(() => { if (!controller.signal.aborted) setEstado("error"); });
    return () => controller.abort();
  }, [intento]);
  const nombre = (p: PaisajePublicoResumen) => es ? p.titulo_es : p.titulo_en;
  const descripcion = (p: PaisajePublicoResumen) => textoPlano(es ? p.descripcion_es : p.descripcion_en);
  const visible = items.filter(p => (filtro === "all" || filtro === p.id_paisaje) && normalizar(`${nombre(p)} ${descripcion(p)}`).includes(normalizar(query)));
  const limpiar = () => { setQuery(""); setFiltro("all"); };
  return <section className="section scroll-mt-24 overflow-hidden bg-muted/40" id="paisajes"><div className="container-site">
    <SectionHeading
      eyebrow={es ? "Paisajes" : "Landscapes"}
      title={es ? "Diferentes paisajes, una misma misión" : "Different landscapes, one mission"}
      text={es
        ? "Nuestro trabajo se organiza en los grandes paisajes de Bolivia. Cada uno tiene especies, desafíos y comunidades propias."
        : "Our work is organized around Bolivia’s major landscapes. Each has its own species, challenges and communities."}
    />
    <form onSubmit={e => e.preventDefault()} role="search" className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} aria-label={es ? "Buscar paisajes" : "Search landscapes"} placeholder={es ? "Buscar paisajes…" : "Search landscapes…"} className="min-h-10 w-full min-w-0 rounded-full border border-input bg-background py-2 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label={es ? "Limpiar búsqueda" : "Clear search"} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}
      </div>
      <Button type="submit" className="min-h-9 rounded-full sm:shrink-0">{es ? "Buscar" : "Search"}</Button>
    </form>
    <div role="group" aria-label={es ? "Filtrar paisajes" : "Filter landscapes"} className="mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
      {[{ id: "all", label: es ? "Todo" : "All" }, ...items.map(p => ({ id: p.id_paisaje, label: nombre(p) }))].map(opcion => {
        const Icon = opcion.id === "all" ? LayoutGrid : Mountain;
        return <button key={opcion.id} type="button" aria-pressed={filtro === opcion.id} onClick={() => setFiltro(opcion.id)} className={`armonia-subindice flex min-h-14 shrink-0 snap-start items-center gap-2 rounded-2xl border px-3 py-2 text-left text-sm font-semibold leading-tight text-primary transition-colors sm:min-w-0 ${filtro === opcion.id ? "border-primary/60 bg-primary/5" : "border-border bg-background hover:border-primary/60 hover:bg-primary/5"}`}><Icon className="size-4 shrink-0" aria-hidden="true" /><span className="sm:break-words">{opcion.label}</span></button>;
      })}
    </div>
    {estado === "cargando" && <p role="status" className="mt-10 text-muted-foreground">{es ? "Cargando paisajes…" : "Loading landscapes…"}</p>}
    {estado === "error" && <div className="mt-10"><Mensaje mensaje={es ? "No pudimos cargar los paisajes. Comprueba tu conexión e inténtalo nuevamente." : "We couldn't load the landscapes. Check your connection and try again."} onRetry={() => setIntento(x => x + 1)} /></div>}
    {estado === "listo" && items.length === 0 && <div className="mt-10"><Mensaje mensaje={es ? "Todavía no hay paisajes publicados para mostrar." : "There are no landscapes available to display yet."} /></div>}
    {estado === "listo" && items.length > 0 && visible.length === 0 && <div className="mt-6 rounded-2xl bg-muted p-8 text-center text-muted-foreground"><p>{es ? "No se encontraron paisajes." : "No landscapes found."}</p><Button variant="outline" className="mt-4" onClick={limpiar}>{es ? "Limpiar filtros" : "Clear filters"}</Button></div>}
    {estado === "listo" && visible.length > 0 && <>
      <div aria-label={es ? "Listado de paisajes" : "Landscape list"} className="mt-6 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:auto-rows-[265px] lg:grid-cols-3">
        {visible.map((item, index) => {
          const color = /^#[0-9a-f]{6}$/i.test(item.color) ? item.color : "#2381C4";
          const destacado = index === 0 && visible.length >= 3;
          const unico = visible.length === 1;
          return <Link key={item.id_paisaje} to={`/paisajes?paisaje=${encodeURIComponent(item.id_paisaje)}`} style={{ borderTopColor: color }} className={`group relative isolate flex min-h-[300px] w-[86%] max-w-[380px] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl border-t-4 bg-brand-deep text-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:max-w-none lg:min-h-0 ${destacado ? "sm:col-span-2 lg:row-span-2" : unico ? "sm:col-span-2 lg:col-span-3 lg:row-span-2" : ""}`}>
            <Imagen id={item.id_imagen_portada} alt={nombre(item)} className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#071c2b]/95 via-[#071c2b]/35 to-transparent" />
            <div className="p-5 sm:p-6">
              <span aria-hidden="true" className="mb-2 block size-2.5 rounded-full" style={{ backgroundColor: color }} />
              <h2 className="font-display text-2xl font-bold leading-tight text-white">{nombre(item)}</h2>
              {descripcion(item) && <p className="mt-2 max-w-md line-clamp-2 text-sm leading-relaxed text-white/95">{descripcion(item)}</p>}
              <span style={{ backgroundColor: color }} className="mt-4 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity group-hover:opacity-90">{es ? "Explorar paisaje" : "Explore landscape"}<ArrowRight className="size-4" /></span>
            </div>
          </Link>;
        })}
      </div>
      {visible.length > 1 && <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">{es ? "Desliza para ver más paisajes" : "Swipe to see more landscapes"}<ArrowRight className="size-4" /></p>}
    </>}
  </div></section>;
}

function ProgramasAsociados({ programas }: { programas: ProgramaAsociado[] }) {
  const { lang } = useI18n();
  const es = lang === "es";
  if (!programas.length) return null;
  return <section id="programas" className="mt-12 scroll-mt-24 border-t border-border pt-8 sm:mt-16">
    <h2 className="font-display text-2xl leading-tight text-brand-deep sm:text-3xl">
      {es ? "Programas de conservación de biodiversidad en Bolivia" : "Biodiversity conservation programs in Bolivia"}
    </h2>
    <div aria-label={es ? "Programas relacionados" : "Related programs"} className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible">
      {programas.map(programa => {
        const nombre = es ? programa.titulo_es : programa.titulo_en;
        const descripcion = textoPlano(es ? programa.descripcion_es : programa.descripcion_en);
        return <article key={programa.id_programa} className="group w-[86%] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-card sm:w-auto sm:max-w-none">
          <div className="relative aspect-video overflow-hidden">
            <Imagen id={programa.id_imagen_portada} alt={nombre} className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
            {descripcion && <div className="absolute inset-0 hidden bg-black/65 opacity-0 transition-opacity group-hover:opacity-100 lg:flex lg:items-end"><p className="line-clamp-4 p-4 text-sm leading-relaxed text-white">{descripcion}</p></div>}
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl font-semibold leading-snug text-brand-deep">{nombre}</h3>
            {descripcion && <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:sr-only">{descripcion}</p>}
            <Link to={`/programas?programa=${encodeURIComponent(programa.id_programa)}`} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline">{es ? "Conocer más" : "Learn more"}<ArrowRight className="size-4" /></Link>
          </div>
        </article>;
      })}
    </div>
    {programas.length > 1 && <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">{es ? "Desliza para ver los programas" : "Swipe to see programs"}<ArrowRight className="size-4" /></p>}
  </section>;
}

export function DetallePaisajePublico({ id }: { id: string }) {
  const { lang } = useI18n();
  const es = lang === "es";
  const [data, setData] = useState<PaisajePublicoDetalle | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error" | "no-encontrado">("cargando");
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setEstado("cargando");
    obtenerPaisajePublico(id, controller.signal).then(paisaje => { if (!controller.signal.aborted) { setData(paisaje); setEstado("listo"); } }).catch(error => { if (!controller.signal.aborted) setEstado(error instanceof Error && error.message === "NOT_FOUND" ? "no-encontrado" : "error"); });
    return () => controller.abort();
  }, [id, intento]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id]);
  useEffect(() => {
    if (estado !== "listo" || window.location.hash !== "#programas") return;
    const frame = window.requestAnimationFrame(() => document.getElementById("programas")?.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [estado, id]);
  return <article className="min-h-[65vh] bg-background"><div className="container-site py-8 sm:py-16"><div className="mx-auto max-w-4xl">
    <Link to="/paisajes" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />{es ? "Volver a paisajes" : "Back to landscapes"}</Link>
    {estado === "cargando" && <p role="status" className="text-muted-foreground">{es ? "Cargando paisaje…" : "Loading landscape…"}</p>}
    {estado === "error" && <Mensaje mensaje={es ? "No fue posible mostrar este paisaje. Comprueba tu conexión." : "We couldn't load this landscape. Check your connection."} onRetry={() => setIntento(x => x + 1)} />}
    {estado === "no-encontrado" && <Mensaje mensaje={es ? "Este paisaje no está disponible." : "This landscape is unavailable."} />}
    {estado === "listo" && data && <>
      <h1 className="mb-8 font-display text-3xl font-semibold leading-tight text-brand-deep sm:text-5xl">{es ? data.titulo_es : data.titulo_en}</h1>
      {data.bloques.length ? <div className="space-y-7 sm:space-y-9">{data.bloques.map(b => <RenderBloque key={b.id_bloque} bloque={b} />)}</div> : <Mensaje mensaje={es ? "Próximamente compartiremos más información sobre este paisaje." : "More information about this landscape will be available soon."} />}
      <ProgramasAsociados programas={Array.isArray(data.programas) ? data.programas : []} />
    </>}
  </div></div></article>;
}
