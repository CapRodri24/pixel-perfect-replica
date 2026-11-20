import { useEffect, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { newsCategories } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionView } from "@/components/SectionView";
import { Button } from "@/components/ui/button";
import { NewsCard, useNewsItems } from "./paisajes/noticias-mock";
import FormatoNoticias from "./paisajes/formato-noticias";

const headerFilters: Readonly<Record<string, string>> = {
  institucionales: "institutional", historias: "stories", agenda: "events",
  multimedia: "multimedia", youtube: "videos", infogramas: "infographics", flickr: "gallery", redes: "social",
};

export function Noticias({ home = false }: { home?: boolean }) {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const { hash, key } = useLocation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const items = useNewsItems();
  const selectedFromHeader = home ? "all" : headerFilters[hash.slice(1)] ?? "all";
  useEffect(() => {
    setCategory(selectedFromHeader);
    setQuery("");
    if (!home) {
      if (hash) document.getElementById("noticias-listado")?.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [key, hash, home, selectedFromHeader]);
  const normalized = query.trim().toLocaleLowerCase();
  const filtered = items.filter(item => {
    const matchesCategory = category === "all" || item.category === category || (category === "multimedia" && ["videos", "infographics", "gallery"].includes(item.category));
    return matchesCategory && `${item.title} ${item.text}`.toLocaleLowerCase().includes(normalized);
  });
  const visible = home ? [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3) : filtered;
  const categories = ["all", ...newsCategories, "multimedia", "social"];
  const label = (c: string) => c === "all" ? t<string>("news.allCategories") : c === "multimedia" ? "Multimedia" : c === "social" ? (es ? "Redes sociales" : "Social media") : t<string>(`news.categories.${c}`);
  const content = <section id={home ? "noticias" : "noticias-listado"} className={`${home ? "section" : "py-10 sm:py-14"} scroll-mt-4 bg-background`}>
    <div className="container-site">
      <SectionHeading eyebrow={t("news.eyebrow")} title={t("news.title")} />
      {!home && <>
      <form onSubmit={event => event.preventDefault()} className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input aria-label={t("news.search")} placeholder={t("news.search")} value={query} onChange={event => setQuery(event.target.value)} className="h-11 w-full rounded-full border border-input bg-background pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />{query && <button type="button" onClick={() => setQuery("")} aria-label={es ? "Limpiar búsqueda" : "Clear search"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></button>}</div>
        <Button type="submit" className="rounded-full">{es ? "Buscar" : "Search"}</Button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2 pb-3" aria-label={es ? "Categorías" : "Categories"}>
        {categories.map(c => <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`armonia-subindice shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-secondary"}`}><Filter className="size-4 shrink-0" aria-hidden="true" />{label(c)}</button>)}
      </div>
      </>}
      {visible.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((item, i) => <NewsCard key={item.id} item={item} featured={i === 0 && visible.length > 3} />)}</div> : <div className="mt-6 rounded-2xl bg-muted p-8 text-center text-muted-foreground"><p>{category === "social" ? (es ? "Todavía no hay publicaciones de redes sociales en los datos de demostración." : "No social media posts are available in the demo data yet.") : t("news.empty")}</p><Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setCategory("all"); }}>{t("news.clear")}</Button></div>}
    </div>
  </section>;
  return home ? content : <SectionView title={es ? "Noticias" : "News"}>{content}</SectionView>;
}

export function NoticiaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { key } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [key]);
  return <FormatoNoticias id={id ?? ""} />;
}
