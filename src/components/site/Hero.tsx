import { ArrowRight, Microscope, Trees, Users } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { images } from "@/config/images";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { t } = useI18n();
  const icons = [Microscope, Trees, Users];
  return (
    <section id="inicio" className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-center overflow-hidden">
      <img src={images.hero} alt="" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div className="container-site py-20">
        <div className="max-w-2xl animate-rise text-primary-foreground">
          <a href="#noticias" className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur hover:bg-primary-foreground/20">
            <span className="grid size-9 place-items-center rounded-full bg-primary-foreground font-display text-sm font-bold text-primary">30</span>
            {t("hero.badge")}
          </a>
          <h1 className="mt-6 text-4xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">{t("hero.title")}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">{t("hero.text")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="hero"><a href="#nosotros">{t("hero.primary")} <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="glass"><a href="#paisajes">{t("hero.secondary")}</a></Button>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-primary-foreground/20 pt-6 text-sm text-primary-foreground/85">
            {t<string[]>("hero.pillars").map((p, i) => {
              const Icon = icons[i];
              return <li key={p} className="flex items-center gap-2"><Icon className="size-4 text-brand-light" /> {p}</li>;
            })}
          </ul>
        </div>
      </div>
      <span className="absolute bottom-3 right-4 text-[0.65rem] uppercase tracking-widest text-primary-foreground/60">{t("hero.photo")}</span>
    </section>
  );
}
