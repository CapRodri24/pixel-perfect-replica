import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Feather, Bird, Mountain, Microscope, Trees, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { About } from "@/components/About";
import { Landscapes } from "@/components/Landscapes";
import { Programs } from "@/components/Programs";
import { SectionShortcut } from "@/components/SectionView";
import { Noticias } from "./noticias";

const SLIDE_DURATION = 7500;
const SLIDE_TRANSITION = 1200;
const SLIDE_COUNT = 5;
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
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const transitionTimerRef = useRef<number | null>(null);
  const icons = [Microscope, Trees, Users];
  const slides = [
    {
      id: "beni", image: "/images/home/1.jpg", icon: Feather,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Pastizales del Beni"] : ["Beni Grasslands"],
      description: t<string>("landscapes.items.beni.text"),
      primary: { label: t<string>("quick.member"), to: "/contacto", internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.beni.name"),
      subtitle: es ? "Sabanas y humedales" : "Savannas and wetlands",
      showPillars: true,
    },
    {
      id: "yungas", image: "/images/home/2.jpg", icon: Trees,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Yungas"] : ["Yungas"],
      description: t<string>("landscapes.items.yungas.text"),
      primary: { label: t<string>("quick.member"), to: "/contacto", internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.yungas.name"),
      subtitle: es ? "Bosques nublados" : "Cloud forests",
      showPillars: false,
    },
    {
      id: "andes", image: "/images/home/3.jpg", icon: Mountain,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Andes Altos"] : ["High Andes"],
      description: t<string>("landscapes.items.andes.text"),
      primary: { label: t<string>("quick.member"), to: "/contacto", internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.andes.name"),
      subtitle: es ? "Montañas y fuentes de agua" : "Mountains and water sources",
      showPillars: false,
    },
    {
      id: "seco", image: "/images/home/4.jpg", icon: Bird,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Bosque Seco", "Interandino"] : ["Inter-Andean", "Dry Forest"],
      description: t<string>("landscapes.items.seco.text"),
      primary: { label: t<string>("quick.member"), to: "/contacto", internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.seco.name"),
      subtitle: es ? "Valles secos y cañones" : "Dry valleys and canyons",
      showPillars: false,
    },
    {
      id: "amazonia", image: "/images/home/5.jpg", icon: Trees,
      kicker: es ? "Paisajes de Bolivia" : "Landscapes of Bolivia",
      title: es ? ["Amazonía"] : ["Amazon"],
      description: t<string>("landscapes.items.amazonia.text"),
      primary: { label: t<string>("quick.member"), to: "/contacto", internal: true },
      secondary: { label: t<string>("quick.donate"), to: "/donar", internal: true },
      tab: t<string>("landscapes.items.amazonia.name"),
      subtitle: es ? "Bosques tropicales y ríos" : "Tropical forests and rivers",
      showPillars: false,
    },
  ];

  const resetProgress = useCallback(() => {
    elapsedRef.current = 0;
    progressRefs.current.forEach((bar) => { if (bar) bar.style.transform = "scaleX(0)"; });
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
        if (currentBar) currentBar.style.transform = `scaleX(${progress})`;
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
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onFocusCapture={() => { focusPausedRef.current = true; }}
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
            <div className="container-site relative z-10 flex h-full flex-col justify-center pt-[110px] pb-[165px] max-xl:pt-[94px] max-[900px]:pb-[130px] max-sm:pt-[84px] max-sm:pb-[115px]">
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
                    {slide.primary.internal ? <Link to={slide.primary.to} tabIndex={isActive ? 0 : -1}>{slide.primary.label}<ArrowRight className="size-5" /></Link> : <a href={slide.primary.to} tabIndex={isActive ? 0 : -1}>{slide.primary.label}<ArrowRight className="size-5" /></a>}
                  </Button>
                  <Button asChild size="lg" variant="glass">
                    {slide.secondary.internal ? <Link to={slide.secondary.to} tabIndex={isActive ? 0 : -1}>{slide.secondary.label}</Link> : <a href={slide.secondary.to} tabIndex={isActive ? 0 : -1}>{slide.secondary.label}</a>}
                  </Button>
                </div>
                {slide.showPillars && (
                  <ul className={`mt-8 hidden max-w-2xl flex-wrap gap-x-8 gap-y-3 border-t border-white/20 pt-5 text-sm text-white/85 md:flex ${fadeClass} ${isActive ? "delay-[1100ms]" : "delay-0"} motion-reduce:delay-0`}>
                    {t<string[]>("hero.pillars").map((pillar, i) => {
                      const PillarIcon = icons[i % icons.length] ?? Microscope;
                      return <li key={pillar} className="flex items-center gap-2"><PillarIcon className="size-4 text-brand-light" />{pillar}</li>;
                    })}
                  </ul>
                )}
              </div>
            </div>
          </article>
        );
      })}
      <div aria-hidden="true" className="absolute right-[26px] top-[45%] z-30 flex items-center gap-3 text-xs tracking-widest text-white/65 [writing-mode:vertical-rl] max-[900px]:hidden">
        {es ? "Desliza" : "Scroll"}
        <span className="h-[60px] w-px bg-linear-to-b from-white/80 to-transparent animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 pb-[30px] max-[900px]:pb-6">
        <div className="container-site flex items-end gap-7">
          <div role="group" aria-label={es ? "Seleccionar diapositiva" : "Select slide"} className="flex min-w-0 flex-1 gap-[22px] max-[900px]:gap-3.5 max-sm:gap-1.5">
            {slides.map((slide, index) => (
              <button key={slide.id} type="button" disabled={!ready} aria-pressed={active === index} aria-controls={`hero-slide-${index}`} onClick={() => goTo(index)}
                className={`relative min-w-0 flex-1 cursor-pointer pt-4 text-left transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light max-sm:pt-3 ${active === index ? "text-white" : "text-white/55"}`}>
                <span className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-full bg-white/22">
                  <span ref={(element) => { progressRefs.current[index] = element; }} className="block size-full origin-left [transform:scaleX(0)] bg-brand-light" />
                </span>
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
      <span className="absolute bottom-2 right-4 z-30 text-[0.6rem] uppercase tracking-widest text-white/40">{t("hero.photo")}</span>
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
      <About />
      <SectionShortcut to="/nosotros" />
      <Landscapes />
      <SectionShortcut to="/paisajes" />
      <Programs />
      <SectionShortcut to="/programas" />
      <Noticias home />
      <SectionShortcut to="/noticias" />
    </main>
  );
}
