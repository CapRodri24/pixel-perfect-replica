import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { landscapes, programs, type LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { LandscapeCard } from "./LandscapeCard";
import { ProgramCard } from "./ProgramCard";
import { Button } from "@/components/ui/button";

export function Landscapes() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<LandscapeId | null>(null);
  const select = (id: LandscapeId | null) => {
    setSelected(id);
    document.getElementById("paisajes")?.scrollIntoView({ behavior: "smooth" });
  };
  const current = landscapes.find((l) => l.id === selected);

  return (
    <section id="paisajes" className="section bg-muted">
      <div className="container-site">
        {!current ? (
          <>
            <SectionHeading eyebrow={t("landscapes.eyebrow")} title={t("landscapes.title")} text={t("landscapes.text")} />
            <div className="mt-12 grid auto-rows-[minmax(22rem,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {landscapes.map((l, i) => <LandscapeCard key={l.id} {...l} featured={i === 0} onSelect={() => select(l.id)} />)}
            </div>
          </>
        ) : (
          <div className={`theme-${current.id} animate-rise`}>
            <Button variant="ghost" onClick={() => select(null)}><ArrowLeft /> {t("landscapes.back")}</Button>
            <div className="mt-4 grid overflow-hidden rounded-3xl bg-lp-soft lg:grid-cols-2">
              <img src={current.image} alt={t(`landscapes.items.${current.id}.name`)} width={1600} height={1008} className="aspect-[16/10] size-full object-cover lg:aspect-auto" />
              <div className="p-6 sm:p-10">
                <div className="flex gap-1.5"><span className="h-2 w-10 rounded-full bg-lp" /><span className="h-2 w-5 rounded-full bg-lp-2" /></div>
                <h2 className="mt-5 text-3xl text-brand-deep sm:text-5xl">{t(`landscapes.items.${current.id}.name`)}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t(`landscapes.items.${current.id}.text`)}</p>
                <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-lp-2">{t("landscapes.lines")}</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t<string[]>(`landscapes.items.${current.id}.lines`).map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-lp" />{line}</li>
                  ))}
                </ul>
              </div>
            </div>
            <h3 className="mt-12 text-2xl text-brand-deep">{t("landscapes.programs")}</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.filter((p) => p.landscape === current.id).map((p) => <ProgramCard key={p.id} {...p} />)}
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {landscapes.filter((l) => l.id !== current.id).map((l) => (
                <button key={l.id} onClick={() => select(l.id)} className={`theme-${l.id} flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-lp-soft`}>
                  <span className="size-2.5 rounded-full bg-lp" />{t(`landscapes.items.${l.id}.name`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
