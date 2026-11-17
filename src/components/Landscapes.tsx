import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Search, X } from "lucide-react";
import { landscapes, programs, type LandscapeId, type ProgramId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// --- TARJETA DE PAISAJE (Fusionada) ---
function LandscapeCard({
  id,
  image,
  onSelect,
  featured,
}: {
  id: LandscapeId;
  image: string;
  onSelect: () => void;
  featured?: boolean;
}) {
  const { t } = useI18n();
  return (
    <button
      onClick={onSelect}
      className={`theme-${id} group relative isolate flex min-h-[22rem] w-full flex-col justify-end overflow-hidden rounded-3xl text-left text-primary-foreground ${
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
        <p className="mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/85">
          {t(`landscapes.items.${id}.text`)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-lp px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-lp-2">
          {t("landscapes.explore")}{" "}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

// --- TARJETA DE PROGRAMA (Fusionada) ---
function ProgramCard({
  id,
  landscape,
  image,
}: {
  id: ProgramId;
  landscape: LandscapeId | null;
  image: string;
}) {
  const { t } = useI18n();
  return (
    <article
      className={`${
        landscape ? `theme-${landscape}` : ""
      } group flex h-full flex-col overflow-hidden rounded-3xl bg-lp-soft transition-all hover:-translate-y-1 hover:shadow-card`}
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          width={1600}
          height={1008}
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-lp px-3 py-1 text-xs font-semibold text-primary-foreground">
          {landscape ? t(`landscapes.items.${landscape}.name`) : t("programs.national")}
        </span>
        <h3 className="mt-4 text-xl text-brand-deep">{t(`programs.items.${id}.name`)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {t(`programs.items.${id}.text`)}
        </p>
        <Button asChild variant="ghost" className="mt-5 w-fit px-0">
          <Link to={`/programas/${id}`}>
            {t("programs.more")} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

// --- COMPONENTE PRINCIPAL DE PAISAJES ---
export function Landscapes({ initialSelected = null }: { initialSelected?: string | null }) {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<LandscapeId | null>(null);

  const select = (id: string | null) => {
    setSelected(id);
    setQuery("");
    setActiveFilter(null);
    document.getElementById("paisajes")?.scrollIntoView({ behavior: "smooth" });
  };

  const current = landscapes.find((l) => l.id === selected);

  // Claim (i18n con fallback)
  const tagline =
    lang === "es"
      ? "Diferentes paisajes, una misma misión"
      : "Different landscapes, one same mission";
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

      <div className="mt-3 flex flex-wrap gap-2">
        {/* Chip "Todo" */}
        <button
          type="button"
          onClick={() => setActiveFilter(null)}
          aria-pressed={activeFilter === null}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            activeFilter === null
              ? "border-lp bg-lp text-primary-foreground"
              : "border-border bg-background hover:bg-lp-soft"
          }`}
        >
          <span
            className={`size-2.5 rounded-full ${
              activeFilter === null ? "bg-primary-foreground" : "bg-lp"
            }`}
          />
          {allLabel}
        </button>

        {/* Chips de paisajes */}
        {relatedButtons.map((l) => {
          const isActive = activeFilter === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setActiveFilter((prev) => (prev === l.id ? null : l.id))}
              aria-pressed={isActive}
              className={`theme-${l.id} flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-lp bg-lp text-primary-foreground"
                  : "border-border bg-background hover:bg-lp-soft"
              }`}
            >
              <span
                className={`size-2.5 rounded-full ${
                  isActive ? "bg-primary-foreground" : "bg-lp"
                }`}
              />
              {t(`landscapes.items.${l.id}.name`)}
            </button>
          );
        })}
      </div>
    </div>
  );

  const switcher = (
    <div className="mt-10 flex flex-wrap gap-2">
      {landscapes
        .filter((l) => l.id !== selected)
        .map((l) => (
          <button
            key={l.id}
            onClick={() => select(l.id)}
            className={`theme-${l.id} flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-lp-soft`}
          >
            <span className="size-2.5 rounded-full bg-lp" />
            {t(`landscapes.items.${l.id}.name`)}
          </button>
        ))}
    </div>
  );

  return (
    <section id="paisajes" className="section bg-muted">
      <div className="container-site">
        {current ? (
          <div className={`theme-${current.id} animate-rise`}>
            <Button variant="ghost" onClick={() => select(null)}>
              <ArrowLeft /> {t("landscapes.back")}
            </Button>
            <div className="mt-4 grid overflow-hidden rounded-3xl bg-lp-soft lg:grid-cols-2">
              <img
                src={current.image}
                alt={t(`landscapes.items.${current.id}.name`)}
                width={1600}
                height={1008}
                className="aspect-[16/10] size-full object-cover lg:aspect-auto"
              />
              <div className="p-6 sm:p-10">
                <div className="flex gap-1.5">
                  <span className="h-2 w-10 rounded-full bg-lp" />
                  <span className="h-2 w-5 rounded-full bg-lp-2" />
                </div>
                <h2 className="mt-5 text-3xl text-brand-deep sm:text-5xl">
                  {t(`landscapes.items.${current.id}.name`)}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t(`landscapes.items.${current.id}.text`)}
                </p>
                <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-lp-2">
                  {t("landscapes.lines")}
                </h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t<string[]>(`landscapes.items.${current.id}.lines`).map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-lp" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h3 className="mt-12 text-2xl text-brand-deep">{t("landscapes.programs")}</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs
                .filter((p) => p.landscape === (current.id as LandscapeId))
                .map((p) => (
                  <ProgramCard key={p.id} {...p} />
                ))}
            </div>
            {switcher}
          </div>
        ) : (
          <>
            <SectionHeading
              eyebrow={t("landscapes.eyebrow")}
              title={t("landscapes.title")}
              text={t("landscapes.text")}
            />

            {/* Claim */}
            <p className="mt-6 text-lg font-semibold text-brand-deep sm:text-xl">
              {tagline}
            </p>

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
                    onSelect={() => select(l.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}