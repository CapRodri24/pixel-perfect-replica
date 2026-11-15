import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { pick, useContent, type ContentItem } from "@/lib/cms";
import { images } from "@/config/images";

/** Resolves a landscape_ref (static id or CMS uuid) into a display name and theme class. */
export function useLandscapeLabel() {
  const { t, lang } = useI18n();
  const { data = [] } = useContent();
  return (ref: string | null) => {
    if (!ref) return null;
    const dyn = data.find((d) => d.id === ref && d.kind === "landscape");
    if (dyn) return { name: pick(dyn, "title", lang), theme: "" };
    return { name: t(`landscapes.items.${ref}.name`), theme: `theme-${ref}` };
  };
}

export function DynCard({ item, cta, onClick }: { item: ContentItem; cta: string; onClick?: () => void }) {
  const { lang } = useI18n();
  const label = useLandscapeLabel()(item.landscape_ref);
  return (
    <article className={`${label?.theme ?? ""} group flex h-full flex-col overflow-hidden rounded-3xl bg-lp-soft transition-all hover:-translate-y-1 hover:shadow-card`}>
      <div className="overflow-hidden">
        <img src={item.images[0] ?? images.hero} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {label && <span className="w-fit rounded-full bg-lp px-3 py-1 text-xs font-semibold text-primary-foreground">{label.name}</span>}
        <h3 className="mt-4 text-xl text-brand-deep">{pick(item, "title", lang)}</h3>
        <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{pick(item, "body", lang)}</p>
        {onClick && <button onClick={onClick} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">{cta} <ArrowRight className="size-4" /></button>}
      </div>
    </article>
  );
}
