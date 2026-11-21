
import {
  ArrowUpRight,
  ArrowRight,
  Calendar,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { news } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";

const programIds: Readonly<Record<string, string | null>> = {
  n1: "barbaazul",
  n2: "palkachupa",
  n3: "tunari",
  n4: "frenteroja",
  n5: null,
  n6: "tororoi",
  n7: null,
  n8: "barbaazul",
};

export function useNewsItems() {
  const { t } = useI18n();

  return news.map((item) => ({
    ...item,
    programId: programIds[item.id] ?? null,
    title: t<string>(`news.items.${item.id}.title`),
    text: t<string>(`news.items.${item.id}.text`),
  }));
}

export type NewsItem = ReturnType<typeof useNewsItems>[number];

export function NewsCard({
  item,
  featured = false,
}: {
  item: NewsItem;
  featured?: boolean;
}) {
  const { t, lang } = useI18n();

  return (
    <Link
      to={`/noticias/${item.id}`}
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-muted ${
          featured
            ? "aspect-[4/3] sm:aspect-[16/9]"
            : "aspect-[4/3] sm:aspect-[16/10]"
        }`}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 max-w-[calc(100%-24px)] rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-primary sm:left-4 sm:top-4">
          {t(`news.categories.${item.category}`)}
        </span>

        {item.category === "videos" && (
          <PlayCircle className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          {new Date(item.date).toLocaleDateString(
            lang === "es" ? "es-BO" : "en-US",
            {
              timeZone: "UTC",
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </span>

        <h3 className="font-display text-xl leading-snug text-brand-deep group-hover:text-primary sm:text-2xl">
          {item.title}
        </h3>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.text}
        </p>

        <span className="flex items-center justify-between gap-3 text-sm font-semibold text-primary">
          {t("news.read")}
          <ArrowUpRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function RelatedNews({
  programId,
}: {
  programId: string;
}) {
  const { lang } = useI18n();
  const es = lang === "es";

  const items = useNewsItems().filter(
    (item) => item.programId === programId
  );

  if (!items.length) return null;

  return (
    <section
      id="noticias-relacionadas"
      className="mt-12 border-t border-border pt-8 sm:mt-14 sm:pt-10"
    >
      <h2 className="mb-3 font-display text-2xl text-brand-deep sm:text-3xl">
        {es ? "Noticias del programa" : "Program news"}
      </h2>

      <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {es
          ? "Conoce las últimas historias y actividades relacionadas con este programa."
          : "Discover stories and activities related to this program."}
      </p>

      <div
        aria-label={es ? "Noticias relacionadas" : "Related news"}
        className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex w-[86%] max-w-[370px] shrink-0 snap-center sm:w-auto sm:max-w-none"
          >
            <div className="w-full">
              <NewsCard item={item} />
            </div>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
          {es
            ? "Desliza para ver más noticias"
            : "Swipe to see more news"}
          <ArrowRight className="size-4" />
        </p>
      )}
    </section>
  );
}
