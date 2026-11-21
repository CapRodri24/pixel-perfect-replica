
import {
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Microscope,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

export default function Oportunidades() {
  const { lang } = useI18n();
  const es = lang === "es";

  const items = [
    {
      icon: Briefcase,
      title: es ? "Convocatorias laborales" : "Job opportunities",
      text: es
        ? "Ejemplo de convocatoria para especialistas en conservación y gestión de proyectos."
        : "Sample opening for conservation and project management specialists.",
    },
    {
      icon: HeartHandshake,
      title: es ? "Voluntariado" : "Volunteering",
      text: es
        ? "Ejemplo de actividades de apoyo a monitoreo, restauración y educación ambiental."
        : "Sample activities supporting monitoring, restoration and environmental education.",
    },
    {
      icon: GraduationCap,
      title: es ? "Prácticas profesionales" : "Internships",
      text: es
        ? "Ejemplo de espacios formativos para estudiantes y recién graduados."
        : "Sample learning opportunities for students and recent graduates.",
    },
    {
      icon: Microscope,
      title: es ? "Investigación y tesis" : "Research and theses",
      text: es
        ? "Ejemplo de colaboración académica vinculada con aves, hábitats y comunidades."
        : "Sample academic collaboration on birds, habitats and communities.",
    },
  ];

  return (
    <section
      id="oportunidades"
      className="section scroll-mt-24 overflow-hidden"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow={es ? "Participa" : "Get involved"}
          title={es ? "Oportunidades" : "Opportunities"}
          text={
            es
              ? "Conoce las formas de aportar tu experiencia, tiempo y conocimiento a la conservación."
              : "Explore ways to contribute your experience, time and knowledge to conservation."
          }
        />

        <p className="mt-3 text-xs text-muted-foreground">
          {es
            ? "Contenido de demostración. No corresponde a convocatorias vigentes."
            : "Demo content. These are not active openings."}
        </p>

        <div
          aria-label={es ? "Tipos de oportunidades" : "Opportunity types"}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="flex w-[85%] max-w-[370px] shrink-0 snap-center flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-colors hover:border-primary/50 sm:w-auto sm:max-w-none sm:p-8"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-6" />
              </span>

              <h3 className="mt-5 text-2xl font-semibold text-brand-deep">
                {title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {text}
              </p>

              <Button asChild variant="outline" className="mt-6 w-fit">
                <Link to="/contacto">
                  {es ? "Consultar" : "Ask for information"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground sm:hidden">
          <span>
            {es ? "Desliza para explorar oportunidades" : "Swipe to explore opportunities"}
          </span>
          <ArrowRight className="size-4" />
        </div>
      </div>
    </section>
  );
}
