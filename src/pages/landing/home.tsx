import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Feather, Bird, Mountain, Trees, Leaf, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { SectionShortcut } from "@/components/SectionView";
import { Noticias } from "./noticias";
import { listarPaisajesPublicos, type PaisajePublicoResumen } from "@/api/paisajesPublicosApi";

const SLIDE_DURATION = 7500;
const SLIDE_TRANSITION = 1200;
const SLIDE_COUNT = 5;
const SLIDE_KEYWORDS: Record<string, string[]> = {
  beni: ["beni", "pastizal"],
  yungas: ["yunga"],
  andes: ["andes"],
  seco: ["seco", "interandino"],
  amazonia: ["amazon"],
};
/**
 * Geometrías territoriales de la identidad visual de Armonía: cada paisaje tiene su trazo y color.
 * Se dibujan en un lienzo de 120 × 24 y la diapositiva activa las va trazando según avanza.
 */
const LANDSCAPE_GEOMETRY: Record<string, { color: string; d: string }> = {
  beni: { color: "#E7B91F", d: "M3 15 C14 10 24 10 34 13 C44 16 52 17 62 14 C72 11 80 9 90 12 C100 15 110 15 117 12" },
  yungas: { color: "#6DA83A", d: "M3 19 C16 17 26 6 44 5 C60 4 66 14 76 17 C88 20 104 17 117 19" },
  andes: { color: "#2A86D6", d: "M3 21 L30 10 L42 16 L62 3 L82 16 L92 11 L117 21" },
  seco: { color: "#D2602E", d: "M3 20 L16 20 L23 14 L43 14 L51 5 L73 5 L79 12 L95 12 L100 17 L117 17" },
  amazonia: { color: "#8DAA2C", d: "M3 20 C12 12 38 14 54 14 C70 14 76 7 64 5 C55 4 57 1 70 1 C88 1 106 4 117 9" },
};
const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
let hasShownPreloader = false;

function Preloader({ exiting }: { exiting: boolean }) {
  const { lang } = useI18n();
  const [started, setStarted] = useState(false);
  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setStarted(true));
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);
  return (
    <div role="status" aria-label={lang === "es" ? "Cargando Asociación Armonía" : "Loading Asociación Armonía"}
      className={`fixed inset-0 z-[99999] grid place-items-center bg-brand-deep transition-transform duration-1000 ease-[cubic-bezier(.77,0,.18,1)] motion-reduce:transition-none ${exiting ? "-translate-y-full pointer-events-none" : "translate-y-0"}`}>
      <div className={`text-center transition-opacity duration-400 motion-reduce:transition-none ${exiting ? "opacity-0" : "opacity-100"}`}>
        <img src="/images/logo-blanco.png" alt="Asociación Armonía" className="mx-auto h-auto w-[220px] max-w-[65vw] object-contain animate-pulse motion-reduce:animate-none" />
        <div className="mx-auto mt-[30px] h-0.5 w-[200px] overflow-hidden bg-white/15">
          <span className={`block size-full origin-left bg-brand-light transition-transform duration-[1300ms] ease-[cubic-bezier(.77,0,.18,1)] motion-reduce:transition-none ${started ? "scale-x-100" : "scale-x-0"}`} />
        </div>
      </div>
    </div>
  );
}

