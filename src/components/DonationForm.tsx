
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowUpRight,
  Users,
  Trees,
  BookOpen,
  ChevronUp,
  X,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";

// ==========================================
// FORMULARIO DE DONACIONES
// ==========================================

export function DonationForm() {
  const { lang } = useI18n();

  useEffect(() => {
    if (document.getElementById("givebutter-script")) return;

    const script = document.createElement("script");

    script.src =
      "https://widgets.givebutter.com/latest.umd.cjs?acct=d3Z2XsELTXeIww2E";

    script.async = true;
    script.id = "givebutter-script";

    document.head.appendChild(script);
  }, []);

  return (
    <div id="givebutter-form" className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <Heart className="size-6 text-primary" />

        <h2 className="text-3xl text-brand-deep">
          {lang === "es" ? "Donar" : "Donate"}
        </h2>
      </div>

      <p className="mt-3 text-muted-foreground">
        {lang === "es"
          ? "Tu aporte ayuda a proteger las aves y los paisajes de Bolivia."
          : "Your gift helps protect Bolivia’s birds and landscapes."}
      </p>

      <div className="mt-6 min-h-64 w-full max-w-xl">
        <givebutter-widget
          id="L4E3Vq"
          className="block w-full"
        />
      </div>
    </div>
  );
}

// ==========================================
// ANIMACIONES EXISTENTES DEL LORO
// ==========================================

const parrotKeyframes = `
@keyframes parrot-cycle {
  0% {
    transform: translate(-160px, 70px)
      rotate(-22deg) scale(0.85);
    opacity: 0;
  }

  6% {
    opacity: 1;
  }

  18% {
    transform: translate(0, 0)
      rotate(0deg) scale(1);
    opacity: 1;
  }

  22% {
    transform: translateY(-3px) rotate(-3deg);
  }

  26% {
    transform: translateY(0) rotate(0deg);
  }

  35% {
    transform: translateY(-1px) rotate(-5deg);
  }

  45% {
    transform: translateY(0) rotate(0deg);
  }

  55% {
    transform: translateY(-1px) rotate(5deg);
  }

  65% {
    transform: translateY(0) rotate(0deg);
  }

  70% {
    transform: translate(0, 0)
      rotate(0deg) scale(1);
    opacity: 1;
  }

  92% {
    transform: translate(260px, -140px)
      rotate(25deg) scale(0.9);
    opacity: 1;
  }

  92.01% {
    transform: translate(260px, -140px)
      rotate(25deg) scale(0.9);
    opacity: 0;
  }

  100% {
    transform: translate(260px, -140px)
      rotate(25deg) scale(0.9);
    opacity: 0;
  }
}

@keyframes parrot-wing {
  0%, 100% {
    transform: rotate(-6deg);
  }

  50% {
    transform: rotate(18deg);
  }
}

@keyframes parrot-tail {
  0%, 100% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(4deg);
  }
}

@keyframes heart-pulse {
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

@keyframes button-glow {
  0%, 100% {
    box-shadow: 0 8px 24px -8px
      color-mix(in oklab, var(--brand) 45%, transparent);
  }

  50% {
    box-shadow: 0 12px 32px -6px
      color-mix(in oklab, var(--brand) 75%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .parrot-anim,
  .parrot-anim *,
  .donation-anim,
  .donation-anim * {
    animation: none !important;
  }
}
`;

// ==========================================
// BOTÓN FLOTANTE DE DONACIONES
// ==========================================

