import { ArrowRight } from "lucide-react";
import type { ProgramId, LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";

export function ProgramCard({ id, landscape, image }: { id: ProgramId; landscape: LandscapeId | null; image: string }) {
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
        <a href="#programas" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
          {t("programs.more")} <ArrowRight className="size-4" />
        </a>
      </div>
    </article>
  );
}
