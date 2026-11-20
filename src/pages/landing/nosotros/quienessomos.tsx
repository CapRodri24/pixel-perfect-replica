import { Bird, Compass, Trees, Leaf, Users, ArrowUpRight, ArrowRight, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";

const macaw = "https://armoniabolivia.org/wp-content/uploads/2015/05/red-fronted-macaw-ara-rubrogenys-s-reichle-copy-1.jpg";
const education = "https://armoniabolivia.org/wp-content/uploads/2015/02/environmental-education-children-bolivia-armonia.jpg";
const partners = [
  { name: "American Bird Conservancy", url: "https://abcbirds.org/", logo: "https://armoniabolivia.org/wp-content/uploads/2015/05/ABC_logo_jpeg_large_color.jpg" },
  { name: "BirdLife International", url: "https://www.birdlife.org/", logo: "https://armoniabolivia.org/wp-content/uploads/2015/02/LOGO-BirdLife-colour-transparent-background-2000px-e1439475461401.png" },
  { name: "Fundación Loro Parque", url: "https://www.loroparque-fundacion.org/", logo: "" },
  { name: "Rainforest Trust", url: "https://www.rainforesttrust.org/", logo: "https://armoniabolivia.org/wp-content/uploads/2015/05/rt-logo_0.jpg" },
  { name: "World Land Trust", url: "https://www.worldlandtrust.org/", logo: "https://armoniabolivia.org/wp-content/uploads/2015/02/WLT_Green-logo-1024x507-1.jpg" },
];

const history = {
  es: [
    "Armonía fue fundada ante la falta de alguna organización que se dedique a salvar de la extinción a las aves más amenazadas de Bolivia, al mismo tiempo que desafíe a la población local a tomar medidas para conservar su patrimonio natural.",
    "Nuestro mayor éxito es la participación y el empoderamiento de las comunidades locales y los pueblos indígenas, desde los Andes hasta el Amazonas. Tenemos años de experiencia integrando la protección ambiental y la sensibilización, con la mejora de los medios y niveles de vida del pueblo boliviano.",
  ],
  en: [
    "Armonía was founded because there was no organization dedicated to saving Bolivia's most threatened birds from extinction while challenging local people to take action to conserve their natural heritage.",
    "Our greatest success is the participation and empowerment of local communities and Indigenous peoples, from the Andes to the Amazon. We have years of experience integrating environmental protection and awareness with improvements in the livelihoods and living standards of the Bolivian people.",
  ],
};
const context = {
  es: [
    "Bolivia es uno de los países más pobres de América del Sur, que lucha con una economía débil y con un rápido crecimiento demográfico. Esto significa que el país está buscando maneras de desarrollarse rápidamente.",
    "Su reciente crecimiento se ha centrado alrededor de precedentes a nivel mundial, como la producción de productos derivados del petróleo, la agricultura a gran escala y la ganadería, y también en el uso de recursos naturales como la madera.",
    "Pero hay en Bolivia otro movimiento más moderno que busca seguir una senda de desarrollo sostenible.",
    "Desafortunadamente, la base de referencia para este tipo de crecimiento cultural es muy débil. Muchos bolivianos no son ni conscientes de que viven en uno de los países biológicamente más ricos del mundo, ni que esto puede ofrecerles beneficios económicos.",
    "Esta es la razón por la cual la sensibilización ambiental y la creación de medios de vida alternativos para nuestro pueblo son fundamentales para nuestra misión.",
  ],
  en: [
    "Bolivia is one of the poorest countries in South America, struggling with a weak economy and rapid population growth. This means that the country is seeking ways to develop quickly.",
    "Its recent growth has focused on globally established approaches such as petroleum-based production, large-scale agriculture and cattle ranching, as well as the use of natural resources such as timber.",
    "But there is another, more modern movement in Bolivia seeking to follow a path of sustainable development.",
    "Unfortunately, the foundation for this kind of cultural growth is very weak. Many Bolivians are not even aware that they live in one of the most biologically rich countries in the world, or that this can offer them economic benefits.",
    "This is why environmental awareness and the creation of alternative livelihoods for our people are fundamental to our mission.",
  ],
};

export default function QuienesSomos() {
  const { lang } = useI18n();
  const es = lang === "es";
  const commitments = [
    { icon: Bird, color: "#2381C4", title: es ? "Prevenir la extinción" : "Prevent extinction", text: es ? "Prevenir la extinción en la naturaleza" : "Prevent extinction in the wild" },
    { icon: Trees, color: "#34734e", title: es ? "Conservar los hábitats" : "Conserve habitats", text: es ? "Conservar los sitios y hábitats importantes para las aves y otra biodiversidad." : "Conserve sites and habitats important for birds and other biodiversity." },
    { icon: Leaf, color: "#397c74", title: es ? "Sostenibilidad" : "Sustainability", text: es ? "Mantener los sistemas ecológicos vitales y garantizar el uso sostenible de los recursos naturales" : "Maintain vital ecological systems and ensure the sustainable use of natural resources." },
    { icon: Users, color: "#987020", title: es ? "Medios de vida" : "Livelihoods", text: es ? "Aliviar la pobreza mediante la creación de medios de vida alternativos." : "Alleviate poverty by creating alternative livelihoods." },
  ];
  const paragraph = "text-[18px] leading-[1.85] text-muted-foreground sm:text-[20px]";
  return (
    <section id="quienes-somos" className="section scroll-mt-28">
      <div className="container-site space-y-12 sm:space-y-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="space-y-5">
            <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.17em] text-primary"><span className="h-0.5 w-8 bg-primary" />{es ? "Identidad institucional" : "Institutional identity"}</span>
            <h2 className="font-display text-4xl font-black leading-tight text-brand-deep sm:text-5xl">{es ? "Acerca de nosotros" : "About us"}</h2>
            <p className="text-[21px] font-semibold leading-relaxed text-brand-deep sm:text-[24px]">{es ? "Fundada en 1996, la Asociación Armonía se convirtió rápidamente en la organización de conservación más efectiva de Bolivia, trabajando con las comunidades locales para proteger áreas naturales y la vida silvestre del país." : "Founded in 1996, Asociación Armonía quickly became Bolivia's most effective conservation organization, working with local communities to protect the country's natural areas and wildlife."}</p>
            <p className={paragraph}>{es ? "Somos una organización no gubernamental sin fines de lucro con " : "We are a nonprofit, nongovernmental organization with "}<strong className="text-brand-deep">{es ? "14 programas de conservación" : "14 conservation programs"}</strong>{es ? " en todo el país para proteger el patrimonio natural de Bolivia y de apoyo a las comunidades locales." : " across the country to protect Bolivia's natural heritage and support local communities."}</p>
            <p className={paragraph}>{es ? "Nuestro nombre se debe a que nos esforzamos por crear armonía entre la naturaleza y las personas." : "Our name reflects our efforts to create harmony between nature and people."}</p>
          </div>
          <figure className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <a href={macaw} target="_blank" rel="noopener noreferrer" className="block overflow-hidden"><img src={macaw} alt={es ? "Paraba Frente Roja" : "Red-fronted Macaw"} width={400} height={296} className="h-auto w-full object-contain transition-transform duration-700 motion-safe:group-hover:scale-[1.03]" /></a>
            <figcaption className="px-5 py-3 text-sm text-muted-foreground">{es ? "Paraba Frente Roja" : "Red-fronted Macaw"} · <i>Ara rubrogenys</i></figcaption>
          </figure>
        </div>
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl bg-brand-deep text-white">
          {[{ number: "1996", label: es ? "Año de fundación" : "Year founded" }, { number: "14", label: es ? "Programas de conservación" : "Conservation programs" }].map((stat, i) => <div key={stat.number} className={`p-5 text-center sm:p-9 ${i === 1 ? "border-l border-white/25" : ""}`}><span className="block font-display text-4xl font-black sm:text-6xl">{stat.number}</span><span className="mt-2 block text-base font-medium sm:text-lg">{stat.label}</span></div>)}
        </div>
        <article className="rounded-3xl border border-primary/15 bg-primary/5 p-6 sm:p-10">
          <Compass className="size-10 text-primary" aria-hidden="true" />
          <h3 className="mt-4 font-display text-3xl font-bold text-brand-deep sm:text-4xl">{es ? "Nuestra misión" : "Our mission"}</h3>
          <p className="mt-4 max-w-4xl text-xl leading-relaxed text-brand-deep sm:text-2xl">{es ? "Conservar las aves de Bolivia y sus hábitats mediante el fortalecimiento organizacional de comunidades locales." : "To conserve Bolivia's birds and their habitats by strengthening the organizational capacity of local communities."}</p>
        </article>
        <div>
          <h3 className="font-display text-3xl font-bold text-brand-deep sm:text-4xl">{es ? "Nuestro compromiso" : "Our commitment"}</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {commitments.map(({ icon: Icon, color, title, text }) => <article key={title} className="rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-primary/40"><span className="grid size-14 place-items-center rounded-2xl" style={{ color, backgroundColor: `${color}15` }}><Icon className="size-7" aria-hidden="true" /></span><h4 className="mt-5 font-display text-xl font-bold text-brand-deep">{title}</h4><p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{text}</p></article>)}
          </div>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-12">
          <figure className="group mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <a href={education} target="_blank" rel="noopener noreferrer" className="block overflow-hidden"><img src={education} alt={es ? "Educación ambiental con niñas y niños en Bolivia" : "Environmental education with children in Bolivia"} loading="lazy" width={300} height={400} className="h-auto w-full object-contain transition-transform duration-700 motion-safe:group-hover:scale-[1.03]" /></a>
            <figcaption className="px-5 py-3 text-sm text-muted-foreground">{es ? "Educación ambiental en Bolivia" : "Environmental education in Bolivia"}</figcaption>
          </figure>
          <div className="space-y-5"><h3 className="font-display text-3xl font-bold text-brand-deep sm:text-4xl">{es ? "Nuestra historia" : "Our history"}</h3>{(es ? history.es : history.en).map(p => <p key={p} className={paragraph}>{p}</p>)}<h3 className="pt-3 font-display text-2xl font-bold text-brand-deep sm:text-3xl">{es ? "Conservación y desarrollo sostenible" : "Conservation and sustainable development"}</h3>{(es ? context.es : context.en).map(p => <p key={p} className={paragraph}>{p}</p>)}</div>
        </div>
        <div className="space-y-5">
          <h3 className="font-display text-3xl font-bold text-brand-deep sm:text-4xl">{es ? "Alianzas estratégicas" : "Strategic partnerships"}</h3>
          <p className={paragraph}>{es ? "Nuestro exitoso enfoque nos ha permitido establecer alianzas estratégicas con organizaciones internacionales de gran prestigio, como:" : "Our successful approach has enabled us to establish strategic partnerships with highly respected international organizations, such as:"}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {partners.map(partner => (
              <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer" className="group relative flex min-w-0 flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-white p-5 text-center shadow-card transition-all duration-300 motion-safe:hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="absolute right-3 top-3 text-primary"><ArrowUpRight className="size-4" aria-hidden="true" /></span>
                <div className="flex h-28 w-full items-center justify-center">
                  {partner.logo ? <img src={partner.logo} alt={partner.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-105" onError={e => { e.currentTarget.hidden = true; }} /> : <Handshake className="size-12 text-primary" aria-hidden="true" />}
                </div>
                <span className="text-base font-semibold leading-snug text-brand-deep">{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
        <article className="rounded-3xl bg-brand-deep p-7 text-white sm:p-10">
          <h3 className="font-display text-3xl font-bold sm:text-4xl">{es ? "Gracias por su apoyo" : "Thank you for your support"}</h3>
          <p className="mt-4 max-w-4xl text-[18px] leading-relaxed text-white/90 sm:text-[20px]">{es ? "Agradecemos a nuestros socios internacionales y donantes individuales por los logros de conservación en Bolivia. Sin su generosa financiación, no podremos salvar a las especies amenazadas ni apoyar a nuestro pueblo. Gracias." : "We thank our international partners and individual donors for conservation achievements in Bolivia. Without your generous funding, we cannot save threatened species or support our people. Thank you."}</p>
          <Link to="/nosotros#socios" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-brand-deep transition-colors hover:bg-brand-light">{es ? "Conoce nuestros socios y aliados" : "Meet our partners and allies"}<ArrowRight className="size-5" /></Link>
        </article>
      </div>
    </section>
  );
}
