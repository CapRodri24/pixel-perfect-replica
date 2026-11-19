import { Compass, Eye, Microscope, Trees, Users } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "@/components/SectionHeading";

export default function QuienesSomos() {
  const { lang, t } = useI18n();
  const es = lang === "es";
  const pillars = [
    { icon: Microscope, title: es ? "Investigación" : "Research", text: es ? "Generamos conocimiento para orientar las acciones de conservación." : "We generate knowledge to guide conservation actions." },
    { icon: Trees, title: es ? "Hábitats" : "Habitats", text: es ? "Protegemos y restauramos espacios naturales prioritarios." : "We protect and restore priority natural areas." },
    { icon: Users, title: es ? "Comunidades" : "Communities", text: es ? "Construimos soluciones junto a las personas que habitan los paisajes." : "We build solutions alongside the people living in these landscapes." },
  ];
  return (
    <section id="quienes-somos" className="section">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={es ? "Identidad institucional" : "Institutional identity"} title={es ? "Quiénes somos" : "Who we are"} text={t("about.text")} />
            <p className="mt-5 leading-relaxed text-muted-foreground">{es ? "Nuestro trabajo conecta la investigación científica, la gestión de reservas y la participación comunitaria para conservar la biodiversidad de Bolivia a largo plazo." : "Our work connects scientific research, reserve management and community participation to conserve Bolivia's biodiversity over the long term."}</p>
            <div className="mt-7 inline-flex items-center gap-4 rounded-2xl bg-secondary px-5 py-4"><span className="font-display text-4xl text-primary">30</span><span className="max-w-40 text-sm font-semibold text-brand-deep">{es ? "Años de trabajo por la conservación" : "Years of conservation work"}</span></div>
          </div>
          <img src="/images/home/1.jpg" alt={es ? "Paisaje natural de Bolivia" : "Bolivian natural landscape"} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card" />
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[{ icon: Compass, title: es ? "Misión" : "Mission", text: es ? "Conservar las aves y sus hábitats mediante ciencia, colaboración y acciones sostenibles." : "To conserve birds and their habitats through science, collaboration and sustainable actions." }, { icon: Eye, title: es ? "Visión" : "Vision", text: es ? "Una Bolivia donde la biodiversidad y las comunidades prosperen en armonía." : "A Bolivia where biodiversity and communities thrive in harmony." }].map(({icon: Icon, title, text}, i) => <article key={title} className={`rounded-3xl p-7 ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-brand-deep"}`}><Icon className="size-8" /><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 leading-relaxed opacity-90">{text}</p></article>)}
        </div>
        <h3 className="mt-12 text-3xl text-brand-deep">{es ? "Nuestra historia" : "Our history"}</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{es ? "Desde 1996, Armonía impulsa iniciativas de conservación en Bolivia. Nuestro recorrido integra nuevas áreas de trabajo, alianzas y aprendizajes compartidos con las comunidades." : "Since 1996, Armonía has promoted conservation initiatives in Bolivia. Our journey brings together new areas of work, partnerships and learning with communities."}</p>
        <h3 className="mt-12 text-3xl text-brand-deep">{es ? "Cómo trabajamos" : "How we work"}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{pillars.map(({icon: Icon, title, text}) => <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-card"><span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><Icon className="size-6" /></span><h4 className="mt-4 text-lg font-bold text-brand-deep">{title}</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
      </div>
    </section>
  );
}
