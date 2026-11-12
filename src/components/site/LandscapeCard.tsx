import { ArrowRight } from "lucide-react";
import type { LandscapeId } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";

export function LandscapeCard({ id, image, onSelect, featured }: { id: LandscapeId; image: string; onSelect: () => void; featured?: boolean }) {
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
