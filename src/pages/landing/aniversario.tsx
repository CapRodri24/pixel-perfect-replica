// Página del 30 aniversario (1996-2026). Contenido tomado de
// https://dev.armoniabolivia.org/30-aniversario-de-armonia/
// (el video del original es un «Video Placeholder» de Elementor, por eso no se incluye).
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, Heart, Users, Coins, BookMarked } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { CRONICA_RUTA } from "@/content/rutasContenido";

// Imágenes copiadas del sitio de Armonía a public/images/aniversario.
const imagenes = {
  portada: "/images/aniversario/portada-30-anos.jpg",
  donar: "/images/aniversario/donar-30-anos.webp",
  cronica: "/images/aniversario/cronica-apolo-1996.webp",
  lineaTiempo: "/images/aniversario/linea-de-tiempo.webp",
};


const textos = {
  es: {
    titulo: "30 años de Armonía",
    subtitulo: "Tres décadas conservando la biodiversidad y transformando comunidades",
    portadaAlt: "Armonía, 30 años (1996-2026): conservación y comunidades, de la mano. Un futuro sostenible en el que las personas y la naturaleza prosperan juntas.",
    intro: [
      "La Asociación Armonía es una organización dedicada desde 1996 a la conservación de la vida silvestre y los hábitats de Bolivia, promoviendo un equilibrio entre naturaleza y comunidades locales.",
      "Estos 30 años son significativos porque reflejan un camino sostenido de éxitos: desde la creación de reservas como Barba Azul hasta programas pioneros de monitoreo y reproducción de aves en peligro crítico, como la Paraba Frente Roja.",
      "Su trayectoria demuestra que la conservación a largo plazo es posible cuando se combina ciencia, compromiso comunitario y acción constante, consolidando a Armonía como un actor clave en la defensa de la biodiversidad boliviana.",
    ],
    donarTitulo: "Ayúdanos a proteger nuestra biodiversidad",
    donarTexto: [
      "Te invitamos a ser parte de los próximos 30 años de Armonía. Gracias al apoyo de personas, aliados y organizaciones comprometidas, hemos logrado proteger especies amenazadas, conservar hábitats clave y trabajar junto a comunidades locales para generar un impacto duradero.",
      "Hoy necesitamos seguir fortaleciendo este trabajo. Tu aporte nos ayudará a continuar desarrollando acciones de conservación basadas en ciencia, educación y colaboración para asegurar un futuro donde la biodiversidad y las personas puedan prosperar juntas.",
    ],
    donarBoton: "Quiero donar",
    donarAlt: "Dona ahora",
    cronicaTitulo: "Treinta años de Armonía narrados en crónica: del sueño fundador al legado",
    cronicaTexto: "Te invitamos a recorrer la historia de Armonía y descubrir los momentos, las personas y las decisiones que marcaron estos 30 años de trabajo por la conservación. Desde los primeros pasos de la organización hasta los desafíos y logros de la actualidad, conoce a quienes formaron parte de este camino: fundadores, investigadores, comunidades, aliados y el equipo actual. Descubre cómo el sueño de un grupo de personas apasionadas por la naturaleza se convirtió en una misión de largo plazo para proteger la biodiversidad de Bolivia.",
    cronicaBoton: "Leer la crónica",
    cronicaAlt: "Apolo, 1996: los primeros años de trabajo de Armonía en el campo",
    reporteTitulo: "Impact Report",
    reporteTexto: "Te invitamos a leer nuestros Impact Report 30 años, donde resumimos los principales avances de cada año. Programas impulsados, hitos alcanzados, el trabajo de nuestro equipo, el apoyo de aliados y nuestra visión hacia el futuro. Conoce cómo seguimos previniendo la extinción de aves mediante la protección de sus hábitats, con acciones basadas en ciencia y en colaboración con comunidades locales.",
    reporteBoton: "Ver reporte",
    proximamente: "Próximamente",
    cifrasTitulo: "30 años de compromiso y resultados",
    cifras: [
      { valor: "+60", titulo: "Trabajadores de planta", texto: "Un equipo de más de 60 trabajadores comprometidos con la conservación de aves y sus hábitats." },
      { valor: "USD 181,681", titulo: "Ingresos por aviturismo comunitario", texto: "Demostrando que la conservación puede impulsar el desarrollo local." },
      { valor: "+5000", titulo: "Guías de aves impresas", texto: "Contribuyendo a la conservación y al desarrollo de las comunidades." },
    ],
    lineaTiempoTitulo: "Nuestra historia en el tiempo",
    lineaTiempoAlt: "Línea de tiempo de los 30 años de Armonía",
  },
  en: {
    titulo: "30 years of Armonía",
    subtitulo: "Three decades conserving biodiversity and transforming communities",
    portadaAlt: "Armonía, 30 years (1996-2026): conservation and communities, hand in hand. A sustainable future where people and nature thrive together.",
    intro: [
      "Asociación Armonía has been dedicated since 1996 to conserving Bolivia's wildlife and habitats, promoting a balance between nature and local communities.",
      "These 30 years are significant because they reflect a sustained path of success: from creating reserves such as Barba Azul to pioneering monitoring and breeding programmes for critically endangered birds, such as the Red-fronted Macaw.",
      "Its track record shows that long-term conservation is possible when science, community commitment and constant action come together, establishing Armonía as a key player in defending Bolivia's biodiversity.",
    ],
    donarTitulo: "Help us protect our biodiversity",
    donarTexto: [
      "We invite you to be part of Armonía's next 30 years. Thanks to the support of committed people, allies and organisations, we have protected threatened species, conserved key habitats and worked alongside local communities to create lasting impact.",
      "Today we need to keep strengthening this work. Your contribution will help us continue developing conservation actions based on science, education and collaboration, to secure a future where biodiversity and people can thrive together.",
    ],
    donarBoton: "I want to donate",
    donarAlt: "Donate now",
    cronicaTitulo: "Thirty years of Armonía told as a chronicle: from the founding dream to the legacy",
    cronicaTexto: "We invite you to walk through Armonía's history and discover the moments, people and decisions that shaped these 30 years of conservation work. From the organisation's first steps to today's challenges and achievements, meet those who were part of this journey: founders, researchers, communities, allies and the current team. Discover how the dream of a group of people passionate about nature became a long-term mission to protect Bolivia's biodiversity.",
    cronicaBoton: "Read the chronicle",
    cronicaAlt: "Apolo, 1996: Armonía's early years of fieldwork",
    reporteTitulo: "Impact Report",
    reporteTexto: "We invite you to read our 30-year Impact Report, where we summarise the main achievements of each year: programmes launched, milestones reached, our team's work, the support of our allies and our vision for the future. Learn how we keep preventing bird extinctions by protecting their habitats, with science-based actions in collaboration with local communities.",
    reporteBoton: "View report",
    proximamente: "Coming soon",
    cifrasTitulo: "30 years of commitment and results",
    cifras: [
      { valor: "+60", titulo: "Permanent staff", texto: "A team of more than 60 people committed to conserving birds and their habitats." },
      { valor: "USD 181,681", titulo: "Community birdwatching income", texto: "Showing that conservation can drive local development." },
      { valor: "+5000", titulo: "Bird guides printed", texto: "Contributing to conservation and community development." },
    ],
    lineaTiempoTitulo: "Our history through time",
    lineaTiempoAlt: "Timeline of Armonía's 30 years",
  },
} as const;

