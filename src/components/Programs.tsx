import { useState } from "react";
import { landscapes, programs, type LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { ProgramCard } from "./ProgramCard";

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
