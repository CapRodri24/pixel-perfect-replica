import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { landscapes, programs, type LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { pick, useContentOf } from "@/lib/cms";
import { SectionHeading } from "./SectionHeading";
import { LandscapeCard } from "./LandscapeCard";
import { ProgramCard } from "./ProgramCard";
import { DynCard } from "./DynCard";
import { Button } from "@/components/ui/button";
import { images } from "@/config/images";

export function Landscapes() {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const dynLandscapes = useContentOf("landscape");
  const dynPrograms = useContentOf("program");
  const dynNews = useContentOf("news");
  const select = (id: string | null) => {
    setSelected(id);
    document.getElementById("paisajes")?.scrollIntoView({ behavior: "smooth" });
  };
  const current = landscapes.find((l) => l.id === selected);
  const dyn = dynLandscapes.find((l) => l.id === selected);
  const related = [...dynPrograms, ...dynNews].filter((p) => p.landscape_ref === selected);

  const switcher = (
    <div className="mt-10 flex flex-wrap gap-2">
      {landscapes.filter((l) => l.id !== selected).map((l) => (
        <button key={l.id} onClick={() => select(l.id)} className={`theme-${l.id} flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-lp-soft`}>
          <span className="size-2.5 rounded-full bg-lp" />{t(`landscapes.items.${l.id}.name`)}
        </button>
      ))}
      {dynLandscapes.filter((l) => l.id !== selected).map((l) => (
        <button key={l.id} onClick={() => select(l.id)} className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary">
          <span className="size-2.5 rounded-full bg-primary" />{pick(l, "title", lang)}
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
              {related.map((p) => <DynCard key={p.id} item={p} cta={t("programs.more")} />)}
            </div>
            {switcher}
          </div>
        ) : dyn ? (
          <div className="animate-rise">
            <Button variant="ghost" onClick={() => select(null)}><ArrowLeft /> {t("landscapes.back")}</Button>
            <div className="mt-4 grid overflow-hidden rounded-3xl bg-secondary lg:grid-cols-2">
              <img src={dyn.images[0] ?? images.hero} alt={pick(dyn, "title", lang)} className="aspect-[16/10] size-full object-cover lg:aspect-auto" />
              <div className="p-6 sm:p-10">
                <h2 className="text-3xl text-brand-deep sm:text-5xl">{pick(dyn, "title", lang)}</h2>
                <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{pick(dyn, "body", lang)}</p>
              </div>
            </div>
            {dyn.images.length > 1 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {dyn.images.slice(1).map((src) => <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />)}
              </div>
            )}
            {related.length > 0 && <>
              <h3 className="mt-12 text-2xl text-brand-deep">{t("landscapes.programs")}</h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((p) => <DynCard key={p.id} item={p} cta={t("programs.more")} />)}</div>
            </>}
            {switcher}
          </div>
        ) : (
          <>
            <SectionHeading eyebrow={t("landscapes.eyebrow")} title={t("landscapes.title")} text={t("landscapes.text")} />
            <div className="mt-12 grid auto-rows-[minmax(22rem,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {landscapes.map((l, i) => <LandscapeCard key={l.id} {...l} featured={i === 0} onSelect={() => select(l.id)} />)}
              {dynLandscapes.map((l) => (
                <button key={l.id} onClick={() => select(l.id)} className="group relative isolate flex min-h-[22rem] w-full flex-col justify-end overflow-hidden rounded-3xl text-left text-primary-foreground">
                  <img src={l.images[0] ?? images.hero} alt={pick(l, "title", lang)} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="card-overlay absolute inset-0 -z-10" />
                  <span className="absolute left-0 top-0 h-1.5 w-full bg-primary" />
                  <div className="p-6 sm:p-7">
                    <h3 className="text-2xl">{pick(l, "title", lang)}</h3>
                    <p className="mt-2 line-clamp-3 max-w-md text-sm text-primary-foreground/85">{pick(l, "body", lang)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold">{t("landscapes.explore")} <ArrowRight className="size-4" /></span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
