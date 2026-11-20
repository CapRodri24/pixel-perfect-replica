import { useMemo, useState } from "react";
import { ArrowRight, Search, X, LayoutGrid, Mountain, Trees, Waves, Leaf, Sun } from "lucide-react";
import { landscapes, type LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// --- TARJETA DE PAISAJE (Fusionada) ---
function LandscapeCard({
  id,
  image,
  featured,
}: {
  id: LandscapeId;
  image: string;
  featured?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Link
      to="/paisajes?paisaje=beni"
      className={`theme-${id} group relative isolate flex min-h-[22rem] w-full flex-col justify-end overflow-hidden rounded-3xl text-left text-white ${
        featured ? "sm:col-span-2 lg:row-span-2 lg:min-h-full" : ""
      }`}
    >
      <img
        src={image}
        alt={t(`landscapes.items.${id}.name`)}
        loading="lazy"
        width={1600}
        height={1008}
        className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="card-overlay absolute inset-0 -z-10" />
      <span className="absolute left-0 top-0 h-1.5 w-full bg-lp" />
      <div className="p-6 sm:p-7">
        <div className="mb-3 flex gap-1.5">
          <span className="size-3 rounded-full bg-lp" />
          <span className="size-3 rounded-full bg-lp-2" />
        </div>
        <h3 className={featured ? "text-3xl sm:text-4xl" : "text-2xl"}>
          {t(`landscapes.items.${id}.name`)}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
          {t(`landscapes.items.${id}.text`)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-lp px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-lp-2">
          {t("landscapes.explore")}{" "}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// --- COMPONENTE PRINCIPAL DE PAISAJES ---
export function Landscapes({ initialSelected = null }: { initialSelected?: string | null }) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<LandscapeId | null>(
    landscapes.find((l) => l.id === initialSelected)?.id ?? null
  );
  const searchPlaceholder = lang === "es" ? "Buscar paisajes…" : "Search landscapes…";
  const searchLabel = lang === "es" ? "Buscar" : "Search";
  const clearLabel = lang === "es" ? "Limpiar" : "Clear";
  const allLabel = lang === "es" ? "Todo" : "All";
  const noResults =
    lang === "es" ? "No se encontraron paisajes." : "No landscapes found.";

  // Botones relacionados: usamos los propios paisajes como categorías
  const relatedButtons = landscapes;

  // Id del paisaje destacado (con optional chaining para TS)
  const featuredId = landscapes[0]?.id;

  // Lista filtrada por texto + chip
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landscapes.filter((l) => {
      const name = t(`landscapes.items.${l.id}.name`).toLowerCase();
      const text = t(`landscapes.items.${l.id}.text`).toLowerCase();
      const matchesQuery = !q || name.includes(q) || text.includes(q);
      const matchesFilter = !activeFilter || l.id === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // El filtrado ya es reactivo; aquí podrías añadir analytics.
  };

  const handleClear = () => {
    setQuery("");
    setActiveFilter(null);
  };

  // Buscador + chips (reutilizable)
  const searchBar = (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="landscape-search" className="sr-only">
          {searchLabel}
        </label>
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="landscape-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-lp focus:outline-none focus:ring-2 focus:ring-lp/30"
          />
        </div>
        <Button type="submit">{searchLabel}</Button>
        {(query || activeFilter) && (
          <Button type="button" variant="outline" onClick={handleClear}>
            <X className="size-4" /> {clearLabel}
          </Button>
        )}
      </form>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        <button
          type="button"
          onClick={() => setActiveFilter(null)}
          aria-pressed={activeFilter === null}
          className="armonia-subindice flex w-full items-center gap-2 rounded-[20px] border px-3 py-3 text-base font-semibold transition-colors"
        >
          <LayoutGrid className="size-5 shrink-0" aria-hidden="true" />
          <span className="flex-1">{allLabel}</span>
        </button>
        {relatedButtons.map((l) => {
          const isActive = activeFilter === l.id;
          const Icon = l.id === "beni" ? Waves : l.id === "yungas" ? Leaf : l.id === "andes" ? Mountain : l.id === "seco" ? Sun : Trees;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setActiveFilter((prev) => (prev === l.id ? null : l.id))}
              aria-pressed={isActive}
              className="armonia-subindice flex w-full items-center gap-2 rounded-[20px] border px-3 py-3 text-base font-semibold transition-colors"
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="flex-1">{t(`landscapes.items.${l.id}.name`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section id="paisajes" className="section bg-muted">
      <div id="mapa" className="container-site">
            <SectionHeading
              eyebrow={t("landscapes.eyebrow")}
              title={t("landscapes.title")}
              text={t("landscapes.text")}
            />

            {/* Buscador + chips */}
            {searchBar}

            {/* Grid filtrado */}
            {filtered.length === 0 ? (
              <p className="mt-12 py-10 text-center text-muted-foreground">{noResults}</p>
            ) : (
              <div className="mt-8 grid auto-rows-[minmax(22rem,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((l) => (
                  <LandscapeCard
                    key={l.id}
                    {...l}
                    featured={!query && !activeFilter && l.id === featuredId}
                  />
                ))}
              </div>
            )}
      </div>
    </section>
  );
}