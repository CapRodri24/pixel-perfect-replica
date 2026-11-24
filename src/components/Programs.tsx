import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ImageOff, RefreshCw, Search, X, LayoutGrid, Mountain } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { listarProgramasPublicos, imagenProgramaUrl, type ProgramaPublicoResumen } from "@/api/programasPublicosApi";
function Mensaje({ mensaje, onRetry }: { mensaje: string; onRetry?: (() => void) | undefined }) {
  const { lang } = useI18n();
  return <div role="status" className="mx-auto max-w-xl rounded-3xl border border-border bg-muted/40 p-8 text-center">
    <p className="leading-relaxed text-muted-foreground">{mensaje}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><RefreshCw className="size-4" />{lang === "es" ? "Volver a intentar" : "Try again"}</button>}
  </div>;
}

function Imagen({ id, alt, className }: { id: string | null | undefined; alt: string; className: string }) {
  const [fallo, setFallo] = useState(false);
  const url = imagenProgramaUrl(id);
  useEffect(() => { setFallo(false); }, [url]);
  if (!url || fallo) return <div aria-label={alt} role="img" className={`${className} grid place-items-center bg-muted text-muted-foreground`}><ImageOff className="size-10 opacity-40" aria-hidden="true" /></div>;
  return <img src={url} alt={alt} loading="lazy" decoding="async" className={className} onError={() => setFallo(true)} />;
}

function textoPlano(valor: string | null | undefined): string {
  if (!valor) return "";
  return new DOMParser().parseFromString(valor, "text/html").body.textContent?.trim() || "";
}

function normalizar(valor: string): string {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
}

export function Programs() {
  const { lang } = useI18n(); const es = lang === "es";
  const { search } = useLocation();
  const [items, setItems] = useState<ProgramaPublicoResumen[]>([]);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");
  const [intento, setIntento] = useState(0);
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState(new URLSearchParams(search).get("paisaje") || "all");
  useEffect(() => { setFiltro(new URLSearchParams(search).get("paisaje") || "all"); }, [search]);
  useEffect(() => {
    const controller = new AbortController(); setEstado("cargando");
    listarProgramasPublicos(controller.signal).then(data => {
      if (!controller.signal.aborted) { setItems(data); setEstado("listo"); }
    }).catch(() => { if (!controller.signal.aborted) setEstado("error"); });
    return () => controller.abort();
  }, [intento]);
  const nombre = (p: ProgramaPublicoResumen) => es ? p.titulo_es : p.titulo_en;
  const descripcion = (p: ProgramaPublicoResumen) => textoPlano(es ? p.descripcion_es : p.descripcion_en);
  const paisaje = (p: ProgramaPublicoResumen) => es ? p.paisaje_titulo_es : p.paisaje_titulo_en;
  const filtros = [{id:"all",label:es ? "Todo" : "All"}, ...Array.from(new Map(items.map(p => [p.id_paisaje, {id:p.id_paisaje,label:paisaje(p)}])).values())];
  const visible = items.filter(p => (filtro === "all" || filtro === p.id_paisaje) && normalizar(`${nombre(p)} ${descripcion(p)} ${paisaje(p)}`).includes(normalizar(query)));
  const limpiar = () => { setQuery(""); setFiltro("all"); };
  return <section id="programas" className="section scroll-mt-24 overflow-hidden bg-muted/40"><div className="container-site">
    <SectionHeading eyebrow={es ? "Programas" : "Programs"} title={es ? "Programas de conservación de biodiversidad en Bolivia" : "Biodiversity conservation programs in Bolivia"} text={es ? "Conoce nuestros programas de conservación en los diferentes paisajes de Bolivia." : "Discover our conservation programs across Bolivia’s landscapes."} />
    <form onSubmit={e => e.preventDefault()} role="search" className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input type="search" value={query} onChange={e => setQuery(e.target.value)} aria-label={es ? "Buscar programas" : "Search programs"} placeholder={es ? "Buscar programas…" : "Search programs…"} className="min-h-10 w-full min-w-0 rounded-full border border-input bg-background py-2 pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      {query && <button type="button" onClick={() => setQuery("")} aria-label={es ? "Limpiar búsqueda" : "Clear search"} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}</div>
      <Button type="submit" className="min-h-9 rounded-full sm:shrink-0">{es ? "Buscar" : "Search"}</Button>
    </form>
    <div role="group" aria-label={es ? "Filtrar por paisaje" : "Filter by landscape"} className="mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
      {filtros.map(opcion => { const Icon = opcion.id === "all" ? LayoutGrid : Mountain; return <button key={opcion.id} type="button" aria-pressed={filtro === opcion.id} onClick={() => setFiltro(opcion.id)} className={`armonia-subindice flex min-h-14 shrink-0 snap-start items-center gap-2 rounded-2xl border px-3 py-2 text-left text-sm font-semibold leading-tight text-primary transition-colors sm:min-w-0 ${filtro === opcion.id ? "border-primary/60 bg-primary/5" : "border-border bg-background hover:border-primary/60 hover:bg-primary/5"}`}><Icon className="size-4 shrink-0" /><span className="sm:break-words">{opcion.label}</span></button>; })}
    </div>
    {estado === "cargando" && <p role="status" className="mt-10 text-muted-foreground">{es ? "Cargando programas…" : "Loading programs…"}</p>}
    {estado === "error" && <div className="mt-10"><Mensaje mensaje={es ? "No pudimos cargar los programas. Comprueba tu conexión e inténtalo nuevamente." : "We couldn't load the programs. Check your connection and try again."} onRetry={() => setIntento(n => n + 1)} /></div>}
    {estado === "listo" && !items.length && <div className="mt-10"><Mensaje mensaje={es ? "Todavía no hay programas disponibles." : "There are no programs available yet."} /></div>}
    {estado === "listo" && !!items.length && !visible.length && <div className="mt-6 rounded-2xl bg-muted p-8 text-center"><p>{es ? "No se encontraron programas." : "No programs found."}</p><Button variant="outline" className="mt-4" onClick={limpiar}>{es ? "Limpiar filtros" : "Clear filters"}</Button></div>}
    {estado === "listo" && !!visible.length && <><div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
      {visible.map(p => <article key={p.id_programa} className="group w-[86%] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-card sm:w-auto sm:max-w-none">
        <div className="relative aspect-video overflow-hidden"><Imagen id={p.id_imagen_portada} alt={nombre(p)} className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />{descripcion(p) && <div className="absolute inset-0 hidden bg-black/65 opacity-0 transition-opacity group-hover:opacity-100 lg:flex lg:items-end"><p className="line-clamp-4 p-4 text-sm leading-relaxed text-white">{descripcion(p)}</p></div>}</div>
        <div className="p-5"><p className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="size-2.5 rounded-full" style={{backgroundColor: /^#[0-9a-f]{6}$/i.test(p.color) ? p.color : "#2381C4"}} />{paisaje(p)}</p><h3 className="font-display text-xl font-semibold leading-snug text-brand-deep">{nombre(p)}</h3>{descripcion(p) && <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:sr-only">{descripcion(p)}</p>}<Link to={`/programas?programa=${encodeURIComponent(p.id_programa)}`} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary hover:underline">{es ? "Conocer más" : "Learn more"}<ArrowRight className="size-4" /></Link></div>
      </article>)}
    </div>{visible.length > 1 && <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">{es ? "Desliza para ver más programas" : "Swipe to see more programs"}<ArrowRight className="size-4" /></p>}</>}
  </div></section>;
}
export default Programs;