export function DonationReminder() {
  const { lang } = useI18n();

  return (
    <aside
      aria-label={
        lang === "es"
          ? "Apoya la conservación"
          : "Support conservation"
      }
      className="
        fixed right-3 z-40
        bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]
        md:bottom-4 md:right-4
        max-w-[calc(100vw-2rem)]
      "
    >
      <style>{parrotKeyframes}</style>

      <div className="relative">
        {/* Loro animado: visible solo en escritorio */}

        <svg
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="
            parrot-anim pointer-events-none
            absolute -top-10 right-4
            hidden size-12 drop-shadow-md
            md:block
          "
          style={{
            animation:
              "parrot-cycle 10s ease-in-out infinite",
            transformOrigin: "50% 90%",
          }}
        >
          {/* Cuerpo */}

          <ellipse
            cx="34"
            cy="38"
            rx="12"
            ry="9"
            fill="#16a34a"
          />

          {/* Cabeza */}

          <circle
            cx="44"
            cy="28"
            r="7"
            fill="#22c55e"
          />

          {/* Pico */}

          <path
            d="M50 26 L60 28 L52 32 Z"
            fill="#f97316"
          />

          <path
            d="M50 28 L58 30 L51 33 Z"
            fill="#ea580c"
          />

          {/* Ojo */}

          <circle
            cx="46"
            cy="27"
            r="1.6"
            fill="#0f172a"
          />

          <circle
            cx="46.5"
            cy="26.5"
            r="0.5"
            fill="#ffffff"
          />

          {/* Ala */}

          <g
            fill="#15803d"
            style={{
              transformOrigin: "32px 36px",
              animation:
                "parrot-wing 0.4s ease-in-out infinite",
            }}
          >
            <path
              d="
                M28 34
                C20 30 12 32 8 38
                C14 38 20 40 24 44
                C26 40 28 37 28 34 Z
              "
            />

            <path
              d="M14 37 L22 39 M16 41 L23 42"
              stroke="#166534"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* Patas */}

          <g
            stroke="#f59e0b"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          >
            <path
              d="M34 46 L33 50 M38 46 L39 50"
            />
          </g>
        </svg>

        {/* Botón de donación original */}

        <Button
          asChild
          size="lg"
          variant="hero"
          className="
            donation-anim relative
            border-2 border-background
            shadow-card
            max-md:h-10
            max-md:gap-2
            max-md:px-4
            max-md:text-xs
          "
          style={{
            animation:
              "button-glow 2.4s ease-in-out infinite",
          }}
        >
          <Link to="/donar">
            <Heart
              className="size-5 max-md:size-4"
              style={{
                animation:
                  "heart-pulse 1.2s ease-in-out infinite",
              }}
            />

            {lang === "es" ? "Donar" : "Donate"}
          </Link>
        </Button>
      </div>
    </aside>
  );
}

// ==========================================
// ACCESOS RÁPIDOS
// COLORES DE LA BANDERA DE BOLIVIA
// ==========================================

const quickActions = [
  {
    id: "membership",
    to: "/contacto",
    icon: Users,

    title: {
      es: "Hazte miembro",
      en: "Become a member",
    },

    shortTitle: {
      es: "Hazte miembro",
      en: "Join us",
    },

    description: {
      es: "Sé parte de la conservación",
      en: "Be part of conservation",
    },

    // ROJO

    background: `
      bg-[#a63b40]
      hover:bg-[#963238]
    `,

    panel: `
      bg-[#a63b40]
    `,

    shadow: `
      shadow-[#a63b40]/25
    `,

    ring: `
      ring-[#a63b40]/20
    `,

    mobileBackground: `
      bg-[#a63b40]/10
    `,

    mobileText: `
      text-[#a63b40]
    `,
  },

  {
    id: "reserves",
    to: "/paisajes",
    icon: Trees,

    title: {
      es: "Visita nuestras reservas",
      en: "Visit our reserves",
    },

    shortTitle: {
      es: "Visita reservas",
      en: "Visit reserves",
    },

    description: {
      es: "Descubre la naturaleza de Bolivia",
      en: "Discover Bolivia’s nature",
    },

    // AMARILLO

    background: `
      bg-[#b38a30]
      hover:bg-[#987020]
    `,

    panel: `
      bg-[#b38a30]
    `,

    shadow: `
      shadow-[#b38a30]/25
    `,

    ring: `
      ring-[#b38a30]/20
    `,

    mobileBackground: `
      bg-[#b38a30]/10
    `,

    mobileText: `
      text-[#987020]
    `,
  },

  {
    id: "field-guide",
    to: "/paisajes",
    icon: BookOpen,

    title: {
      es: "Guía de campo Aves de Bolivia",
      en: "Field Guide Birds of Bolivia",
    },

    shortTitle: {
      es: "Guía de aves",
      en: "Bird guide",
    },

    description: {
      es: "Explora nuestra diversidad de aves",
      en: "Explore our bird diversity",
    },

    // VERDE

    background: `
      bg-[#34734e]
      hover:bg-[#28613f]
    `,

    panel: `
      bg-[#34734e]
    `,

    shadow: `
      shadow-[#34734e]/25
    `,

    ring: `
      ring-[#34734e]/20
    `,

    mobileBackground: `
      bg-[#34734e]/10
    `,

    mobileText: `
      text-[#34734e]
    `,
  },
] as const;

