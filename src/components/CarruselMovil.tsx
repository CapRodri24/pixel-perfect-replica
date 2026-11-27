// Carrusel solo para pantallas pequeñas: en celular las tarjetas se deslizan de lado
// (con puntos o pestañas); desde el punto de quiebre vuelven a la cuadrícula normal.
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type Quiebre = "sm" | "lg";

// Clases literales para que Tailwind las genere.
const CLASES: Record<Quiebre, { pista: string; slide: string; slideLleno: string; controles: string }> = {
  sm: {
    pista: "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:overflow-visible sm:pb-0",
    slide: "w-[82%] shrink-0 snap-center sm:w-auto",
    slideLleno: "w-full shrink-0 snap-center sm:w-auto",
    controles: "sm:hidden",
  },
  lg: {
    pista: "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:overflow-visible lg:pb-0",
    slide: "w-[88%] shrink-0 snap-center lg:w-auto",
    slideLleno: "w-full shrink-0 snap-center lg:w-auto",
    controles: "lg:hidden",
  },
};

export function CarruselMovil({ children, quiebre = "sm", gridEscritorio, etiquetas, lleno = false, nombre }: {
  children: ReactNode;
  quiebre?: Quiebre;
  /** Columnas de la cuadrícula a partir del quiebre, por ejemplo "sm:grid-cols-2 xl:grid-cols-3". */
  gridEscritorio: string;
  /** Nombres de cada tarjeta: se muestran como pestañas en celular. */
  etiquetas?: string[];
  /** Cada tarjeta ocupa todo el ancho (sin asomar la siguiente). */
  lleno?: boolean;
  nombre: string;
}) {
  const { lang } = useI18n();
  const items = Children.toArray(children);
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const c = CLASES[quiebre];

  // La tarjeta activa es la más cercana al centro de la pista.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let cuadro = 0;
    const medir = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        const centro = el.scrollLeft + el.clientWidth / 2;
        let mejor = 0, distancia = Infinity;
        Array.from(el.children).forEach((hijo, i) => {
          const h = hijo as HTMLElement;
          const d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - centro);
          if (d < distancia) { distancia = d; mejor = i; }
        });
        setActual(mejor);
      });
    };
    el.addEventListener("scroll", medir, { passive: true });
    return () => { el.removeEventListener("scroll", medir); cancelAnimationFrame(cuadro); };
  }, [items.length]);

  function ir(i: number) {
    const el = pista.current;
    const hijo = el?.children[i] as HTMLElement | undefined;
    if (!el || !hijo) return;
    el.scrollTo({ left: hijo.offsetLeft - (el.clientWidth - hijo.offsetWidth) / 2, behavior: "smooth" });
  }

  if (items.length <= 1) return <div className={`grid ${gridEscritorio}`}>{items}</div>;

  return <div role="region" aria-roledescription={lang === "es" ? "carrusel" : "carousel"} aria-label={nombre}>
    {etiquetas && <div role="tablist" aria-label={nombre} className={`mb-4 flex gap-1 rounded-2xl border border-border bg-background p-1 ${c.controles}`}>
      {etiquetas.map((e, i) => <button key={e} type="button" role="tab" aria-selected={actual === i} onClick={() => ir(i)}
        className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${actual === i ? "bg-primary text-primary-foreground shadow-sm" : "text-brand-deep hover:bg-muted"}`}>{e}</button>)}
    </div>}
    <div ref={pista} className={`${c.pista} ${gridEscritorio}`}>
      {items.map((item, i) => <div key={i} className={lleno ? c.slideLleno : c.slide} aria-label={`${i + 1} / ${items.length}`}>{item}</div>)}
    </div>
    <div className={`mt-3 flex items-center justify-center gap-1 ${c.controles}`}>
      {items.map((_, i) => <button key={i} type="button" onClick={() => ir(i)} aria-label={`${lang === "es" ? "Ir a" : "Go to"} ${i + 1}`} aria-current={actual === i}
        className="grid size-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className={`h-2 rounded-full transition-all ${actual === i ? "w-6 bg-primary" : "w-2 bg-primary/30"}`} />
      </button>)}
    </div>
  </div>;
}
