import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowDown, Compass, Landmark, Users, Handshake, Briefcase } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import QuienesSomos from "./nosotros/quienessomos";
import Junta from "./nosotros/junta";
import Equipo from "./nosotros/equipo";
import Socios from "./nosotros/socios";
import Oportunidades from "./nosotros/oportunidades";

const sections = [
  { id: "quienes-somos", es: "Quiénes somos", en: "Who we are", icon: Compass },
  { id: "junta-directiva", es: "Junta directiva", en: "Board of directors", icon: Landmark },
  { id: "equipo", es: "Nuestro equipo", en: "Our team", icon: Users },
  { id: "socios", es: "Socios y aliados", en: "Partners and allies", icon: Handshake },
  { id: "oportunidades", es: "Oportunidades", en: "Opportunities", icon: Briefcase },
];

export default function Nosotros() {
  const { lang, t } = useI18n();
  const es = lang === "es";
  const location = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!location.hash) {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  return (
    <main id="nosotros" className="min-h-[70vh]">
      <section className="relative isolate overflow-hidden bg-overlay text-white">
        <img src="/images/home/2.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/20" />
        <div className="container-site flex min-h-[390px] flex-col justify-center py-14 sm:min-h-[440px] sm:py-20">
          <Link to="/" className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white"><ArrowLeft className="size-4" />{es ? "Inicio" : "Home"}</Link>
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand-light">{t("brand.name")}</span>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">{es ? "Nosotros" : "About us"}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{t("about.text")}</p>
        </div>
      </section>
      <nav aria-label={es ? "Secciones de Nosotros" : "About us sections"} className="border-b border-border bg-background">
        <div className="container-site grid grid-cols-2 gap-2 py-5 sm:grid-cols-3 lg:grid-cols-5">
          {sections.map(({ id, es: labelEs, en, icon: Icon }) => {
            const active = (!location.hash && id === "quienes-somos") || location.hash === `#${id}` || (id === "socios" && ["#socios-financieros", "#aliados-estrategicos", "#miembros-corporativos"].includes(location.hash));
            return <Link key={id} to={`/nosotros#${id}`} aria-current={active ? "location" : undefined} className={`armonia-subindice group flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-brand-deep hover:border-primary hover:bg-secondary"}`}><Icon className="size-5 shrink-0" /><span className="flex-1">{es ? labelEs : en}</span><ArrowDown className="hidden size-3 shrink-0 lg:block" /></Link>;
          })}
        </div>
      </nav>
      <QuienesSomos />
      <Junta />
      <Equipo />
      <Socios />
      <Oportunidades />
    </main>
  );
}
