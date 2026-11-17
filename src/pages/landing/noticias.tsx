import { useMemo, useState, useEffect } from "react";
import { Search, Calendar, PlayCircle, ArrowRight, X, ArrowLeft } from "lucide-react";
import { landscapes, news, newsCategories, programs, type NewsCategory } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionView } from "@/components/SectionView";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";

const selectCls = "h-11 w-full rounded-full border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

// ==========================================
// 1. COMPONENTE DE LA LISTA (Página principal de noticias)
// ==========================================
export function Noticias() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<NewsCategory | "all">("all");

  const all = useMemo(() => news.map((n) => ({ ...n, title: t<string>(`news.items.${n.id}.title`), text: t<string>(`news.items.${n.id}.text`) })), [t]);
  const list = useMemo(() => all.filter((n) => {
    const text = `${n.title} ${n.text}`.toLowerCase();
    return (cat === "all" || n.category === cat) && text.includes(q.trim().toLowerCase());
  }), [q, cat, all]);
  const reset = () => { setQ(""); setCat("all"); };
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(lang === "es" ? "es-BO" : "en-US", { day: "numeric", month: "short", year: "numeric" });

  const title = lang === "es" ? "Noticias" : "News";

  return (
    <SectionView title={title}>
      <div className="container-site pb-16 pt-8">
        {/* FILTROS */}
        <div className="grid gap-3 md:grid-cols-1">
          <label className="relative">
            <span className="sr-only">{t("news.search")}</span>
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("news.search")} className={`${selectCls} pl-11`} />
          </label>
        </div>
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {(["all", ...newsCategories] as const).map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${cat === c ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:text-primary"}`}>
              {c === "all" ? t("news.allCategories") : t(`news.categories.${c}`)}
            </button>
          ))}
        </div>

        {/* LISTA DE NOTICIAS */}
        {list.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-background p-12 text-center border">
            <p className="text-muted-foreground">{t("news.empty")}</p>
            <Button variant="outline" className="mt-4" onClick={reset}><X /> {t("news.clear")}</Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((n, i) => (
              <article key={n.id} className={`group flex flex-col overflow-hidden rounded-3xl bg-background transition-all hover:-translate-y-1 hover:shadow-card border border-border ${i === 0 && list.length > 3 ? "sm:col-span-2 lg:row-span-2" : ""}`}>
                <div className="relative overflow-hidden">
                  <img src={n.image} alt="" loading="lazy" width={1600} height={1008} className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 && list.length > 3 ? "aspect-[16/10] lg:aspect-[4/3]" : "aspect-[16/10]"}`} />
                  {(n.category === "videos") && <PlayCircle className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-primary-foreground drop-shadow-lg" />}
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-brand-deep backdrop-blur">{t(`news.categories.${n.category}`)}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" /> {fmt(n.date)}
                  </div>
                  <h3 className={`mt-3 leading-snug text-brand-deep ${i === 0 && list.length > 3 ? "text-2xl" : "text-lg"}`}>{n.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{n.text}</p>
                  <Button asChild variant="ghost" className="mt-4 w-fit px-0">
                    <Link to={`/noticias/${n.id}`}>{t("news.read")} <ArrowRight className="size-4" /></Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SectionView>
  );
}

// ==========================================
// 2. COMPONENTE DE DETALLE (Página de una noticia individual)
// ==========================================
export function NoticiaDetalle() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  
  const item = news.find((n) => n.id === id);

  useEffect(() => {
    if (!item) {
      navigate("/noticias", { replace: true });
    }
  }, [item, navigate]);

  if (!item) return null;

  return (
    <main className="pb-16">
      <div className="container-site py-6">
        <Button asChild variant="ghost">
          <Link to="/noticias">
            <ArrowLeft />
            {lang === "es" ? "Volver a noticias" : "Back to news"}
          </Link>
        </Button>
      </div>
      <article>
        <div className="container-site max-w-5xl">
          <p className="text-sm font-semibold uppercase text-primary">
            {lang === "es" ? "Noticias" : "News"}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-tight text-brand-deep sm:text-5xl">
            {t(`news.items.${item.id}.title`)}
          </h1>
          <time className="mt-4 block text-sm text-muted-foreground" dateTime={item.date}>
            {new Date(item.date + "T12:00:00").toLocaleDateString(lang === "es" ? "es-BO" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <img src={item.image} alt={t(`news.items.${item.id}.title`)} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">
              {t(`news.items.${item.id}.text`)}
            </p>
            {item.landscape && (
              <Button asChild variant="outline" className="mt-8">
                <Link to="/paisajes" state={{ hash: "paisajes" }}>
                  {t(`landscapes.items.${item.landscape}.name`)}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}