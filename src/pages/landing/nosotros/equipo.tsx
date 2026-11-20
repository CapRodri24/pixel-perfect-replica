import { useState } from "react";
import { UserRound } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";

const groups = [ { id: "all", es: "Todos", en: "All" }, { id: "direction", es: "Dirección", en: "Management" }, { id: "programs", es: "Programas", en: "Programs" }, { id: "support", es: "Áreas de apoyo", en: "Support teams" } ];
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
  const visible = team.filter((person) => filter === "all" || person.group === filter);
  return (
    <section id="equipo" className="section">
      <div className="container-site">
        <SectionHeading eyebrow={es ? "Personas" : "People"} title={es ? "Nuestro equipo" : "Our team"} text={es ? "Profesionales de distintas disciplinas unidos por una misión de conservación." : "Professionals from different disciplines united by a conservation mission."} />
        <p className="mt-3 text-xs text-muted-foreground">{es ? "Perfiles ficticios de demostración." : "Fictional demonstration profiles."}</p>
        <div role="group" aria-label={es ? "Filtrar equipo" : "Filter team"} className="mt-7 flex flex-wrap gap-2">{groups.map((group) => <button key={group.id} type="button" aria-pressed={filter === group.id} onClick={() => setFilter(group.id)} className={`armonia-subindice rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${filter === group.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-brand-deep hover:bg-secondary"}`}><UserRound className="size-4 shrink-0" aria-hidden="true"/>{es ? group.es : group.en}</button>)}</div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{visible.map((person) => <article key={person.name} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"><div className="grid aspect-square place-items-center bg-muted"><UserRound className="size-14 text-primary/40 sm:size-20" strokeWidth={1.2} /></div><div className="p-4 sm:p-5"><h3 className="text-lg text-brand-deep sm:text-xl">{person.name}</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{es ? person.es : person.en}</p></div></article>)}</div>
      </div>
    </section>
  );
}
