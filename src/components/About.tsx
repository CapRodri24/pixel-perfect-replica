
import {
  ArrowUpRight,
  Compass,
  Users,
  Landmark,
  Handshake,
  Briefcase,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { images } from "@/config/images";
import { SectionHeading } from "./SectionHeading";

// ==========================================
// ACCESOS A LAS SECCIONES DE NOSOTROS
// ==========================================

const aboutSections = [
  {
    id: "quienes-somos",
    icon: Compass,
    to: "/nosotros#quienes-somos",
    featured: true,
  },
  {
    id: "equipo",
    icon: Users,
    to: "/nosotros#equipo",
    featured: false,
  },
  {
    id: "junta-directiva",
    icon: Landmark,
    to: "/nosotros#junta-directiva",
    featured: false,
  },
  {
    id: "socios",
    icon: Handshake,
    to: "/nosotros#socios",
    featured: false,
  },
  {
    id: "oportunidades",
    icon: Briefcase,
    to: "/nosotros#oportunidades",
    featured: false,
  },
];

// ==========================================
// SECCIÓN NOSOTROS — HOME
// ==========================================

export function About() {
  const { t, lang } = useI18n();

  const es = lang === "es";

  const cards = t<
    {
      title: string;
      text: string;
    }[]
  >("about.cards");

  return (
    <section
      id="nosotros"
      className="section relative overflow-hidden bg-background"
    >
      <div
        className="
          container-site
          grid items-start gap-10
          lg:grid-cols-[1fr_1.1fr]
          lg:gap-14
          xl:gap-16
        "
      >
        {/* ==================================
            PRESENTACIÓN INSTITUCIONAL
            ================================== */}

        <div className="flex min-w-0 flex-col">
          <SectionHeading
            eyebrow={t("about.eyebrow")}
            title={t("about.title")}
            text={t("about.text")}
          />

          {/* Imagen institucional */}

          <div
            className="
              group relative mt-8
              overflow-hidden rounded-3xl
              bg-muted shadow-card
              sm:mt-10
            "
          >
            <img
              src={images.landscapes.yungas}
              alt={
                es
                  ? "Paisajes naturales de Bolivia"
                  : "Natural landscapes of Bolivia"
              }
              loading="lazy"
              className="
                aspect-[16/10] w-full
                object-cover object-center
                transition-transform duration-700
                ease-[cubic-bezier(.16,1,.3,1)]
                group-hover:scale-105
                motion-reduce:transition-none
              "
            />

            {/* Degradado inferior */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute inset-0 card-overlay
              "
            />

            {/* Texto sobre la fotografía */}

            <div
              className="
                absolute inset-x-0 bottom-0
                p-5 text-white sm:p-7
              "
            >
              <span
                className="
                  text-[10px] font-semibold
                  uppercase tracking-[0.2em]
                  text-white/80
                "
              >
                {es
                  ? "Asociación Armonía"
                  : "Asociación Armonía"}
              </span>

              <p
                className="
                  mt-2 max-w-sm
                  font-display text-xl
                  leading-snug sm:text-2xl
                "
              >
                {es
                  ? "Conservando la biodiversidad de Bolivia"
                  : "Conserving Bolivia’s biodiversity"}
              </p>
            </div>
          </div>
        </div>

        {/* ==================================
            TARJETAS DE NAVEGACIÓN
            ================================== */}

        <div
          className="
            grid min-w-0 gap-4
            sm:grid-cols-2
            lg:gap-5
          "
        >
          {aboutSections.map((section, index) => {
            const Icon = section.icon;
            const card = cards[index];

            if (!card) return null;

            // ================================
            // TARJETA PRINCIPAL
            // ================================

            if (section.featured) {
              return (
                <Link
                  key={section.id}
                  to={section.to}
                  className="
                    group relative isolate
                    flex min-h-[190px] flex-col
                    justify-between overflow-hidden
                    rounded-3xl bg-primary
                    p-6 text-primary-foreground
                    shadow-card
                    transition-all duration-300
                    ease-[cubic-bezier(.16,1,.3,1)]
                    hover:-translate-y-1
                    hover:shadow-xl
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-4
                    motion-reduce:transition-none
                    sm:col-span-2 sm:p-8
                  "
                >
                  {/* Elemento decorativo */}

                  <Icon
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute -bottom-10 -right-6
                      -z-10 size-52
                      rotate-[-12deg]
                      stroke-[0.7] text-white/10
                      transition-transform duration-700
                      group-hover:rotate-0
                      group-hover:scale-110
                      motion-reduce:transition-none
                    "
                  />

                  {/* Icono y flecha */}

                  <div
                    className="
                      flex items-start
                      justify-between gap-4
                    "
                  >
                    <span
                      className="
                        grid size-12
                        place-items-center
                        rounded-2xl
                        border border-white/20
                        bg-white/15
                        backdrop-blur-sm
                      "
                    >
                      <Icon className="size-6 stroke-[1.7]" />
                    </span>

                    <span
                      className="
                        grid size-10
                        place-items-center
                        rounded-full
                        border border-white/30
                        text-white
                        transition-all duration-300
                        group-hover:border-white
                        group-hover:bg-white
                        group-hover:text-primary
                        motion-reduce:transition-none
                      "
                    >
                      <ArrowUpRight
                        className="
                          size-5
                          transition-transform
                          duration-300
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                          motion-reduce:transition-none
                        "
                      />
                    </span>
                  </div>

                  {/* Contenido */}

                  <div className="relative mt-7">
                    <h3
                      className="
                        font-display text-2xl
                        font-medium text-white
                        sm:text-3xl
                      "
                    >
                      {card.title}
                    </h3>

                    <p
                      className="
                        mt-2 max-w-md
                        text-sm leading-relaxed
                        text-white/85
                        sm:text-base
                      "
                    >
                      {card.text}
                    </p>
                  </div>
                </Link>
              );
            }

            // ================================
            // TARJETAS SECUNDARIAS
            // ================================

            return (
              <Link
                key={section.id}
                to={section.to}
                className="
                  group relative flex
                  min-h-[185px] flex-col
                  justify-between
                  overflow-hidden rounded-3xl
                  border border-border/80
                  bg-secondary p-5
                  transition-all duration-300
                  ease-[cubic-bezier(.16,1,.3,1)]
                  hover:-translate-y-1
                  hover:border-primary/30
                  hover:bg-background
                  hover:shadow-card
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-4
                  motion-reduce:transition-none
                  sm:p-6
                "
              >
                {/* Línea de acento animada */}

                <span
                  aria-hidden="true"
                  className="
                    absolute inset-y-0 left-0
                    w-[3px] origin-bottom
                    scale-y-0 rounded-full
                    bg-primary
                    transition-transform duration-500
                    ease-[cubic-bezier(.16,1,.3,1)]
                    group-hover:scale-y-100
                    group-focus-visible:scale-y-100
                    motion-reduce:transition-none
                  "
                />

                {/* Icono y flecha */}

                <div
                  className="
                    flex items-start
                    justify-between gap-3
                  "
                >
                  <span
                    className="
                      grid size-11
                      place-items-center
                      rounded-xl bg-primary/10
                      text-primary
                      transition-colors duration-300
                      group-hover:bg-primary
                      group-hover:text-primary-foreground
                    "
                  >
                    <Icon className="size-5 stroke-[1.8]" />
                  </span>

                  <ArrowUpRight
                    className="
                      size-5 shrink-0
                      text-primary/45
                      transition-all duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:text-primary
                      motion-reduce:transition-none
                    "
                  />
                </div>

                {/* Contenido */}

                <div className="mt-5">
                  <h3
                    className="
                      font-display text-xl
                      font-medium leading-tight
                      text-brand-deep
                    "
                  >
                    {card.title}
                  </h3>

                  <p
                    className="
                      mt-2 text-sm
                      leading-relaxed
                      text-muted-foreground
                    "
                  >
                    {card.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
