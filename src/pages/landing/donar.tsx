
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Globe,
  Smartphone,
  ScanLine,
  Users,
} from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";
import { DonationForm } from "@/components/DonationForm";
import { Button } from "@/components/ui/button";
import { CarruselMovil } from "@/components/CarruselMovil";

// ==========================================
// AVE DECORATIVA SOBRE EL QR
// ==========================================

function PerchedBird() {
  return (
    <svg
      viewBox="0 0 180 130"
      aria-hidden="true"
      className="
        pointer-events-none absolute
        -top-[94px] left-1/2 z-10
        h-[110px] w-[152px]
        -translate-x-1/2
        drop-shadow-md
      "
    >
      {/* Cola */}

      <path
        d="M76 70 L27 119 L44 120 L99 80 Z"
        fill="#245c47"
      />

      <path
        d="M79 70 L43 111 L57 112 L103 77 Z"
        fill="#34734e"
      />

      {/* Cuerpo */}

      <ellipse
        cx="99"
        cy="62"
        rx="37"
        ry="25"
        transform="rotate(-25 99 62)"
        fill="#4b9461"
      />

      {/* Pecho */}

      <path
        d="
          M112 37
          C140 38 143 64 120 81
          C108 89 96 88 91 80
          C109 72 119 57 112 37 Z
        "
        fill="#91b968"
      />

      {/* Ala */}

      <g
        className="
          origin-[90px_60px]
          motion-safe:animate-[bird-wing_5s_ease-in-out_infinite]
        "
      >
        <path
          d="
            M114 54
            C95 41 66 49 58 67
            C71 81 98 84 116 65 Z
          "
          fill="#276749"
        />

        <path
          d="M66 65 Q88 78 108 62"
          fill="none"
          stroke="#528d6c"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M75 72 Q91 79 105 70"
          fill="none"
          stroke="#528d6c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Cabeza */}

      <g
        className="
          origin-[126px_40px]
          motion-safe:animate-[bird-head_6s_ease-in-out_infinite]
        "
      >
        <circle
          cx="130"
          cy="35"
          r="23"
          fill="#58a46c"
        />

        {/* Mejilla */}

        <ellipse
          cx="138"
          cy="43"
          rx="11"
          ry="9"
          fill="#a9ca83"
        />

        {/* Pico */}

        <path
          d="
            M148 27
            Q169 23 166 38
            Q164 45 151 44
            L145 38 Z
          "
          fill="#d8ab57"
        />

        <path
          d="M149 37 L164 37 L157 45 Z"
          fill="#a97830"
        />

        {/* Ojo */}

        <circle
          cx="138"
          cy="28"
          r="6"
          fill="#e6efda"
        />

        <circle
          cx="139"
          cy="28"
          r="3.5"
          fill="#20382d"
        />

        <circle
          cx="140"
          cy="26.5"
          r="1.2"
          fill="#ffffff"
        />
      </g>

      {/* Patas */}

      <g
        stroke="#a17d4d"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M99 83 L99 101" />
        <path d="M117 82 L117 101" />

        <path d="M92 102 L105 102" />
        <path d="M110 102 L123 102" />
      </g>

      <style>{`
        @keyframes bird-head {
          0%, 35%, 55%, 100% {
            transform: rotate(0deg);
          }

          42% {
            transform: rotate(-8deg);
          }

          48% {
            transform: rotate(5deg);
          }
        }

        @keyframes bird-wing {
          0%, 75%, 100% {
            transform: rotate(0deg);
          }

          82% {
            transform: rotate(-5deg);
          }

          89% {
            transform: rotate(2deg);
          }
        }
      `}</style>
    </svg>
  );
}

// ==========================================
// PÁGINA DE DONACIONES
// ==========================================