function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const focusPausedRef = useRef(false);
  const elapsedRef = useRef(0);
  const transitioningRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);
  const progressRefs = useRef<(SVGPathElement | null)[]>([]);
  const transitionTimerRef = useRef<number | null>(null);
  const [landscapes, setLandscapes] = useState<PaisajePublicoResumen[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    listarPaisajesPublicos(controller.signal).then(setLandscapes).catch(() => undefined);
    return () => controller.abort();
  }, []);
  // Enlace a la página del paisaje, donde se ven sus programas. Si no existe, abre el listado.
  const landscapeLink = (slideId: string) => {
    const keywords = SLIDE_KEYWORDS[slideId] ?? [];
    const match = landscapes.find((p) => keywords.some((k) => normalizeText(`${p.titulo_es} ${p.titulo_en}`).includes(k)));
    return match ? `/paisajes?paisaje=${encodeURIComponent(match.id_paisaje)}` : "/paisajes";
  };
  const slides = [
    {
      id: "beni", image: "/images/home/1.jpg", icon: Feather,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Pastizales del Beni"] : ["Beni Grasslands"],
      description: t<string>("landscapes.items.beni.text"),
      primary: { label: es ? "Conoce más" : "Learn more", to: landscapeLink("beni"), internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.beni.name"),
      subtitle: es ? "Sabanas y humedales" : "Savannas and wetlands",

    },
    {
      id: "yungas", image: "/images/home/2.jpg", icon: Trees,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Yungas"] : ["Yungas"],
      description: t<string>("landscapes.items.yungas.text"),
      primary: { label: es ? "Conoce más" : "Learn more", to: landscapeLink("yungas"), internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.yungas.name"),
      subtitle: es ? "Bosques nublados" : "Cloud forests",

    },
    {
      id: "andes", image: "/images/home/3.jpg", icon: Mountain,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Andes Altos"] : ["High Andes"],
      description: t<string>("landscapes.items.andes.text"),
      primary: { label: es ? "Conoce más" : "Learn more", to: landscapeLink("andes"), internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.andes.name"),
      subtitle: es ? "Montañas y fuentes de agua" : "Mountains and water sources",

    },
    {
      id: "seco", image: "/images/home/4.jpg", icon: Bird,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Bosque Seco", "Interandino"] : ["Inter-Andean", "Dry Forest"],
      description: t<string>("landscapes.items.seco.text"),
      primary: { label: es ? "Conoce más" : "Learn more", to: landscapeLink("seco"), internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.seco.name"),
      subtitle: es ? "Valles secos y cañones" : "Dry valleys and canyons",

    },
    {
      id: "amazonia", image: "/images/home/5.jpg", icon: Trees,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Amazonía"] : ["Amazon"],
      description: t<string>("landscapes.items.amazonia.text"),
      primary: { label: es ? "Conoce más" : "Learn more", to: landscapeLink("amazonia"), internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.amazonia.name"),
      subtitle: es ? "Bosques tropicales y ríos" : "Tropical forests and rivers",

    },
  ];

  const resetProgress = useCallback(() => {
    elapsedRef.current = 0;
    progressRefs.current.forEach((bar) => { if (bar) bar.style.strokeDashoffset = "1"; });
  }, []);

  const goTo = useCallback((index: number) => {
    const next = (index + SLIDE_COUNT) % SLIDE_COUNT;
    if (next === activeRef.current || transitioningRef.current) return;
    transitioningRef.current = true;
    setLeaving(activeRef.current);
    setActive(next);
    activeRef.current = next;
    resetProgress();
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    transitionTimerRef.current = window.setTimeout(() => {
      setLeaving(null);
      transitioningRef.current = false;
      transitionTimerRef.current = null;
    }, reducedMotion ? 0 : SLIDE_TRANSITION);
  }, [resetProgress]);

  useEffect(() => {
    if (!ready) return;
    let frameId = 0;
    let lastTime = performance.now();
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tick = (time: number) => {
      const delta = Math.min(time - lastTime, 100);
      lastTime = time;
      if (!pausedRef.current && !focusPausedRef.current && !document.hidden && !motionPreference.matches) {
        elapsedRef.current += delta;
        const progress = Math.min(elapsedRef.current / SLIDE_DURATION, 1);
        const currentBar = progressRefs.current[activeRef.current];
        if (currentBar) currentBar.style.strokeDashoffset = String(1 - progress);
        if (progress >= 1) goTo(activeRef.current + 1);
      }
      frameId = window.requestAnimationFrame(tick);
    };
    const handleVisibility = () => { lastTime = performance.now(); };
    document.addEventListener("visibilitychange", handleVisibility);
    frameId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      transitioningRef.current = false;
    };
  }, [ready, goTo]);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!ready) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(activeRef.current + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(activeRef.current - 1); }
  };

  return (
    <section id="inicio" aria-roledescription={es ? "Carrusel" : "Carousel"}
      aria-label={es ? "Presentación de Asociación Armonía" : "Introduction to Asociación Armonía"}
      className="relative isolate overflow-hidden bg-brand-deep text-primary-foreground h-svh min-h-[680px] max-[900px]:min-h-[650px] max-sm:min-h-[640px]"
      onFocusCapture={(e) => { if ((e.target as HTMLElement).matches(":focus-visible")) focusPausedRef.current = true; }}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusPausedRef.current = false; }}
      onKeyDown={handleKeyDown}
      onTouchStart={(e) => { touchStartRef.current = e.touches[0]?.clientX ?? null; }}
      onTouchEnd={(e) => {
        if (touchStartRef.current === null) return;
        const distance = (e.changedTouches[0]?.clientX ?? touchStartRef.current) - touchStartRef.current;
        if (ready && Math.abs(distance) > 50) goTo(activeRef.current + (distance < 0 ? 1 : -1));
        touchStartRef.current = null;
      }}
      onTouchCancel={() => { touchStartRef.current = null; }}>
      {slides.map((slide, index) => {
        const Icon = slide.icon;
        const isActive = ready && index === active;
        const isLeaving = index === leaving;
        const fadeClass = `transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none ${isActive ? "translate-y-0 opacity-100" : "translate-y-[26px] opacity-0"}`;
        return (
          <article key={slide.id} id={`hero-slide-${index}`} aria-hidden={!isActive}
            aria-roledescription={es ? "Diapositiva" : "Slide"} aria-label={`${index + 1} / ${SLIDE_COUNT}`}
            className={`absolute inset-0 overflow-hidden transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(.77,0,.18,1)] motion-reduce:transition-none ${isActive ? "visible z-20 [clip-path:inset(0)]" : isLeaving ? "visible z-10 pointer-events-none [clip-path:inset(0)]" : "invisible z-0 pointer-events-none [clip-path:inset(0_0_0_100%)]"}`}>
            <img src={slide.image} alt="" width={1920} height={1088} fetchPriority={index === 0 ? "high" : "auto"} loading="eager"
              className={`absolute -inset-[2%] h-[104%] w-[104%] max-w-none object-cover object-center transition-transform duration-[9000ms] ease-linear motion-reduce:transition-none ${isActive ? "scale-100" : "scale-[1.14]"}`} />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,15,25,.88)_0%,rgba(5,15,25,.60)_45%,rgba(5,15,25,.10)_100%)] max-sm:bg-[linear-gradient(90deg,rgba(5,15,25,.80),rgba(5,15,25,.36))]" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(5,15,25,.85)_0%,transparent_45%)] max-sm:bg-[linear-gradient(0deg,rgba(5,15,25,.85)_0%,transparent_55%)]" />
            {/* El header fijo se superpone a la imagen, no al contenido. */}
            <div className="container-site relative z-10 flex h-full flex-col justify-center pt-[110px] pb-[165px] max-xl:pt-[94px] max-[900px]:pb-[130px] max-md:pb-[235px] max-sm:pt-[84px] max-sm:pb-[230px]">
              <div className="max-w-5xl">
                <div className={`${fadeClass} ${isActive ? "delay-300" : "delay-0"} motion-reduce:delay-0`}>
                  {index === 0 ? (
                    <a href="#noticias" tabIndex={isActive ? 0 : -1} className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur transition-colors hover:bg-white/20">
                      <span className="grid size-9 place-items-center rounded-full bg-white font-display text-sm font-bold text-primary">30</span>
                      {t("hero.badge")}
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-3 text-sm font-semibold text-brand-light sm:text-base"><Icon className="size-5" />{slide.kicker}</div>
                  )}
                </div>
                <h1 className="mt-6 max-w-5xl font-display font-medium text-[clamp(2.2rem,5.2vw,5.6rem)] leading-[1.05] tracking-tight text-white">
                  {slide.title.map((line, lineIndex) => (
                    <span key={lineIndex} className="block overflow-hidden pb-[0.08em]">
                      <span className={`block transition-transform duration-1000 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none motion-reduce:delay-0 ${isActive ? "translate-y-0" : "translate-y-[115%]"} ${isActive ? lineIndex === 0 ? "delay-[400ms]" : "delay-[550ms]" : "delay-0"}`}>{line}</span>
                    </span>
                  ))}
                </h1>
                <p className={`mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg ${fadeClass} ${isActive ? "delay-[750ms]" : "delay-0"} motion-reduce:delay-0`}>{slide.description}</p>
                <div className={`mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${fadeClass} ${isActive ? "delay-[950ms]" : "delay-0"} motion-reduce:delay-0`}>
                  <Button asChild size="lg" variant="hero">
                    {slide.primary.internal ? <Link to={slide.primary.to} tabIndex={isActive ? 0 : -1} aria-label={`${slide.primary.label}: ${slide.tab}`}>{slide.primary.label}<ArrowRight className="size-5" /></Link> : <a href={slide.primary.to} tabIndex={isActive ? 0 : -1}>{slide.primary.label}<ArrowRight className="size-5" /></a>}
                  </Button>
                  <Button asChild size="lg" variant="glass">
                    {slide.secondary.internal ? <Link to={slide.secondary.to} tabIndex={isActive ? 0 : -1}>{slide.secondary.label}</Link> : <a href={slide.secondary.to} tabIndex={isActive ? 0 : -1}>{slide.secondary.label}</a>}
                  </Button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
      <div aria-hidden="true" className="absolute right-[80px] top-[45%] z-30 flex items-center gap-3 text-xs tracking-widest text-white/65 [writing-mode:vertical-rl] max-[900px]:hidden">
        {es ? "Desliza" : "Scroll"}
        <span className="h-[60px] w-px bg-linear-to-b from-white/80 to-transparent animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 pb-[30px] max-[900px]:pb-6 max-md:pb-[calc(8.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="container-site flex items-end gap-7">
          <div role="group" aria-label={es ? "Seleccionar diapositiva" : "Select slide"} className="flex min-w-0 flex-1 gap-[22px] max-[900px]:gap-3.5 max-sm:gap-1.5">
            {slides.map((slide, index) => (
              <button key={slide.id} type="button" disabled={!ready} aria-pressed={active === index} aria-controls={`hero-slide-${index}`} onClick={() => goTo(index)}
                className={`group relative min-w-0 flex-1 cursor-pointer text-left transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light ${active === index ? "text-white" : "text-white/55"}`}>
                {/* Geometría del paisaje: el trazo tenue es la guía y el trazo de color marca el avance. */}
                <svg aria-hidden="true" viewBox="0 0 120 24" fill="none" strokeLinecap="round" strokeLinejoin="round"
                  className="mx-auto mb-2 block h-auto w-full max-w-[150px] overflow-visible sm:mx-0 sm:mb-3">
                  <path d={LANDSCAPE_GEOMETRY[slide.id]?.d} stroke={LANDSCAPE_GEOMETRY[slide.id]?.color} strokeWidth="3" strokeOpacity={active === index ? 0.5 : 0.45}
                    className="transition-[stroke-opacity] duration-300 group-hover:[stroke-opacity:.75]" />
                  <path ref={(element) => { progressRefs.current[index] = element; }} d={LANDSCAPE_GEOMETRY[slide.id]?.d} stroke={LANDSCAPE_GEOMETRY[slide.id]?.color} strokeWidth="3.6"
                    pathLength={1} strokeDasharray="1 1" strokeOpacity={active === index ? 1 : 0} style={{ strokeDashoffset: 1, filter: `drop-shadow(0 0 4px ${LANDSCAPE_GEOMETRY[slide.id]?.color ?? "#fff"}88)` }} />
                </svg>
                <span className="block font-display text-center text-[10px] font-medium leading-tight sm:text-left sm:text-lg">{slide.tab}</span>
                <span className="mt-1 block text-xs opacity-80 sm:text-sm max-[900px]:hidden">{slide.subtitle}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2.5 max-[900px]:hidden">
            <button type="button" disabled={!ready} onClick={() => goTo(active - 1)} aria-label={es ? "Anterior" : "Previous"} className="grid size-[50px] place-items-center rounded-full border-[1.5px] border-white/35 bg-white/6 text-white backdrop-blur-sm transition-all duration-350 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.08] hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light motion-reduce:transition-none"><ChevronLeft className="size-5" /></button>
            <button type="button" disabled={!ready} onClick={() => goTo(active + 1)} aria-label={es ? "Siguiente" : "Next"} className="grid size-[50px] place-items-center rounded-full border-[1.5px] border-white/35 bg-white/6 text-white backdrop-blur-sm transition-all duration-350 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.08] hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light motion-reduce:transition-none"><ChevronRight className="size-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactNumber({ value, active }: { value: number; active: boolean }) {
  const [number, setNumber] = useState(value);
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - start) / 1300, 1);
      setNumber(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, value]);
  return <span aria-hidden="true">{number}</span>;
}

function IntroHome() {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const figures = [
    { number: 30, icon: Bird, label: es ? "Años de conservación" : "Years of conservation" },
    { number: 5, icon: Mountain, label: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia" },
    { number: 3, icon: Trees, label: es ? "Reservas naturales" : "Nature reserves" },
  ];
  // Los cuatro compromisos de Armonía (los mismos de Nosotros › Quiénes somos).
  const whatWeDo = [
    { icon: Bird, color: "#2381C4", text: es ? "Prevenimos la extinción de especies" : "We prevent species extinction" },
    { icon: Trees, color: "#34734e", text: es ? "Conservamos hábitats clave" : "We conserve key habitats" },
    { icon: Leaf, color: "#397c74", text: es ? "Impulsamos el uso sostenible" : "We promote sustainable use" },
    { icon: Users, color: "#987020", text: es ? "Apoyamos a las comunidades" : "We support local communities" },
  ];
  const reveal = visible ? "motion-safe:animate-[armonia-intro-reveal_850ms_cubic-bezier(.16,1,.3,1)_both]" : "";
  return (
    <section ref={sectionRef} id="quienes-somos-inicio" aria-labelledby="intro-home-title" className="relative isolate overflow-hidden bg-background py-16 sm:py-24 lg:py-28">
      <style>{`@keyframes armonia-intro-reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 -top-44 size-[520px] rounded-full bg-primary/5" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -left-36 size-[380px] rounded-full border border-primary/10" />
      <div className="container-site relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className={`relative ${reveal}`}>
            <div className="group relative isolate aspect-[5/4] overflow-hidden rounded-[2rem] bg-brand-deep shadow-card sm:aspect-[6/5]">
              <img src="/images/home/2.jpg" alt={es ? "Paisaje natural de los Yungas de Bolivia" : "Natural landscape in Bolivia’s Yungas"} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-1000 motion-safe:group-hover:scale-105" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <div className="mb-3 h-0.5 w-12 bg-brand-light" />
                <p className="text-xs font-bold uppercase tracking-[.2em] text-white/85">{es ? "Bolivia · Desde 1996" : "Bolivia · Since 1996"}</p>
                <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{es ? "Por las aves. Por Bolivia." : "For birds. For Bolivia."}</p>
              </div>
            </div>
            <div aria-hidden="true" className="absolute -right-3 -top-3 -z-10 h-2/3 w-2/3 rounded-[2rem] border-2 border-primary/25 sm:-right-5 sm:-top-5" />
          </div>
          <div className={reveal} style={visible ? { animationDelay: "120ms" } : undefined}>
            <div className="flex items-center gap-3 text-primary"><span aria-hidden="true" className="h-px w-10 bg-primary"/><p className="text-sm font-bold uppercase tracking-[.18em]">{es ? "Sobre Armonía" : "About Armonía"}</p></div>
            <h2 id="intro-home-title" className="mt-4 font-display text-[clamp(1.9rem,3vw,3rem)] font-black leading-[1.12] tracking-tight text-brand-deep">{es ? "Conservamos las aves" : "We conserve Bolivia’s birds"}<span className="block text-[#34734e]">{es ? "y sus hábitats en Bolivia." : "and their habitats."}</span></h2>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[.14em] text-brand-deep">{es ? "Quiénes somos" : "Who we are"}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                  {es
                    ? "Organización boliviana sin fines de lucro fundada en 1996. Trabajamos con comunidades locales, desde los Andes hasta la Amazonía, para proteger las aves más amenazadas del país."
                    : "A Bolivian nonprofit founded in 1996. We work with local communities, from the Andes to the Amazon, to protect the country’s most threatened birds."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[.14em] text-brand-deep">{es ? "Qué hacemos" : "What we do"}</h3>
                <ul className="mt-2.5 grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
                  {whatWeDo.map(({ icon: Icon, color, text }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${color}1a`, color }}><Icon aria-hidden="true" className="size-4" /></span>
                      <span className="text-sm leading-snug text-foreground/85">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link to="/nosotros" className="group mt-6 inline-flex min-h-12 items-center gap-4 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{es ? "Conoce Armonía" : "Discover Armonía"}<ArrowRight className="size-5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" /></Link>
          </div>
        </div>
        <div className={`relative mt-10 grid overflow-hidden rounded-[2rem] bg-brand-deep text-white shadow-card sm:mt-16 sm:grid-cols-3 ${reveal}`} style={visible ? { animationDelay: "240ms" } : undefined}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/10"/>
          {figures.map((figure, index) => {
            const Icon = figure.icon;
            return <div key={figure.number} className={`group relative flex items-center gap-5 px-6 py-7 sm:flex-col sm:gap-3 sm:px-4 sm:py-9 sm:text-center ${index > 0 ? "border-t border-white/20 sm:border-l sm:border-t-0" : ""}`}>
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-brand-light motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"><Icon aria-hidden="true" className="size-6" /></span>
              <div><p className="font-display text-5xl font-black leading-none tabular-nums text-white sm:text-6xl"><span className="sr-only">{figure.number}</span><ImpactNumber value={figure.number} active={visible} /></p><p className="mt-2 text-base font-medium text-white/95 sm:text-lg">{figure.label}</p></div>
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(() => !hasShownPreloader);
  const [exiting, setExiting] = useState(false);
  const [heroReady, setHeroReady] = useState(() => hasShownPreloader);
  useEffect(() => {
    if (!showPreloader) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let disposed = false;
    const timers: number[] = [];
    const schedule = (callback: () => void, delay: number) => {
      timers.push(window.setTimeout(() => { if (!disposed) callback(); }, delay));
    };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    schedule(() => setExiting(true), reducedMotion ? 100 : 1500);
    schedule(() => setHeroReady(true), reducedMotion ? 110 : 2050);
    schedule(() => {
      hasShownPreloader = true;
      setShowPreloader(false);
      document.body.style.overflow = previousOverflow;
    }, reducedMotion ? 150 : 2550);
    return () => {
      disposed = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = previousOverflow;
    };
  }, [showPreloader]);
  return (
    <main>
      {showPreloader && <Preloader exiting={exiting} />}
      <Hero ready={heroReady} />
      <IntroHome />
      <Noticias home />
      <SectionShortcut to="/noticias" />
    </main>
  );
}