// ==========================================
// BOTONES FLOTANTES
// ==========================================

export function FloatingSideButtons() {
  const { lang } = useI18n();
  const es = lang === "es";

  const [open, setOpen] = useState(false);

  // Cerrar el panel pulsando Escape.

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document
          .getElementById("mobile-quick-actions-toggle")
          ?.focus();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <>
      {/* ======================================
          VERSIÓN ESCRITORIO
          ====================================== */}

      <aside
        aria-label={
          es ? "Accesos rápidos" : "Quick links"
        }
        className="
          pointer-events-none
          fixed left-4 top-1/2 z-40
          hidden -translate-y-1/2
          flex-col gap-3 md:flex
        "
      >
        {quickActions.map((item) => {
          const Icon = item.icon;

          const title = es
            ? item.title.es
            : item.title.en;

          const description = es
            ? item.description.es
            : item.description.en;

          return (
            <Link
              key={item.id}
              to={item.to}
              aria-label={`${title}. ${description}`}
              className="
                group pointer-events-auto
                relative flex w-fit items-center
                rounded-full
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand-light
                focus-visible:ring-offset-4
              "
            >
              {/* Círculo principal */}

              <span
                className={`
                  relative z-10
                  grid size-12 shrink-0
                  place-items-center
                  rounded-full
                  border border-white/35
                  text-white
                  shadow-lg ring-1
                  transition-all duration-300
                  ease-[cubic-bezier(.16,1,.3,1)]
                  group-hover:scale-105
                  group-focus-visible:scale-105
                  motion-reduce:transition-none
                  ${item.background}
                  ${item.shadow}
                  ${item.ring}
                `}
              >
                <Icon
                  aria-hidden="true"
                  className="
                    size-[22px] stroke-[1.8]
                    transition-transform duration-300
                    group-hover:-translate-y-0.5
                    motion-reduce:transition-none
                  "
                />
              </span>

              {/* Panel desplegable */}

              <span
                aria-hidden="true"
                className={`
                  absolute left-0 top-1/2
                  flex min-h-[54px] w-max
                  max-w-[340px]
                  -translate-y-1/2
                  -translate-x-3
                  items-center gap-4
                  rounded-full
                  border border-white/20
                  py-2.5 pl-16 pr-5
                  text-white shadow-xl
                  opacity-0 invisible
                  transition-all duration-300
                  ease-[cubic-bezier(.16,1,.3,1)]
                  group-hover:visible
                  group-hover:translate-x-0
                  group-hover:opacity-100
                  group-focus-within:visible
                  group-focus-within:translate-x-0
                  group-focus-within:opacity-100
                  motion-reduce:transition-none
                  ${item.panel}
                  ${item.shadow}
                `}
              >
                <span className="flex flex-col">
                  <span
                    className="
                      font-display text-base
                      font-medium leading-tight
                      tracking-tight
                    "
                  >
                    {title}
                  </span>

                  <span
                    className="
                      mt-1 text-[11px]
                      leading-snug text-white/85
                    "
                  >
                    {description}
                  </span>
                </span>

                <ArrowUpRight
                  className="
                    size-4 shrink-0
                    text-white/85
                    transition-transform duration-300
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    motion-reduce:transition-none
                  "
                />
              </span>
            </Link>
          );
        })}
      </aside>

      {/* ======================================
          VERSIÓN MÓVIL COMPACTA
          ====================================== */}

      <aside
        aria-label={
          es ? "Participa con Armonía" : "Get involved"
        }
        className="
          fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]
          left-3 z-40 md:hidden
        "
      >
        <div className="relative">
          {/* Panel de accesos desplegable */}

          <div
            id="mobile-quick-actions"
            aria-hidden={!open}
            className={`
              absolute bottom-full left-0 mb-3
              w-[270px]
              max-w-[calc(100vw-1.5rem)]
              origin-bottom-left
              overflow-hidden
              rounded-2xl
              border border-border
              bg-background/95
              shadow-[0_12px_35px_-8px_rgba(0,0,0,0.25)]
              backdrop-blur-xl
              transition-all duration-300
              ease-[cubic-bezier(.16,1,.3,1)]
              motion-reduce:transition-none
              ${
                open
                  ? "visible scale-100 translate-y-0 opacity-100"
                  : "invisible pointer-events-none scale-95 translate-y-3 opacity-0"
              }
            `}
          >
            {/* Franja tricolor */}

            <div
              aria-hidden="true"
              className="grid h-[3px] grid-cols-3"
            >
              <span className="bg-[#a63b40]" />
              <span className="bg-[#b38a30]" />
              <span className="bg-[#34734e]" />
            </div>

            {/* Encabezado */}

            <div
              className="
                flex items-center justify-between
                px-3 pt-3 pb-1
              "
            >
              <span
                className="
                  text-[10px] font-bold
                  uppercase tracking-widest
                  text-muted-foreground
                "
              >
                {es
                  ? "Sé parte de Armonía"
                  : "Be part of Armonía"}
              </span>

              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  setOpen(false);
                  document
                    .getElementById(
                      "mobile-quick-actions-toggle"
                    )
                    ?.focus();
                }}
                aria-label={
                  es ? "Cerrar" : "Close"
                }
                className="
                  grid size-7 place-items-center
                  rounded-full
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-primary
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                "
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Accesos */}

            <nav
              aria-label={
                es ? "Accesos rápidos" : "Quick links"
              }
              className="
                flex flex-col gap-1.5 p-2
              "
            >
              {quickActions.map((item) => {
                const Icon = item.icon;

                const title = es
                  ? item.title.es
                  : item.title.en;

                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex items-center gap-2.5
                      rounded-xl p-2
                      transition-all duration-200
                      active:scale-[0.98]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-ring
                      motion-reduce:transition-none
                      ${item.mobileBackground}
                    `}
                  >
                    {/* Icono */}

                    <span
                      className={`
                        grid size-9 shrink-0
                        place-items-center
                        rounded-full text-white
                        ${item.background}
                      `}
                    >
                      <Icon
                        aria-hidden="true"
                        className="size-[18px] stroke-[1.8]"
                      />
                    </span>

                    {/* Texto */}

                    <span
                      className={`
                        min-w-0 flex-1
                        text-xs font-semibold
                        leading-snug
                        ${item.mobileText}
                      `}
                    >
                      {title}
                    </span>

                    {/* Flecha */}

                    <ArrowUpRight
                      aria-hidden="true"
                      className={`
                        size-4 shrink-0
                        ${item.mobileText}
                      `}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Botón principal compacto */}

          <button
            id="mobile-quick-actions-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-quick-actions"
            onClick={() => setOpen((value) => !value)}
            className="
              inline-flex h-10
              items-center justify-center gap-2
              rounded-full
              border border-border
              bg-background/95
              px-3.5
              text-xs font-semibold
              text-brand-deep
              shadow-lg
              backdrop-blur-xl
              transition-all duration-200
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              motion-reduce:transition-none
            "
          >
            {/* Identidad tricolor */}

            <span
              aria-hidden="true"
              className="
                flex w-3.5 shrink-0
                flex-col gap-0.5
              "
            >
              <span
                className="
                  h-[3px] w-full
                  rounded-full bg-[#a63b40]
                "
              />

              <span
                className="
                  h-[3px] w-full
                  rounded-full bg-[#b38a30]
                "
              />

              <span
                className="
                  h-[3px] w-full
                  rounded-full bg-[#34734e]
                "
              />
            </span>

            {/* Llamado a la acción */}

            <span>
              {open
                ? es
                  ? "Cerrar"
                  : "Close"
                : es
                  ? "Participa"
                  : "Get involved"}
            </span>

            {open ? (
              <X className="size-3.5" />
            ) : (
              <ChevronUp className="size-3.5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
