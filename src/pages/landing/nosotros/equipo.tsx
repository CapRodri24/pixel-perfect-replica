
import { useState } from "react";
import { UserRound, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";

const groups = [
  { id: "all", es: "Todos", en: "All" },
  { id: "direction", es: "Dirección", en: "Management" },
  { id: "programs", es: "Programas", en: "Programs" },
  { id: "support", es: "Áreas de apoyo", en: "Support teams" },
];

const team = [
  { name: "Lucía Ejemplo", group: "direction", es: "Dirección ejecutiva", en: "Executive director" },
  { name: "Pedro Ejemplo", group: "direction", es: "Dirección de conservación", en: "Conservation director" },
  { name: "Sofía Ejemplo", group: "programs", es: "Coordinación Pastizales del Beni", en: "Beni Grasslands coordinator" },
  { name: "Diego Ejemplo", group: "programs", es: "Coordinación Andes Altos", en: "High Andes coordinator" },
  { name: "Valeria Ejemplo", group: "programs", es: "Especialista de campo", en: "Field specialist" },
  { name: "Andrés Ejemplo", group: "support", es: "Administración", en: "Administration" },
  { name: "Camila Ejemplo", group: "support", es: "Comunicación", en: "Communications" },
  { name: "Gabriel Ejemplo", group: "support", es: "Gestión de proyectos", en: "Project management" },
];

export default function Equipo() {
  const { lang } = useI18n();
  const es = lang === "es";
  const [filter, setFilter] = useState("all");

  const visible = team.filter(
    (person) => filter === "all" || person.group === filter
  );

  return (
    <section id="equipo" className="section scroll-mt-24 overflow-hidden">
      <div className="container-site">
        <SectionHeading
          eyebrow={es ? "Personas" : "People"}
          title={es ? "Nuestro equipo" : "Our team"}
          text={
            es
              ? "Profesionales de distintas disciplinas unidos por una misión de conservación."
              : "Professionals from different disciplines united by a conservation mission."
          }
        />

        <p className="mt-3 text-xs text-muted-foreground">
          {es ? "Perfiles ficticios de demostración." : "Fictional demonstration profiles."}
        </p>

        <div
          role="group"
          aria-label={es ? "Filtrar equipo" : "Filter team"}
          className="mt-7 flex gap-2 overflow-x-auto pb-3 sm:flex-wrap sm:overflow-visible"
          style={{ scrollbarWidth: "none" }}
        >
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-pressed={filter === group.id}
              onClick={() => setFilter(group.id)}
              className={`armonia-subindice flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                filter === group.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-brand-deep hover:bg-secondary"
              }`}
            >
              <UserRound className="size-4 shrink-0" aria-hidden="true" />
              {es ? group.es : group.en}
            </button>
          ))}
        </div>

        <div
          key={filter}
          aria-label={es ? "Perfiles del equipo" : "Team profiles"}
          className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-4"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {visible.map((person) => (
            <article
              key={person.name}
              className="w-[78%] max-w-[310px] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:w-auto sm:max-w-none"
            >
              <div className="grid aspect-[4/3] place-items-center bg-muted sm:aspect-square">
                <UserRound
                  className="size-20 text-primary/40"
                  strokeWidth={1.2}
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-brand-deep">
                  {person.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {es ? person.es : person.en}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground sm:hidden">
          <span>{es ? "Desliza para conocer al equipo" : "Swipe to meet the team"}</span>
          <ArrowRight className="size-4" />
        </div>
      </div>
    </section>
  );
}
