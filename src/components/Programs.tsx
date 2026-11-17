import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { landscapes, programs, type LandscapeId, type ProgramId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

// --- TARJETA DE PROGRAMA (Fusionada aquí) ---
function ProgramCard({ id, landscape, image }: { id: ProgramId; landscape: LandscapeId | null; image: string }) {
  const { t } = useI18n();
  return (
    <article className={`${landscape ? `theme-${landscape}` : ""} group flex h-full flex-col overflow-hidden rounded-3xl bg-lp-soft transition-all hover:-translate-y-1 hover:shadow-card`}>
      <div className="overflow-hidden">
        <img src={image} alt="" loading="lazy" width={1600} height={1008} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-lp px-3 py-1 text-xs font-semibold text-primary-foreground">
          {landscape ? t(`landscapes.items.${landscape}.name`) : t("programs.national")}
        </span>
        <h3 className="mt-4 text-xl text-brand-deep">{t(`programs.items.${id}.name`)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`programs.items.${id}.text`)}</p>
        <Button asChild variant="ghost" className="mt-5 w-fit px-0">
          <Link to={`/programas/${id}`}>
            {t("programs.more")} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

// --- COMPONENTE PRINCIPAL DE PROGRAMAS ---
type FilterId = LandscapeId | "all" | "national";

export function Programs() {
  const { t, lang } = useI18n();
  const isEs = lang === "es";

  const tagline = isEs
    ? "Diferentes programas, una misma misión"
    : "Different programs, one same mission";
  const searchPlaceholder = isEs
    ? "Buscar programas, paisajes, misiones…"
    : "Search programs, landscapes, missions…";
  const searchLabel = isEs ? "Buscar" : "Search";
  const clearLabel = isEs ? "Limpiar" : "Clear";
  const noResults = isEs
    ? "No se encontraron programas."
    : "No programs found.";

  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");

  const chips: { id: FilterId; label: string }[] = [
    { id: "all", label: t("programs.all") },
    ...landscapes.map((l) => ({ id: l.id as FilterId, label: t(`landscapes.items.${l.id}.name`) })),
    { id: "national", label: t("programs.national") },
  ];

  // Filtrado combinado: chip + texto
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      // 1) Filtro por chip
      const matchesChip =
        filter === "all" ||
        (filter === "national" ? !p.landscape : p.landscape === filter);

      if (!matchesChip) return false;

      // 2) Filtro por texto
      if (!q) return true;

      const name = t(`programs.items.${p.id}.name`).toLowerCase();
      const text = t(`programs.items.${p.id}.text`).toLowerCase();
      const landscapeName = p.landscape
        ? t(`landscapes.items.${p.landscape}.name`).toLowerCase()
        : t("programs.national").toLowerCase();

      return name.includes(q) || text.includes(q) || landscapeName.includes(q);
    });
  }, [filter, query, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // El filtrado ya es reactivo.
  };

  const handleClear = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <section id="programas" className="section">
      <div className="container-site">
        <SectionHeading
          eyebrow={t("programs.eyebrow")}
          title={t("programs.title")}
          text={t("programs.text")}
        />

        {/* Claim */}
        <p className="mt-6 text-lg font-semibold text-brand-deep sm:text-xl">
          {tagline}
        </p>

        {/* Buscador */}
        <form
          onSubmit={handleSubmit}
          role="search"
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label htmlFor="program-search" className="sr-only">
            {searchLabel}
          </label>
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="program-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button type="submit">{searchLabel}</Button>
          {(query || filter !== "all") && (
            <Button type="button" variant="outline" onClick={handleClear}>
              <X className="size-4" /> {clearLabel}
            </Button>
          )}
        </form>

        {/* Chips relacionados (filtro por paisaje) */}
        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              aria-pressed={filter === c.id}
              className={`${
                c.id !== "all" && c.id !== "national" ? `theme-${c.id}` : ""
              } flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              {c.id !== "all" && c.id !== "national" && (
                <span className="size-2.5 rounded-full bg-lp" />
              )}
              {c.label}
            </button>
          ))}
        </div>

        {/* Lista filtrada */}
        {list.length === 0 ? (
          <p className="mt-12 py-10 text-center text-muted-foreground">{noResults}</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProgramCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}