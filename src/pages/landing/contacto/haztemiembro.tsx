
import { useEffect, useRef, useState } from "react";
import {
  Bird,
  Trees,
  Mountain,
  Check,
  ArrowRight,
  ArrowLeft,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { DemoForm, field } from "./comun";

const plans = [
  {
    id: "alas",
    es: "Alas libres",
    en: "Free wings",
    price: 30,
    icon: Bird,
    descEs:
      "Un primer paso para apoyar la conservación de aves amenazadas.",
    descEn: "A first step to support threatened birds.",
    benefitsEs: [
      "Boletín institucional",
      "Noticias de conservación",
    ],
    benefitsEn: [
      "Institutional newsletter",
      "Conservation news",
    ],
    image: "/images/home/1.jpg",
    gradient:
      "from-[#12486c] via-[#2381C4]/85 to-[#2381C4]/35",
    accent: "text-[#185e91]",
    tint: "bg-[#2381C4]/10",
    button: "bg-[#185e91] hover:bg-[#12486c]",
    ring: "ring-[#2381C4]",
  },
  {
    id: "habitat",
    es: "Hábitat vivo",
    en: "Living habitat",
    price: 60,
    icon: Trees,
    descEs:
      "Contribuye a la protección de hábitats y al trabajo con comunidades.",
    descEn: "Support habitat protection and community work.",
    benefitsEs: [
      "Beneficios de Alas libres",
      "Invitaciones a charlas educativas",
    ],
    benefitsEn: [
      "Free wings benefits",
      "Educational talk invitations",
    ],
    image: "/images/home/2.jpg",
    gradient:
      "from-[#164735] via-[#34734e]/85 to-[#34734e]/35",
    accent: "text-[#246344]",
    tint: "bg-[#34734e]/10",
    button: "bg-[#246344] hover:bg-[#164735]",
    ring: "ring-[#34734e]",
  },
  {
    id: "guardian",
    es: "Guardianes de la naturaleza",
    en: "Nature guardians",
    price: 120,
    icon: Mountain,
    descEs:
      "Un compromiso sostenido con paisajes, reservas y biodiversidad.",
    descEn:
      "Sustained commitment to landscapes, reserves and biodiversity.",
    benefitsEs: [
      "Beneficios de Hábitat vivo",
      "Actualizaciones especiales de proyectos",
    ],
    benefitsEn: [
      "Living habitat benefits",
      "Special project updates",
    ],
    image: "/images/home/3.jpg",
    gradient:
      "from-[#58411b] via-[#987020]/85 to-[#987020]/35",
    accent: "text-[#805b19]",
    tint: "bg-[#b38a30]/10",
    button: "bg-[#805b19] hover:bg-[#58411b]",
    ring: "ring-[#b38a30]",
  },
] as const;

export default function HazteMiembro() {
  const { lang } = useI18n();
  const es = lang === "es";

  const [selected, setSelected] = useState<string | null>(
    null
  );

  const plan = plans.find((p) => p.id === selected);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (!selected) return;

    const frame = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selected]);

  const handleSelectPlan = (id: string) => {
    if (selected === id) {
      formRef.current?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    } else {
      setSelected(id);
    }
  };

  return (
    <main className="min-h-[70vh] overflow-x-clip bg-background">
      <header className="relative isolate overflow-hidden bg-[#153e50] text-white">
        <img
          src="/images/home/2.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#103441]/95 via-[#103441]/80 to-[#103441]/30" />

        <div className="container-site py-10 sm:py-20 lg:py-24">
          <Link
            to="/contacto"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
          >
            <ArrowLeft className="size-4 shrink-0" />
            {es ? "Volver a contacto" : "Back to contact"}
          </Link>

          <div className="mt-7 inline-flex max-w-full items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm sm:mt-8">
            <Heart className="size-4 shrink-0" />
            <span>
              {es
                ? "Membresías Armonía"
                : "Armonía memberships"}
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-6xl">
            {es
              ? "Sé parte de la conservación"
              : "Be part of conservation"}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {es
              ? "Elige cómo apoyar la conservación y forma parte de una comunidad comprometida con la biodiversidad de Bolivia."
              : "Choose how to support conservation and join a community committed to Bolivia’s biodiversity."}
          </p>
        </div>
      </header>

      <section className="overflow-hidden bg-secondary/40">
        <div className="container-site py-10 sm:py-16">
          <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {es ? "Elige tu plan" : "Choose your plan"}
            </p>

            <h2 className="mt-3 font-display text-3xl leading-tight text-brand-deep sm:text-4xl">
              {es
                ? "Tres formas de sumar tu compromiso"
                : "Three ways to make a commitment"}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {es
                ? "Planes, aportes mensuales y beneficios de ejemplo, sujetos a aprobación."
                : "Sample plans, monthly contributions and benefits, subject to approval."}
            </p>
          </div>

          <div
            aria-label={
              es
                ? "Planes de membresía"
                : "Membership plans"
            }
            className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-1 pb-6 pt-1 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-1 md:pt-1"
          >
            {plans.map((p) => {
              const Icon = p.icon;
              const active = selected === p.id;

              return (
                <article
                  key={p.id}
                  className={`group flex w-[86%] max-w-[370px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-card transition-all duration-300 motion-safe:hover:-translate-y-2 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none md:w-auto md:max-w-none ${
                    active
                      ? `ring-2 ring-offset-2 ring-offset-background ${p.ring}`
                      : ""
                  }`}
                >
                  <div className="relative isolate flex min-h-44 flex-col justify-between overflow-hidden p-5 text-white sm:min-h-48 sm:p-6">
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                    />

                    <div
                      className={`absolute inset-0 -z-10 bg-linear-to-t ${p.gradient}`}
                    />

                    <div className="flex items-center justify-between gap-2">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/40 bg-white/15 backdrop-blur-sm">
                        <Icon className="size-7 stroke-[1.7]" />
                      </span>

                      {active && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#164735]">
                          <Check className="size-3" />
                          {es ? "Seleccionado" : "Selected"}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-6 font-display text-2xl leading-tight text-white">
                      {es ? p.es : p.en}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div
                      className={`rounded-2xl p-4 ${p.tint}`}
                    >
                      <p
                        className={`font-display text-4xl font-medium ${p.accent} dark:text-foreground`}
                      >
                        Bs {p.price}
                        <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
                          {" "}
                          / {es ? "mes" : "month"}
                        </span>
                      </p>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      {es ? p.descEs : p.descEn}
                    </p>

                    <ul className="my-6 flex-1 space-y-3">
                      {(es
                        ? p.benefitsEs
                        : p.benefitsEn
                      ).map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 text-sm leading-relaxed"
                        >
                          <span
                            className={`grid size-5 shrink-0 place-items-center rounded-full ${p.tint} ${p.accent} dark:text-foreground`}
                          >
                            <Check className="size-3.5" />
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        handleSelectPlan(p.id)
                      }
                      className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${p.button}`}
                    >
                      <span>
                        {active
                          ? es
                            ? "Continuar inscripción"
                            : "Continue registration"
                          : es
                          ? "Elegir plan"
                          : "Choose plan"}
                      </span>
                      <ArrowRight className="size-4 shrink-0" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-1 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground md:hidden">
            <span>
              {es
                ? "Desliza para comparar los planes"
                : "Swipe to compare plans"}
            </span>
            <ArrowRight className="size-4" />
          </div>

          {plan && (
            <div
              ref={formRef}
              key={plan.id}
              className="mx-auto mt-10 max-w-3xl scroll-mt-24 sm:mt-12 sm:scroll-mt-28"
            >
              <div
                className={`mb-4 flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${plan.tint}`}
              >
                <div className="flex items-center gap-3">
                  <plan.icon
                    className={`size-7 shrink-0 ${plan.accent} dark:text-foreground`}
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {es ? "Tu plan" : "Your plan"}
                    </p>

                    <p className="font-semibold">
                      {es ? plan.es : plan.en}
                    </p>
                  </div>
                </div>

                <span className="font-display text-xl">
                  Bs {plan.price} /{" "}
                  {es ? "mes" : "month"}
                </span>
              </div>

              <DemoForm
                title={
                  es
                    ? "Completa tu inscripción"
                    : "Complete your registration"
                }
                submitLabel={
                  es
                    ? "Solicitar membresía"
                    : "Request membership"
                }
              >
                <label className="text-sm font-medium sm:col-span-2">
                  {es ? "Ciudad y país" : "City and country"}
                  <input
                    required
                    name="city"
                    className={field}
                  />
                </label>
              </DemoForm>
            </div>
          )}

          <div className="mx-auto mt-9 flex max-w-xl items-center justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <span>
              {es
                ? "Demostración: no se realizan cobros ni registros reales."
                : "Demo: no real payments or registrations are processed."}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
