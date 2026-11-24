import { useEffect, useState } from "react";
import {
  Search,
  X,
  Filter,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { newsCategories } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  NewsCard,
  useNewsItems,
} from "./paisajes/noticias-mock";
import FormatoNoticias from "./paisajes/formato-noticias";

const headerFilters: Readonly<Record<string, string>> = {
  institucionales: "institutional",
  historias: "stories",
  agenda: "events",
  multimedia: "multimedia",
  youtube: "videos",
  infogramas: "infographics",
  flickr: "gallery",
  redes: "social",
};

export function Noticias({
  home = false,
}: {
  home?: boolean;
}) {
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
      const frame = window.requestAnimationFrame(() => {
        if (hash) {
          document.getElementById("noticias-listado")?.scrollIntoView({ block: "start", behavior: "instant" });
        } else {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [key, hash, home, selectedFromHeader]);

  const normalized = query.trim().toLocaleLowerCase();
  const filtered = items.filter((item) => {
    const matchesCategory = category === "all" || item.category === category || (category === "multimedia" && ["videos", "infographics", "gallery"].includes(item.category));
    const searchText = `${item.title} ${item.text}`.toLocaleLowerCase();
    return matchesCategory && searchText.includes(normalized);
  });
  const visible = home ? [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3) : filtered;
  const categories = ["all", ...newsCategories, "multimedia", "social"];
  const label = (c: string) => {
    if (c === "all") return t<string>("news.allCategories");
    if (c === "multimedia") return "Multimedia";
    if (c === "social") return es ? "Redes sociales" : "Social media";
    return t<string>(`news.categories.${c}`);
  };

  const content = (
    <section id={home ? "noticias" : "noticias-listado"} className={`${home ? "section" : "py-10 sm:py-14"} scroll-mt-4 overflow-hidden bg-background`}>
      <div className="container-site">
        <SectionHeading eyebrow={t("news.eyebrow")} title={t("news.title")} />
        {!home && (
          <>
            <form onSubmit={(event) => event.preventDefault()} role="search" className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input type="search" aria-label={t("news.search")} placeholder={t("news.search")} value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-12 w-full min-w-0 rounded-full border border-input bg-background py-3 pl-12 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                {query && (
                  <button type="button" onClick={() => setQuery("")} aria-label={es ? "Limpiar búsqueda" : "Clear search"} className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground">
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button type="submit" className="min-h-11 rounded-full sm:shrink-0">{es ? "Buscar" : "Search"}</Button>
            </form>
            <div role="group" aria-label={es ? "Categorías" : "Categories"} className="mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible">
              {categories.map((c) => {
                const active = category === c;
                return (
                  <button key={c} type="button" aria-pressed={active} onClick={() => setCategory(c)} className={`armonia-subindice flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:bg-secondary"}`}>
                    <Filter className="size-4 shrink-0" aria-hidden="true" />
                    <span>{label(c)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground sm:hidden">{es ? "Desliza para explorar las categorías" : "Swipe to explore categories"}</p>
          </>
        )}
        {visible.length > 0 ? (
          <>
            <div aria-label={es ? "Listado de noticias" : "News list"} className="mt-6 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3">
              {visible.map((item, i) => (
                <div key={item.id} className={`flex w-[86%] max-w-[380px] shrink-0 snap-center sm:w-auto sm:max-w-none ${i === 0 && visible.length > 3 ? "sm:col-span-2" : ""}`}>
                  <div className="w-full"><NewsCard item={item} featured={i === 0 && visible.length > 3} /></div>
                </div>
              ))}
            </div>
            {visible.length > 1 && (
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                {es ? "Desliza para ver más noticias" : "Swipe to see more news"}<ArrowRight className="size-4" />
              </p>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-2xl bg-muted p-8 text-center text-muted-foreground">
            <p>{category === "social" ? es ? "Todavía no hay publicaciones de redes sociales en los datos de demostración." : "No social media posts are available in the demo data yet." : t("news.empty")}</p>
            <Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setCategory("all"); }}>{t("news.clear")}</Button>
          </div>
        )}
      </div>
    </section>
  );

  return home ? content : (
    <main className="min-h-[70vh] overflow-x-clip">
      <section className="relative isolate overflow-hidden bg-brand-deep text-white">
        <img src="/images/home/3.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/20" />
        <div className="container-site flex min-h-[340px] flex-col justify-center py-12 sm:min-h-[440px] sm:py-20">
          <Link to="/" className="mb-7 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="size-4" />
            {es ? "Inicio" : "Home"}
          </Link>
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand-light">{t("brand.name")}</span>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-6xl lg:text-7xl">{es ? "Noticias" : "News"}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-lg">{es ? "Conoce nuestras historias, actividades y avances en la conservación de las aves y sus hábitats en Bolivia." : "Discover our stories, activities and progress in conserving Bolivia’s birds and their habitats."}</p>
        </div>
      </section>
      {content}
    </main>
  );
}

export function NoticiaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { key } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [key]);
  return <FormatoNoticias id={id ?? ""} />;
}
