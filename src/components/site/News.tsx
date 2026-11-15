import { useMemo, useState } from "react";
import { Search, Calendar, PlayCircle, ArrowRight, X } from "lucide-react";
import { landscapes, news, newsCategories, programs, type NewsCategory } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { pick, useContent, youtubeId } from "@/lib/cms";
import { images } from "@/config/images";
import { useLandscapeLabel } from "./DynCard";

const selectCls = "h-11 w-full rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function News() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<NewsCategory | "all">("all");
  const [land, setLand] = useState("all");
  const [prog, setProg] = useState("all");

  const { data = [] } = useContent();
  const landLabel = useLandscapeLabel();
  const [open, setOpen] = useState<string | null>(null);
  const dynLandscapes = data.filter((d) => d.kind === "landscape");
  const all = useMemo(() => [
    ...data.filter((d) => d.kind === "news").map((d) => ({
      id: d.id, category: (youtubeId(d.youtube_url) ? "videos" : "institutional") as NewsCategory, landscape: d.landscape_ref, program: null as string | null,
      date: d.created_at.slice(0, 10), image: d.images[0] ?? (youtubeId(d.youtube_url) ? `https://img.youtube.com/vi/${youtubeId(d.youtube_url)}/hqdefault.jpg` : images.hero),
      title: pick(d, "title", lang), text: pick(d, "body", lang), youtube: youtubeId(d.youtube_url), gallery: d.images, dyn: true,
    })),
    ...news.map((n) => ({ ...n, landscape: n.landscape as string | null, program: n.program as string | null, title: t(`news.items.${n.id}.title`), text: t(`news.items.${n.id}.text`), youtube: null as string | null, gallery: [] as string[], dyn: false })),
  ], [data, lang, t]);
  const opened = all.find((n) => n.id === open);
  const list = useMemo(() => all.filter((n) => {
    const text = `${n.title} ${n.text}`.toLowerCase();
    return (cat === "all" || n.category === cat) && (land === "all" || n.landscape === land) && (prog === "all" || n.program === prog) && text.includes(q.trim().toLowerCase());
  }), [q, cat, land, prog, all]);
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
            {dynLandscapes.map((l) => <option key={l.id} value={l.id}>{pick(l, "title", lang)}</option>)}
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
              <article key={n.id} className={`${landLabel(n.landscape)?.theme ?? ""} group flex flex-col overflow-hidden rounded-3xl bg-background transition-all hover:-translate-y-1 hover:shadow-card ${i === 0 && list.length > 3 ? "sm:col-span-2 lg:row-span-2" : ""}`}>
                <div className="relative overflow-hidden">
                  <img src={n.image} alt="" loading="lazy" width={1600} height={1008} className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 && list.length > 3 ? "aspect-[16/10] lg:aspect-[4/3]" : "aspect-[16/10]"}`} />
                  {(n.category === "videos" || n.youtube) && <PlayCircle className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-primary-foreground drop-shadow-lg" />}
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-brand-deep backdrop-blur">{t(`news.categories.${n.category}`)}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" /> {fmt(n.date)}
                    {n.landscape && <><span className="ml-1 size-2 rounded-full bg-lp" />{landLabel(n.landscape)?.name}</>}
                  </div>
                  <h3 className={`mt-3 leading-snug text-brand-deep ${i === 0 && list.length > 3 ? "text-2xl" : "text-lg"}`}>{n.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.text}</p>
                  <button onClick={() => setOpen(n.id)} className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary">{t("news.read")} <ArrowRight className="size-4" /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {opened && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] flex items-center justify-center bg-overlay/70 p-4" onClick={() => setOpen(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-background" onClick={(e) => e.stopPropagation()}>
            {opened.youtube ? (
              <div className="aspect-video w-full"><iframe className="size-full" src={`https://www.youtube.com/embed/${opened.youtube}`} title={opened.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
            ) : <img src={opened.image} alt="" className="aspect-[16/9] w-full object-cover" />}
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl text-brand-deep sm:text-3xl">{opened.title}</h3>
                <Button variant="ghost" size="icon" onClick={() => setOpen(null)} aria-label="×"><X /></Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{fmt(opened.date)}{landLabel(opened.landscape) ? ` · ${landLabel(opened.landscape)?.name}` : ""}</p>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground">{opened.text}</p>
              {opened.gallery.length > (opened.youtube ? 0 : 1) && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {opened.gallery.slice(opened.youtube ? 0 : 1).map((src) => <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
