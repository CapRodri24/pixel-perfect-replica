
import {
  Handshake,
  Building2,
  Globe2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "socios-financieros",
    icon: Globe2,
    es: "Socios y financieros",
    en: "Partners and funders",
    textEs: "Organizaciones que contribuyen con recursos al desarrollo de iniciativas de conservación.",
    textEn: "Organizations contributing resources to conservation initiatives.",
    names: ["Fundación Ejemplo A", "Cooperación Ejemplo B", "Fondo Ejemplo C"],
  },
  {
    id: "aliados-estrategicos",
    icon: Handshake,
    es: "Aliados estratégicos",
    en: "Strategic allies",
    textEs: "Instituciones con las que articulamos conocimiento, capacidades y acciones conjuntas.",
    textEn: "Institutions with which we share knowledge, capabilities and joint actions.",
    names: ["Universidad Ejemplo A", "Red Ejemplo B", "Organización Ejemplo C"],
  },
  {
    id: "miembros-corporativos",
    icon: Building2,
    es: "Miembros corporativos",
    en: "Corporate members",
    textEs: "Empresas interesadas en contribuir a la conservación y la sostenibilidad.",
    textEn: "Companies interested in supporting conservation and sustainability.",
    names: ["Empresa Ejemplo A", "Empresa Ejemplo B", "Empresa Ejemplo C"],
  },
];

export default function Socios() {
  const { lang } = useI18n();
  const es = lang === "es";
  const { hash } = useLocation();

  return (
    <section
      id="socios"
      className="section scroll-mt-24 overflow-hidden bg-muted"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow={es ? "Colaboración" : "Collaboration"}
          title={es ? "Socios y aliados" : "Partners and allies"}
          text={
            es
              ? "La conservación es un esfuerzo compartido. Trabajamos con organizaciones e instituciones que contribuyen a una misión común."
              : "Conservation is a shared effort. We work with organizations and institutions contributing to a common mission."
          }
        />

        <nav
          aria-label={es ? "Tipos de aliados" : "Partner categories"}
          className="mt-7 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-visible"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const active = hash === `#${category.id}`;

            return (
              <Link
                key={category.id}
                to={`/nosotros#${category.id}`}
                aria-current={active ? "location" : undefined}
                className={`armonia-subindice flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-brand-deep hover:border-primary hover:bg-secondary"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                <span>{es ? category.es : category.en}</span>
                <ArrowDown className="size-3 shrink-0" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-7 grid gap-5 sm:mt-9 sm:gap-6">
          {categories.map(
            ({
              id,
              icon: Icon,
              es: labelEs,
              en,
              textEs,
              textEn,
              names,
            }) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary sm:size-12">
                    <Icon className="size-6" />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-brand-deep sm:text-3xl">
                      {es ? labelEs : en}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {es ? textEs : textEn}
                    </p>
                  </div>
                </div>

                <div
                  aria-label={es ? labelEs : en}
                  className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0"
                  style={{
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {names.map((name, i) => (
                    <article
                      key={name}
                      className="flex min-h-44 w-[78%] max-w-[270px] shrink-0 snap-center flex-col items-center justify-center rounded-2xl border border-border bg-muted/40 p-5 text-center sm:min-h-32 sm:w-auto sm:max-w-none"
                    >
                      <div
                        aria-hidden="true"
                        className="grid size-14 place-items-center rounded-full border border-primary/20 bg-secondary text-xl font-bold text-primary sm:size-12"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-brand-deep">
                        {es
                          ? name
                          : `Example organization ${String.fromCharCode(65 + i)}`}
                      </p>

                      <span className="mt-1 text-[10px] text-muted-foreground">
                        {es ? "Logotipo provisional" : "Placeholder logo"}
                      </span>
                    </article>
                  ))}
                </div>

                <p className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                  {es ? "Desliza para ver más" : "Swipe to see more"}
                  <ArrowRight className="size-4" />
                </p>
              </section>
            )
          )}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:p-7">
          <div>
            <h3 className="text-2xl font-semibold">
              {es ? "Construyamos nuevas alianzas" : "Build new partnerships"}
            </h3>

            <p className="mt-2 text-sm opacity-90">
              {es
                ? "Conoce cómo tu organización puede participar."
                : "Discover how your organization can get involved."}
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-white/50 bg-white text-primary hover:bg-white/90 hover:text-primary"
          >
            <Link to="/contacto">
              {es ? "Contáctanos" : "Contact us"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
