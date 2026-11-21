
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  BookOpen,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import FormatoRecursos from "./recursos/formato_recursos";
import {
  resources,
  resourceTypes,
  type ResourceType,
} from "./recursos/recursos-mock";

export default function Recursos() {
  const { lang } = useI18n();
  const es = lang === "es";

  const { hash, key } = useLocation();

  const category =
    resourceTypes.find((item) => `#${item.id}` === hash)?.id ?? "all";

  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery("");

    const frame = window.requestAnimationFrame(() => {
      if (category !== "all") {
        document
          .getElementById("recursos-listado")
          ?.scrollIntoView({
            block: "start",
            behavior: "instant",
          });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [key, category]);

  const filtered = resources.filter((item) => {
    const matchesCategory =
      category === "all" || item.type === category;

    const searchText = `${es
        ? item.title.es + " " + item.description.es
        : item.title.en + " " + item.description.en
      } ${item.year} ${item.format}`;

    return (
      matchesCategory &&
      searchText
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase())
    );
  });

  const filterLink = (
    id: ResourceType | "all",
    label: string
  ) => {
    const active = category === id;

    return (
      <Link
        key={id}
        to={
          id === "all"
            ? "/recursos"
            : `/recursos#${id}`
        }
        aria-current={active ? "true" : undefined}
        className={`armonia-subindice flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-brand-deep hover:border-primary hover:bg-secondary"
          }`}
      >
        <BookOpen
          className="size-4 shrink-0"
          aria-hidden="true"
        />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div
      id="recursos"
      className="min-h-[70vh] overflow-x-clip"
    >
      <section className="relative isolate overflow-hidden bg-brand-deep text-white">
        <img
          src="/images/home/2.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/55 to-black/20" />

        <div className="container-site py-12 sm:py-20">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-white/85 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {es ? "Inicio" : "Home"}
          </Link>

          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-6xl">
            {es ? "Recursos" : "Resources"}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-lg">
            {es
              ? "Explora informes, publicaciones, mapas y herramientas que acompañan nuestro trabajo de conservación."
              : "Explore reports, publications, maps and tools supporting our conservation work."}
          </p>
        </div>
      </section>

      <section
        id="recursos-listado"
        className="section scroll-mt-24 overflow-hidden"
      >
        <div className="container-site">
          <h2 className="font-display text-2xl leading-tight text-brand-deep sm:text-3xl">
            {es
              ? "Centro de recursos"
              : "Resource centre"}
          </h2>

          <form
            onSubmit={(e) => e.preventDefault()}
            role="search"
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >

            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label={es ? "Buscar recursos" : "Search resources"}
                placeholder={
                  es
                    ? "Título, año o formato"
                    : "Title, year or format"
                }
                className="min-h-12 w-full min-w-0 rounded-full border border-input bg-background py-3 pl-12 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={es ? "Limpiar" : "Clear"}
                  className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="min-h-11 rounded-full sm:shrink-0"
            >
              {es ? "Buscar" : "Search"}
            </Button>
          </form>

          <nav
            aria-label={
              es
                ? "Tipos de recursos"
                : "Resource types"
            }
            className="mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible"
          >
            {filterLink(
              "all",
              es ? "Todo" : "All"
            )}

            {resourceTypes.map((item) =>
              filterLink(
                item.id,
                es ? item.es : item.en
              )
            )}
          </nav>

          <p className="mt-1 text-center text-xs text-muted-foreground sm:hidden">
            {es
              ? "Desliza para explorar las categorías"
              : "Swipe to explore categories"}
          </p>

          <p
            className="mt-5 text-sm text-muted-foreground"
            aria-live="polite"
          >
            {filtered.length}{" "}
            {es
              ? "recursos de demostración"
              : "demo resources"}
          </p>

          {filtered.length > 0 ? (
            <>
              <div
                aria-label={
                  es
                    ? "Listado de recursos"
                    : "Resource list"
                }
                className="mt-5 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3"
              >
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className="flex w-[86%] max-w-[370px] shrink-0 snap-center sm:w-auto sm:max-w-none"
                  >
                    <FormatoRecursos resource={item} />
                  </div>
                ))}
              </div>

              {filtered.length > 1 && (
                <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                  {es
                    ? "Desliza para ver más recursos"
                    : "Swipe to see more resources"}
                  <ArrowRight className="size-4" />
                </p>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-muted p-8 text-center">
              <p>
                {es
                  ? "No se encontraron recursos."
                  : "No resources found."}
              </p>

              <Button
                variant="outline"
                className="mt-4"
                asChild
              >
                <Link to="/recursos">
                  {es
                    ? "Ver todos"
                    : "View all"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
