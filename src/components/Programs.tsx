
import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  landscapes,
  programs,
  type LandscapeId,
  type ProgramId,
} from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

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
      } group flex h-full w-[85%] max-w-[360px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl bg-lp-soft shadow-sm transition-all motion-safe:hover:-translate-y-1 hover:shadow-card sm:w-auto sm:max-w-none`}
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          width={1600}
          height={1008}
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="w-fit rounded-full bg-lp px-3 py-1 text-xs font-semibold text-primary-foreground">
          {landscape
            ? t(`landscapes.items.${landscape}.name`)
            : t("programs.national")}
        </span>

        <h3 className="mt-4 text-xl font-semibold leading-snug text-brand-deep">
          {t(`programs.items.${id}.name`)}
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {t(`programs.items.${id}.text`)}
        </p>

        <Button
          asChild
          variant="ghost"
          className="mt-5 w-fit px-0"
        >
          <Link to={`/programas/${id}`}>
            {t("programs.more")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

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
    ...landscapes.map((l) => ({
      id: l.id as FilterId,
      label: t(`landscapes.items.${l.id}.name`),
    })),
    {
      id: "national",
      label: t("programs.national"),
    },
  ];

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();

    return programs.filter((p) => {
      const matchesChip =
        filter === "all" ||
        (filter === "national"
          ? !p.landscape
          : p.landscape === filter);

      if (!matchesChip) return false;
      if (!q) return true;

      const name = t(`programs.items.${p.id}.name`).toLowerCase();
      const text = t(`programs.items.${p.id}.text`).toLowerCase();

      const landscapeName = p.landscape
        ? t(`landscapes.items.${p.landscape}.name`).toLowerCase()
        : t("programs.national").toLowerCase();

      return (
        name.includes(q) ||
        text.includes(q) ||
        landscapeName.includes(q)
      );
    });
  }, [filter, query, t]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <section
      id="programas"
      className="section overflow-hidden"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow={t("programs.eyebrow")}
          title={t("programs.title")}
          text={t("programs.text")}
        />

        <p className="mt-5 text-lg font-semibold text-brand-deep sm:mt-6 sm:text-xl">
          {tagline}
        </p>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
        >
          <label htmlFor="program-search" className="sr-only">
            {searchLabel}
          </label>

          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

            <input
              id="program-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-h-12 w-full rounded-full border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="min-h-11 flex-1 sm:flex-none"
            >
              {searchLabel}
            </Button>

            {(query || filter !== "all") && (
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
          aria-label={
            isEs ? "Filtrar programas por paisaje" : "Filter programs by landscape"
          }
          className="mt-6 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none]"
        >
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              aria-pressed={filter === c.id}
              className={`${
                c.id !== "all" && c.id !== "national"
                  ? `theme-${c.id}`
                  : ""
              } flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-brand-deep hover:border-primary hover:text-primary"
              }`}
            >
              {c.id !== "all" && c.id !== "national" && (
                <span
                  className={`size-2.5 rounded-full ${
                    filter === c.id ? "bg-current" : "bg-lp"
                  }`}
                />
              )}
              {c.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-12 py-10 text-center text-muted-foreground">
            {noResults}
          </p>
        ) : (
          <>
            <div
              aria-label={isEs ? "Listado de programas" : "Program list"}
              className="mt-7 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3"
            >
              {list.map((p) => (
                <ProgramCard key={p.id} {...p} />
              ))}
            </div>

            {list.length > 1 && (
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                {isEs
                  ? "Desliza para explorar los programas"
                  : "Swipe to explore programs"}
                <ArrowRight className="size-4" />
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
