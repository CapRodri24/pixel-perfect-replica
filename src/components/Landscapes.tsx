
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Search,
  X,
  LayoutGrid,
  Mountain,
  Trees,
  Waves,
  Leaf,
  Sun,
} from "lucide-react";
import { landscapes, type LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      className={`theme-${id} group relative isolate flex min-h-[420px] w-[86%] max-w-[380px] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-3xl text-left text-white transition-transform motion-safe:hover:-translate-y-1 sm:min-h-[22rem] sm:w-full sm:max-w-none ${
        featured ? "sm:col-span-2 lg:row-span-2 lg:min-h-full" : ""
      }`}
    >
      <img
        src={image}
        alt={t(`landscapes.items.${id}.name`)}
        loading="lazy"
        width={1600}
        height={1008}
        className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
      />

      <div className="card-overlay absolute inset-0 -z-10" />
      <span className="absolute left-0 top-0 h-1.5 w-full bg-lp" />

      <div className="p-5 sm:p-7">
        <div className="mb-3 flex gap-1.5">
          <span className="size-3 rounded-full bg-lp" />
          <span className="size-3 rounded-full bg-lp-2" />
        </div>

        <h3
          className={
            featured
              ? "text-2xl font-semibold sm:text-4xl"
              : "text-2xl font-semibold"
          }
        >
          {t(`landscapes.items.${id}.name`)}
        </h3>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
          {t(`landscapes.items.${id}.text`)}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-lp px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-lp-2">
          {t("landscapes.explore")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function Landscapes({
  initialSelected = null,
}: {
  initialSelected?: string | null;
}) {
  const { t, lang } = useI18n();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<LandscapeId | null>(
    landscapes.find((l) => l.id === initialSelected)?.id ?? null
  );

  const es = lang === "es";
  const searchPlaceholder = es ? "Buscar paisajes…" : "Search landscapes…";
  const searchLabel = es ? "Buscar" : "Search";
  const clearLabel = es ? "Limpiar" : "Clear";
  const allLabel = es ? "Todo" : "All";
  const noResults = es
    ? "No se encontraron paisajes."
    : "No landscapes found.";

  const featuredId = landscapes[0]?.id;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return landscapes.filter((l) => {
      const name = t(`landscapes.items.${l.id}.name`).toLowerCase();
      const text = t(`landscapes.items.${l.id}.text`).toLowerCase();

      const matchesQuery =
        !q || name.includes(q) || text.includes(q);

      const matchesFilter =
        !activeFilter || l.id === activeFilter;

      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter, t]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setQuery("");
    setActiveFilter(null);
  };

  const getLandscapeIcon = (id: LandscapeId) => {
    if (id === "beni") return Waves;
    if (id === "yungas") return Leaf;
    if (id === "andes") return Mountain;
    if (id === "seco") return Sun;
    return Trees;
  };

  return (
    <section
      id="paisajes"
      className="section overflow-hidden bg-muted"
    >
      <div id="mapa" className="container-site">
        <SectionHeading
          eyebrow={t("landscapes.eyebrow")}
          title={t("landscapes.title")}
          text={t("landscapes.text")}
        />

        <div className="mt-7 sm:mt-8">
          <form
            onSubmit={handleSubmit}
            role="search"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <label htmlFor="landscape-search" className="sr-only">
              {searchLabel}
            </label>

            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

              <input
                id="landscape-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="min-h-12 w-full rounded-full border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-lp focus:outline-none focus:ring-2 focus:ring-lp/30"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="min-h-11 flex-1 sm:flex-none"
              >
                {searchLabel}
              </Button>

              {(query || activeFilter) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="min-h-11"
                >
                  <X className="size-4" />
                  {clearLabel}
                </Button>
              )}
            </div>
          </form>

          <div
            role="group"
            aria-label={es ? "Filtrar paisajes" : "Filter landscapes"}
            className="mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible xl:grid-cols-6"
          >
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              aria-pressed={activeFilter === null}
              className={`armonia-subindice flex min-h-12 shrink-0 snap-start items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors sm:w-full sm:shrink ${
                activeFilter === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-brand-deep hover:border-primary"
              }`}
            >
              <LayoutGrid className="size-5 shrink-0" />
              <span>{allLabel}</span>
            </button>

            {landscapes.map((l) => {
              const isActive = activeFilter === l.id;
              const Icon = getLandscapeIcon(l.id);

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() =>
                    setActiveFilter((prev) =>
                      prev === l.id ? null : l.id
                    )
                  }
                  aria-pressed={isActive}
                  className={`armonia-subindice theme-${l.id} flex min-h-12 shrink-0 snap-start items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors sm:w-full sm:shrink ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-brand-deep hover:border-primary"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>
                    {t(`landscapes.items.${l.id}.name`)}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-1 text-center text-xs text-muted-foreground sm:hidden">
            {es
              ? "Desliza para explorar los paisajes"
              : "Swipe to explore landscapes"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 py-10 text-center text-muted-foreground">
            {noResults}
          </p>
        ) : (
          <>
            <div
              className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:auto-rows-[minmax(22rem,auto)] sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3"
              aria-label={es ? "Resultados de paisajes" : "Landscape results"}
            >
              {filtered.map((l) => (
                <LandscapeCard
                  key={l.id}
                  {...l}
                  featured={
                    !query &&
                    !activeFilter &&
                    l.id === featuredId
                  }
                />
              ))}
            </div>

            {filtered.length > 1 && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                <span>
                  {es
                    ? "Desliza para ver más"
                    : "Swipe to see more"}
                </span>
                <ArrowRight className="size-4" />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
