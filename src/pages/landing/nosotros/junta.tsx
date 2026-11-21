
import { UserRound, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";

const members = [
  { name: "María Ejemplo", es: "Presidencia", en: "President" },
  { name: "Carlos Ejemplo", es: "Vicepresidencia", en: "Vice president" },
  { name: "Ana Ejemplo", es: "Secretaría", en: "Secretary" },
  { name: "Luis Ejemplo", es: "Tesorería", en: "Treasurer" },
  { name: "Elena Ejemplo", es: "Vocal", en: "Board member" },
  { name: "Miguel Ejemplo", es: "Vocal", en: "Board member" },
];

export default function Junta() {
  const { lang } = useI18n();
  const es = lang === "es";

  return (
    <section
      id="junta-directiva"
      className="section scroll-mt-24 overflow-hidden bg-muted"
    >
      <div className="container-site">
        <SectionHeading
          eyebrow={es ? "Gobernanza" : "Governance"}
          title={es ? "Junta directiva" : "Board of directors"}
          text={
            es
              ? "El equipo que orienta la dirección estratégica y supervisa la gestión institucional."
              : "The team that guides strategic direction and oversees institutional management."
          }
        />

        <p className="mt-3 text-xs text-muted-foreground">
          {es ? "Perfiles ficticios de demostración." : "Fictional demonstration profiles."}
        </p>

        <div
          aria-label={es ? "Integrantes de la junta directiva" : "Board members"}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {members.map((member) => (
            <article
              key={member.name}
              className="group w-[85%] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-transform motion-safe:hover:-translate-y-1 sm:w-auto sm:max-w-none"
            >
              <div className="grid aspect-[4/3] place-items-center bg-linear-to-br from-secondary to-brand-light/30 sm:aspect-[16/9]">
                <UserRound
                  className="size-20 text-primary/50"
                  strokeWidth={1.2}
                />
              </div>

              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {es ? member.es : member.en}
                </span>

                <h3 className="mt-2 text-2xl font-semibold text-brand-deep">
                  {member.name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {es
                    ? "Perfil de ejemplo para presentar experiencia profesional y trayectoria institucional."
                    : "Sample profile for professional experience and institutional background."}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground sm:hidden">
          <span>
            {es ? "Desliza para conocer a la junta" : "Swipe to meet the board"}
          </span>
          <ArrowRight className="size-4" />
        </div>
      </div>
    </section>
  );
}