export default function Donar() {
  const { lang } = useI18n();
  const es = lang === "es";

  return (
    <div className="min-h-screen bg-background">

      {/* ==================================
          PORTADA
          ================================== */}

      <section
        className="
          relative isolate overflow-hidden
          bg-brand-deep text-white
        "
      >
        <img
          src="/images/home/1.jpg"
          alt=""
          className="
            absolute inset-0 -z-20
            h-full w-full object-cover
            object-center
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute inset-0 -z-10
            bg-gradient-to-r
            from-black/80 via-black/50
            to-black/35
          "
        />

        <div
          className="
            container-site relative
            py-14 sm:py-20 lg:py-24
          "
        >
          <Link
            to="/"
            className="
              inline-flex items-center gap-2
              text-sm font-medium text-white/80
              transition-colors hover:text-white
            "
          >
            <ArrowLeft className="size-4" />

            {es ? "Volver al inicio" : "Back to home"}
          </Link>

          <div className="mt-8 max-w-3xl">

            <span
              className="
                inline-flex items-center gap-2
                rounded-full border border-white/25
                bg-white/10 px-4 py-2
                text-xs font-semibold uppercase
                tracking-[0.2em]
                backdrop-blur-sm
              "
            >
              <Heart className="size-4" />

              {es
                ? "Apoya la conservación"
                : "Support conservation"}
            </span>

            <h1
              className="
                mt-6 font-display
                text-4xl leading-tight text-white
                sm:text-5xl lg:text-6xl
              "
            >
              {es
                ? "Por las aves. Por Bolivia."
                : "For birds. For Bolivia."}
            </h1>

            <p
              className="
                mt-5 max-w-2xl
                text-base leading-relaxed
                text-white/85 sm:text-lg
              "
            >
              {es
                ? "Tu aporte hace posible que sigamos protegiendo las aves amenazadas, conservando sus hábitats y trabajando junto a las comunidades locales de Bolivia."
                : "Your contribution helps us continue protecting threatened birds, conserving their habitats and working alongside local communities in Bolivia."}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================
          MÉTODOS DE DONACIÓN
          ================================== */}

      <section className="section">
        <div className="container-site">

          {/* Encabezado */}

          <div className="mx-auto max-w-2xl text-center">
            <span
              className="
                text-xs font-bold uppercase
                tracking-[0.2em] text-primary
              "
            >
              {es ? "Tu aporte cuenta" : "Your gift matters"}
            </span>

            <h2
              className="
                mt-3 font-display text-3xl
                text-brand-deep sm:text-4xl
              "
            >
              {es
                ? "Elige cómo apoyar"
                : "Choose how to give"}
            </h2>

            <p
              className="
                mt-4 text-sm leading-relaxed
                text-muted-foreground sm:text-base
              "
            >
              {es
                ? "Contamos con diferentes alternativas para que puedas contribuir a nuestro trabajo de conservación."
                : "We offer different ways for you to support our conservation work."}
            </p>
          </div>

          {/* En celular las dos formas de donar se muestran como carrusel (con pestañas)
              para que la página no sea interminable; en escritorio, lado a lado. */}
          <div className="mx-auto mt-10 max-w-6xl">
          <CarruselMovil
            quiebre="lg"
            lleno
            nombre={es ? "Formas de donar" : "Ways to give"}
            etiquetas={es ? ["Desde Bolivia", "Internacional"] : ["From Bolivia", "International"]}
            gridEscritorio="items-start lg:grid-cols-2 lg:gap-10"
          >

            {/* ==============================
                DONACIONES PARA BOLIVIA
                ============================== */}

            <article
              className="
                relative overflow-hidden
                rounded-3xl border border-border
                bg-background shadow-card
              "
            >

              {/* Franja tricolor */}

              <div
                aria-hidden="true"
                className="grid h-1.5 grid-cols-3"
              >
                <span className="bg-[#a63b40]" />
                <span className="bg-[#b38a30]" />
                <span className="bg-[#34734e]" />
              </div>

              <div className="p-6 sm:p-8">

                {/* Encabezado */}

                <div className="flex items-center gap-4">
                  <span
                    className="
                      grid size-12 shrink-0
                      place-items-center rounded-2xl
                      bg-primary/10 text-primary
                    "
                  >
                    <ScanLine className="size-6" />
                  </span>

                  <div>
                    <span
                      className="
                        text-[10px] font-semibold
                        uppercase tracking-widest
                        text-muted-foreground
                      "
                    >
                      {es
                        ? "Donación nacional"
                        : "Local donations"}
                    </span>

                    <h2
                      className="
                        mt-1 font-display
                        text-2xl text-brand-deep
                        sm:text-3xl
                      "
                    >
                      {es ? "Para Bolivia" : "For Bolivia"}
                    </h2>
                  </div>
                </div>

                <p
                  className="
                    mt-5 text-sm leading-relaxed
                    text-muted-foreground
                  "
                >
                  {es
                    ? "Si te encuentras en Bolivia, puedes realizar tu donación escaneando nuestro código QR desde la aplicación de tu entidad bancaria."
                    : "If you are in Bolivia, you can make a donation by scanning our QR code using your banking application."}
                </p>

                {/* Contenedor del QR */}

                <div
                  className="
                    relative mt-8 overflow-hidden
                    rounded-3xl bg-gradient-to-b
                    from-primary/5
                    via-muted/60
                    to-primary/10
                    px-5 pb-7 pt-28
                  "
                >

                  {/* Decoraciones de fondo */}

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute -left-20 -top-20
                      size-56 rounded-full
                      bg-[#34734e]/10 blur-3xl
                    "
                  />

                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute -bottom-16 -right-20
                      size-56 rounded-full
                      bg-primary/10 blur-3xl
                    "
                  />

                  <div className="relative mx-auto max-w-[275px]">

                    {/* Ave posada sobre el marco */}

                    <PerchedBird />

                    {/* QR original sin modificaciones */}

                    <div
                      className="
                        relative rounded-2xl
                        border border-black/5
                        bg-white p-4
                        shadow-[0_12px_35px_-10px_rgba(0,0,0,0.18)]
                      "
                    >
                      <img
                        src="/images/qr.png"
                        alt={
                          es
                            ? "Código QR para donaciones a Asociación Armonía"
                            : "QR code for donations to Asociación Armonía"
                        }
                        className="
                          block h-auto w-full
                          rounded-none object-contain
                        "
                      />
                    </div>
                  </div>

                  {/* Mensaje inferior */}

                  <div className="relative mt-6 text-center">
                    <span
                      className="
                        inline-flex items-center gap-2
                        rounded-full bg-background/80
                        px-4 py-2
                        text-sm font-semibold
                        text-primary shadow-sm
                      "
                    >
                      <Smartphone className="size-4" />

                      {es
                        ? "Escanea y dona"
                        : "Scan and donate"}
                    </span>

                    <p
                      className="
                        mx-auto mt-3 max-w-xs
                        text-xs leading-relaxed
                        text-muted-foreground
                      "
                    >
                      {es
                        ? "Cada aporte contribuye a conservar nuestra biodiversidad."
                        : "Every contribution helps conserve our biodiversity."}
                    </p>
                  </div>
                </div>

                {/* Instrucciones */}

                <div className="mt-7">
                  <h3
                    className="
                      font-display text-lg
                      text-brand-deep
                    "
                  >
                    {es ? "¿Cómo donar?" : "How to donate?"}
                  </h3>

                  <ol className="mt-4 space-y-3">
                    {(
                      es
                        ? [
                            "Abre la aplicación de tu banco.",
                            "Selecciona la opción de pago mediante QR.",
                            "Escanea el código e introduce el monto.",
                            "Verifica los datos y confirma tu aporte.",
                          ]
                        : [
                            "Open your banking application.",
                            "Select the QR payment option.",
                            "Scan the code and enter the amount.",
                            "Verify the details and confirm your gift.",
                          ]
                    ).map((step, index) => (
                      <li
                        key={step}
                        className="
                          flex items-start gap-3
                          text-sm text-muted-foreground
                        "
                      >
                        <span
                          className="
                            grid size-7 shrink-0
                            place-items-center rounded-full
                            bg-primary/10
                            text-xs font-bold text-primary
                          "
                        >
                          {index + 1}
                        </span>

                        <span className="pt-1">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>

            {/* ==============================
                DONACIONES INTERNACIONALES
                ============================== */}

            <article
              className="
                relative overflow-hidden
                rounded-3xl border border-border
                bg-background shadow-card
              "
            >
              <div
                aria-hidden="true"
                className="
                  h-1.5 bg-gradient-to-r
                  from-primary via-brand-light
                  to-primary
                "
              />

              <div className="p-6 sm:p-8">

                {/* Encabezado */}

                <div className="flex items-center gap-4">
                  <span
                    className="
                      grid size-12 shrink-0
                      place-items-center rounded-2xl
                      bg-primary/10 text-primary
                    "
                  >
                    <Globe className="size-6" />
                  </span>

                  <div>
                    <span
                      className="
                        text-[10px] font-semibold
                        uppercase tracking-widest
                        text-muted-foreground
                      "
                    >
                      {es
                        ? "Desde cualquier lugar"
                        : "From anywhere"}
                    </span>

                    <h2
                      className="
                        mt-1 font-display
                        text-2xl text-brand-deep
                        sm:text-3xl
                      "
                    >
                      {es
                        ? "Donaciones internacionales"
                        : "International donations"}
                    </h2>
                  </div>
                </div>

                <p
                  className="
                    mt-5 text-sm leading-relaxed
                    text-muted-foreground
                  "
                >
                  {es
                    ? "Apoya la conservación de las aves y los paisajes de Bolivia mediante nuestro formulario de donaciones en línea."
                    : "Support the conservation of Bolivia's birds and landscapes through our online donation form."}
                </p>

                {/* Formulario de Givebutter directamente en la tarjeta, sin un segundo recuadro ni título repetido. */}
                <div className="mt-6 min-w-0">
                  <DonationForm soloFormulario />
                </div>

                <div
                  className="
                    mt-6 flex items-start gap-3
                    rounded-2xl bg-primary/5 p-4
                  "
                >
                  <Heart
                    className="
                      mt-0.5 size-5 shrink-0
                      text-primary
                    "
                  />

                  <p
                    className="
                      text-xs leading-relaxed
                      text-muted-foreground sm:text-sm
                    "
                  >
                    {es
                      ? "Gracias por ayudarnos a dar continuidad a los esfuerzos de conservación de las aves y sus hábitats."
                      : "Thank you for helping us continue our efforts to conserve birds and their habitats."}
                  </p>
                </div>
              </div>
            </article>
          </CarruselMovil>
          </div>

          {/* ==================================
              LLAMADO A LA MEMBRESÍA
              ================================== */}

          <div
            className="
              relative mx-auto mt-12
              max-w-6xl overflow-hidden
              rounded-3xl bg-brand-deep
              text-white
            "
          >
            <Users
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -bottom-16 -right-8
                size-72 stroke-[0.5]
                text-white/10
              "
            />

            <div
              className="
                relative flex flex-col
                items-start gap-6
                p-7 sm:p-10
                lg:flex-row lg:items-center
                lg:justify-between
              "
            >
              <div className="max-w-xl">
                <span
                  className="
                    text-xs font-semibold uppercase
                    tracking-widest text-brand-light
                  "
                >
                  {es
                    ? "Un compromiso continuo"
                    : "An ongoing commitment"}
                </span>

                <h2
                  className="
                    mt-3 font-display text-2xl
                    text-white sm:text-3xl
                  "
                >
                  {es
                    ? "También puedes hacerte miembro"
                    : "You can also become a member"}
                </h2>

                <p
                  className="
                    mt-3 text-sm leading-relaxed
                    text-white/85
                  "
                >
                  {es
                    ? "Forma parte de nuestra comunidad y contribuye de manera continua a la conservación de la biodiversidad de Bolivia."
                    : "Join our community and make an ongoing contribution to the conservation of Bolivia's biodiversity."}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="
                  shrink-0 rounded-full
                  bg-white px-6 text-brand-deep
                  hover:bg-brand-light
                  hover:text-brand-deep
                "
              >
                <Link to="/contacto/haztemiembro">
                  {es
                    ? "Hazte miembro"
                    : "Become a member"}

                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