const iconosCifras = [Users, Coins, BookMarked];
const boton = "inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition";

export default function Aniversario() {
  const { lang } = useI18n();
  const t = textos[lang === "en" ? "en" : "es"];
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return <main className="min-h-[70vh] bg-background">
    {/* Portada: la imagen ya trae el logo y el lema, por eso se muestra completa. */}
    <section className="bg-[#eaf4fb]">
      <img src={imagenes.portada} alt={t.portadaAlt} className="mx-auto block h-auto w-full max-w-[1600px]" fetchPriority="high" />
    </section>

    {/* Presentación */}
    <section className="container-site py-14 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">1996 – 2026</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-brand-deep sm:text-5xl">{t.titulo}</h1>
        <p className="mt-4 text-lg font-semibold text-[#2f7d4f] sm:text-xl">{t.subtitulo}</p>
        <div className="mt-8 space-y-5 text-left text-base leading-[1.8] text-muted-foreground sm:text-lg">
          {t.intro.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>
    </section>

    {/* Donar */}
    <section className="bg-secondary/60 py-14 sm:py-20">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <img src={imagenes.donar} alt={t.donarAlt} loading="lazy" className="mx-auto w-full max-w-md" />
        <div>
          <h2 className="font-display text-3xl leading-tight text-brand-deep sm:text-4xl">{t.donarTitulo}</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground sm:text-lg">{t.donarTexto.map((p) => <p key={p}>{p}</p>)}</div>
          <Link to="/donar" className={`${boton} mt-7 bg-primary text-primary-foreground hover:brightness-105`}><Heart className="size-4" aria-hidden="true" />{t.donarBoton}</Link>
        </div>
      </div>
    </section>

    {/* Crónica */}
    <section className="container-site grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <div className="order-2 lg:order-1">
        <h2 className="font-display text-3xl leading-tight text-brand-deep sm:text-4xl">{t.cronicaTitulo}</h2>
        <p className="mt-5 leading-relaxed text-muted-foreground sm:text-lg">{t.cronicaTexto}</p>
        <Link to={CRONICA_RUTA} className={`${boton} mt-7 bg-brand-deep text-white hover:bg-primary`}><BookOpen className="size-4" aria-hidden="true" />{t.cronicaBoton}<ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
      <img src={imagenes.cronica} alt={t.cronicaAlt} loading="lazy" className="order-1 w-full rounded-3xl object-cover shadow-card lg:order-2" />
    </section>

    {/* Impact Report */}
    <section className="container-site pb-14 sm:pb-20">
      <div className="flex flex-col gap-6 rounded-3xl border border-border bg-gradient-to-br from-white to-[#eaf4fb] p-8 shadow-card sm:p-10 md:flex-row md:items-center">
        <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText className="size-8" aria-hidden="true" /></span>
        <div className="flex-1">
          <h2 className="font-display text-3xl text-brand-deep">{t.reporteTitulo}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{t.reporteTexto}</p>
        </div>
        {/* El reporte aún no está publicado en el sitio original (su botón apunta a «#»). */}
        <span aria-disabled="true" className={`${boton} shrink-0 cursor-not-allowed border border-border bg-white text-muted-foreground`} title={t.proximamente}>
          {t.reporteBoton} · {t.proximamente}
        </span>
      </div>
    </section>

    {/* Cifras */}
    <section className="bg-brand-deep py-14 text-white sm:py-20">
      <div className="container-site">
        <h2 className="text-center font-display text-3xl sm:text-4xl">{t.cifrasTitulo}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {t.cifras.map((c, i) => {
            const Icono = iconosCifras[i] ?? Users;
            return <article key={c.titulo} className="rounded-3xl bg-white/10 p-7 text-center ring-1 ring-white/15">
              <Icono className="mx-auto size-8 text-[#9fd3f5]" aria-hidden="true" />
              <p className="mt-4 font-display text-4xl font-bold sm:text-5xl">{c.valor}</p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#9fd3f5]">{c.titulo}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/85">{c.texto}</p>
            </article>;
          })}
        </div>
      </div>
    </section>

    {/* Línea de tiempo */}
    <section className="container-site py-14 sm:py-20">
      <h2 className="text-center font-display text-3xl text-brand-deep sm:text-4xl">{t.lineaTiempoTitulo}</h2>
      <img src={imagenes.lineaTiempo} alt={t.lineaTiempoAlt} loading="lazy" className="mx-auto mt-8 block h-auto w-full max-w-5xl" />
    </section>

  </main>;
}
