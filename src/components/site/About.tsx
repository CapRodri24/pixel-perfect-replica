import { ArrowUpRight, Compass, Users, Landmark, Handshake, Briefcase } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { images } from "@/config/images";
import { SectionHeading } from "./SectionHeading";

export function About() {
  const { t } = useI18n();
  const cards = t<{ title: string; text: string }[]>("about.cards");
  const icons = [Compass, Users, Landmark, Handshake, Briefcase];
  return (
    <section id="nosotros" className="section">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} text={t("about.text")} />
          <div className="relative mt-10 overflow-hidden rounded-3xl">
            <img src={images.landscapes.yungas} alt="" loading="lazy" width={1600} height={1008} className="aspect-[16/10] w-full object-cover" />
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => {
            const Icon = icons[i];
            return (
              <li key={c.title} className={i === 0 ? "sm:col-span-2" : ""}>
                <a href="#nosotros" className={`group flex h-full flex-col rounded-3xl border border-border p-6 transition-all hover:-translate-y-1 hover:shadow-card ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  <div className="flex items-start justify-between">
                    <span className={`grid size-11 place-items-center rounded-2xl ${i === 0 ? "bg-primary-foreground/15" : "bg-background text-primary"}`}><Icon className="size-5" /></span>
                    <ArrowUpRight className="size-5 opacity-50 transition-all group-hover:opacity-100 group-hover:rotate-45" />
                  </div>
                  <h3 className={`mt-6 text-xl ${i === 0 ? "" : "text-brand-deep"}`}>{c.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.text}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
