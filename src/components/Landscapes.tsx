import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { landscapes, programs, type LandscapeId, type ProgramId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// --- TARJETA DE PAISAJE (Fusionada) ---
function LandscapeCard({ id, image, onSelect, featured }: { id: LandscapeId; image: string; onSelect: () => void; featured?: boolean }) {
  const { t } = useI18n();
  return (
    <button onClick={onSelect} className={`theme-${id} group relative isolate flex min-h-[22rem] w-full flex-col justify-end overflow-hidden rounded-3xl text-left text-primary-foreground ${featured ? "sm:col-span-2 lg:row-span-2 lg:min-h-full" : ""}`}>
      <img src={image} alt={t(`landscapes.items.${id}.name`)} loading="lazy" width={1600} height={1008} className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="card-overlay absolute inset-0 -z-10" />
      <span className="absolute left-0 top-0 h-1.5 w-full bg-lp" />
      <div className="p-6 sm:p-7">
        <div className="mb-3 flex gap-1.5"><span className="size-3 rounded-full bg-lp" /><span className="size-3 rounded-full bg-lp-2" /></div>
        <h3 className={featured ? "text-3xl sm:text-4xl" : "text-2xl"}>{t(`landscapes.items.${id}.name`)}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-primary-foreground/85">{t(`landscapes.items.${id}.text`)}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-lp px-4 py-2 text-sm font-semibold transition-colors group-hover:bg-lp-2">
          {t("landscapes.explore")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

// --- TARJETA DE PROGRAMA (Fusionada) ---
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

// --- COMPONENTE PRINCIPAL DE PAISAJES ---
export function Landscapes({ initialSelected = null }: { initialSelected?: string | null }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const select = (id: string | null) => {
    setSelected(id);
    document.getElementById("paisajes")?.scrollIntoView({ behavior: "smooth" });
  };
  const current = landscapes.find((l) => l.id === selected);

  const switcher = (
    <div className="mt-10 flex flex-wrap gap-2">
      {landscapes.filter((l) => l.id !== selected).map((l) => (
        <button key={l.id} onClick={() => select(l.id)} className={`theme-${l.id} flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-lp-soft`}>
          <span className="size-2.5 rounded-full bg-lp" />{t(`landscapes.items.${l.id}.name`)}
        </button>
      ))}
    </div>
  );

  return (
    <section id="paisajes" className="section bg-muted">
      <div className="container-site">
        {current ? (
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
              {programs.filter((p) => p.landscape === (current.id as LandscapeId)).map((p) => <ProgramCard key={p.id} {...p} />)}
            </div>
            {switcher}
          </div>
        ) : (
          <>
            <SectionHeading eyebrow={t("landscapes.eyebrow")} title={t("landscapes.title")} text={t("landscapes.text")} />
            <div className="mt-12 grid auto-rows-[minmax(22rem,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {landscapes.map((l, i) => <LandscapeCard key={l.id} {...l} featured={i === 0} onSelect={() => select(l.id)} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}