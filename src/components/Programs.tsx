import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { landscapes, programs, type LandscapeId, type ProgramId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

// --- TARJETA DE PROGRAMA (Fusionada aquí) ---
function ProgramCard({ id, landscape, image }: { id: ProgramId; landscape: LandscapeId | null; image: string }) {
  const { t } = useI18n();
  return (
    <article className={`${landscape ? `theme-${landscape}` : ""} group flex h-full flex-col overflow-hidden rounded-3xl bg-lp-soft transition-all hover:-translate-y-1 hover:shadow-card`}>
      <div className="overflow-hidden">
        <img src={image} alt="" loading="lazy" width={1600} height={1008} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-lp px-3 py-1 text-xs font-semibold text-primary-foreground">
          {landscape ? t(`landscapes.items.${landscape}.name`) : t("programs.national")}
        </span>
        <h3 className="mt-4 text-xl text-brand-deep">{t(`programs.items.${id}.name`)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`programs.items.${id}.text`)}</p>
        <Button asChild variant="ghost" className="mt-5 w-fit px-0">
          <Link to={`/programas/${id}`}>
            {t("programs.more")} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

// --- COMPONENTE PRINCIPAL DE PROGRAMAS ---
export function Programs() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<LandscapeId | "all" | "national">("all");
  const list = programs.filter((p) => filter === "all" || (filter === "national" ? !p.landscape : p.landscape === filter));
  
  const chips: { id: typeof filter; label: string }[] = [
    { id: "all", label: t("programs.all") },
    ...landscapes.map((l) => ({ id: l.id, label: t(`landscapes.items.${l.id}.name`) })),
    { id: "national", label: t("programs.national") },
  ];

  return (
    <section id="programas" className="section">
      <div className="container-site">
        <SectionHeading eyebrow={t("programs.eyebrow")} title={t("programs.title")} text={t("programs.text")} />
        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
          {chips.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)} aria-pressed={filter === c.id}
              className={`${c.id !== "all" && c.id !== "national" ? `theme-${c.id}` : ""} flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${filter === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:text-primary"}`}>
              {c.id !== "all" && c.id !== "national" && <span className="size-2.5 rounded-full bg-lp" />}{c.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProgramCard key={p.id} {...p} />)}
        </div>
      </div>
    </section>
  );
}