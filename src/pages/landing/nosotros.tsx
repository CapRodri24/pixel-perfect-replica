
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDown,
  Compass,
  Landmark,
  Users,
  Handshake,
  Briefcase,
} from "lucide-react";
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

      target?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  return (
    <main id="nosotros" className="min-h-[70vh] overflow-x-clip">
      <section className="relative isolate overflow-hidden bg-overlay text-white">
        <img
          src="/images/home/2.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/20" />

        <div className="container-site flex min-h-[340px] flex-col justify-center py-12 sm:min-h-[440px] sm:py-20">
          <Link
            to="/"
            className="mb-7 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {es ? "Inicio" : "Home"}
          </Link>

          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand-light">
            {t("brand.name")}
          </span>

          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-6xl lg:text-7xl">
            {es ? "Nosotros" : "About us"}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-lg">
            {t("about.text")}
          </p>
        </div>
      </section>

      <nav
        aria-label={es ? "Secciones de Nosotros" : "About us sections"}
        className="border-b border-border bg-background"
      >
        <div className="container-site py-4 sm:py-5">
          <div
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {sections.map(({ id, es: labelEs, en, icon: Icon }) => {
              const active =
                (!location.hash && id === "quienes-somos") ||
                location.hash === `#${id}` ||
                (id === "socios" &&
                  [
                    "#socios-financieros",
                    "#aliados-estrategicos",
                    "#miembros-corporativos",
                  ].includes(location.hash));

              return (
                <Link
                  key={id}
                  to={`/nosotros#${id}`}
                  aria-current={active ? "location" : undefined}
                  className={`armonia-subindice group flex min-h-12 shrink-0 snap-start items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors sm:shrink sm:px-3 ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-brand-deep hover:border-primary hover:bg-secondary"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="flex-1 whitespace-nowrap sm:whitespace-normal">
                    {es ? labelEs : en}
                  </span>
                  <ArrowDown className="hidden size-3 shrink-0 lg:block" />
                </Link>
              );
            })}
          </div>

          <p className="mt-1 text-center text-[11px] text-muted-foreground sm:hidden">
            {es ? "Desliza para explorar las secciones" : "Swipe to explore sections"}
          </p>
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
