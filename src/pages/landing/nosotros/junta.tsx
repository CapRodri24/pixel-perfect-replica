import { UserRound } from "lucide-react";
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
    <section id="junta-directiva" className="section bg-muted">
      <div className="container-site">
        <SectionHeading eyebrow={es ? "Gobernanza" : "Governance"} title={es ? "Junta directiva" : "Board of directors"} text={es ? "El equipo que orienta la dirección estratégica y supervisa la gestión institucional." : "The team that guides strategic direction and oversees institutional management."} />
        <p className="mt-3 text-xs text-muted-foreground">{es ? "Perfiles ficticios de demostración." : "Fictional demonstration profiles."}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => <article key={member.name} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"><div className="grid aspect-[16/9] place-items-center bg-linear-to-br from-secondary to-brand-light/30"><UserRound className="size-16 text-primary/50" strokeWidth={1.2} /></div><div className="p-6"><span className="text-xs font-bold uppercase tracking-wider text-primary">{es ? member.es : member.en}</span><h3 className="mt-2 text-2xl text-brand-deep">{member.name}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{es ? "Perfil de ejemplo para presentar experiencia profesional y trayectoria institucional." : "Sample profile for professional experience and institutional background."}</p></div></article>)}
        </div>
      </div>
    </section>
  );
}
