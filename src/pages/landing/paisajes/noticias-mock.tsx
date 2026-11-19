import { ArrowUpRight, Calendar, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { news } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";

// Relaciones de demostración. null representa una noticia independiente.
const programIds: Readonly<Record<string, string | null>> = {
  n1: "barbaazul", n2: "palkachupa", n3: "tunari", n4: "frenteroja",
  n5: null, n6: "tororoi", n7: null, n8: "barbaazul",
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

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const { t, lang } = useI18n();
  return (
    <Link to={`/noticias/${item.id}`} className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${featured ? "sm:col-span-2" : ""}`}>
      <div className={`relative overflow-hidden bg-muted ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <img src={item.image} alt={item.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
        <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-primary">{t(`news.categories.${item.category}`)}</span>
        {item.category === "videos" && <PlayCircle className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg" />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="size-4" />{new Date(item.date).toLocaleDateString(lang === "es" ? "es-BO" : "en-US", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}</span>
        <h3 className="font-display text-xl leading-tight text-brand-deep group-hover:text-primary sm:text-2xl">{item.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
        <span className="flex items-center justify-between text-sm font-semibold text-primary">{t("news.read")}<ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </div>
    </Link>
  );
}

export function RelatedNews({ programId }: { programId: string }) {
  const { lang } = useI18n();
  const items = useNewsItems().filter(item => item.programId === programId);
  if (!items.length) return null;
  return <section id="noticias-relacionadas" className="mt-14 border-t border-border pt-10">
    <h2 className="mb-3 font-display text-2xl text-brand-deep sm:text-3xl">{lang === "es" ? "Noticias del programa" : "Program news"}</h2>
    <p className="mb-6 text-muted-foreground">{lang === "es" ? "Conoce las últimas historias y actividades relacionadas con este programa." : "Discover stories and activities related to this program."}</p>
    <div className="grid gap-5 sm:grid-cols-2">{items.map(item => <NewsCard key={item.id} item={item} />)}</div>
  </section>;
}
