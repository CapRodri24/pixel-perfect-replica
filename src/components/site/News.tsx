import { useMemo, useState } from "react";
import { Search, Calendar, PlayCircle, ArrowRight, X } from "lucide-react";
import { landscapes, news, newsCategories, programs, type NewsCategory } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

const selectCls = "h-11 w-full rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function News() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<NewsCategory | "all">("all");
  const [land, setLand] = useState("all");
  const [prog, setProg] = useState("all");

  const list = useMemo(() => news.filter((n) => {
    const text = `${t(`news.items.${n.id}.title`)} ${t(`news.items.${n.id}.text`)}`.toLowerCase();
    return (cat === "all" || n.category === cat) && (land === "all" || n.landscape === land) && (prog === "all" || n.program === prog) && text.includes(q.trim().toLowerCase());
  }), [q, cat, land, prog, t]);
  const reset = () => { setQ(""); setCat("all"); setLand("all"); setProg("all"); };
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(lang === "es" ? "es-BO" : "en-US", { day: "numeric", month: "short", year: "numeric" });

  return (
    <section id="noticias" className="section bg-muted">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={t("news.eyebrow")} title={t("news.title")} />
          <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{t("news.demo")}</span>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative">
            <span className="sr-only">{t("news.search")}</span>
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("news.search")} className={`${selectCls} pl-11`} />
          </label>
          <select aria-label={t("news.landscape")} value={land} onChange={(e) => setLand(e.target.value)} className={selectCls}>
            <option value="all">{t("news.allLandscapes")}</option>
            {landscapes.map((l) => <option key={l.id} value={l.id}>{t(`landscapes.items.${l.id}.name`)}</option>)}
          </select>
          <select aria-label={t("news.program")} value={prog} onChange={(e) => setProg(e.target.value)} className={selectCls}>
            <option value="all">{t("news.allPrograms")}</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{t(`programs.items.${p.id}.name`)}</option>)}
          </select>
        </div>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {(["all", ...newsCategories] as const).map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:text-primary"}`}>
              {c === "all" ? t("news.allCategories") : t(`news.categories.${c}`)}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-background p-12 text-center">
            <p className="text-muted-foreground">{t("news.empty")}</p>
            <Button variant="outline" className="mt-4" onClick={reset}><X /> {t("news.clear")}</Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((n, i) => (
              <article key={n.id} className={`${n.landscape ? `theme-${n.landscape}` : ""} group flex flex-col overflow-hidden rounded-3xl bg-background transition-all hover:-translate-y-1 hover:shadow-card ${i === 0 && list.length > 3 ? "sm:col-span-2 lg:row-span-2" : ""}`}>
                <div className="relative overflow-hidden">
                  <img src={n.image} alt="" loading="lazy" width={1600} height={1008} className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 && list.length > 3 ? "aspect-[16/10] lg:aspect-[4/3]" : "aspect-[16/10]"}`} />
                  {n.category === "videos" && <PlayCircle className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-primary-foreground drop-shadow-lg" />}
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-brand-deep backdrop-blur">{t(`news.categories.${n.category}`)}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" /> {fmt(n.date)}
                    {n.landscape && <><span className="ml-1 size-2 rounded-full bg-lp" />{t(`landscapes.items.${n.landscape}.name`)}</>}
                  </div>
                  <h3 className={`mt-3 leading-snug text-brand-deep ${i === 0 && list.length > 3 ? "text-2xl" : "text-lg"}`}>{t(`news.items.${n.id}.title`)}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(`news.items.${n.id}.text`)}</p>
                  <a href="#noticias" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">{t("news.read")} <ArrowRight className="size-4" /></a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
