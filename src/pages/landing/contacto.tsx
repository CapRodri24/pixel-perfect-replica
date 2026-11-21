
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUpRight,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import SeccionesContacto, {
  contactSections,
} from "./contacto/secciones";
import { CanalesContacto } from "./contacto/oficinas";

const field =
  "mt-1.5 min-h-12 w-full min-w-0 rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm";

export default function Contacto() {
  const { lang, t } = useI18n();
  const es = lang === "es";

  const { hash, key } = useLocation();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({
            block: "start",
            behavior: "instant",
          });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, key]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
  };

  const navigation = [
    ...contactSections,
    {
      id: "consultas",
      es: "Consultas",
      en: "General queries",
      icon: MessageCircle,
    },
  ];

  const getDestination = (id: string) => {
    if (id === "donaciones") return "/donar";

    if (id === "turismo") {
      return "/contacto/visitanuestrasreservas";
    }

    if (
      ["prensa", "souvenirs", "guiadecampoaves", "oficinas"].includes(id)
    ) {
      return `/contacto/${id}`;
    }

    return `/contacto#${id}`;
  };

  return (
    <div
      id="contacto"
      className="min-h-[70vh] overflow-x-clip"
    >
      <section className="relative isolate overflow-hidden bg-brand-deep text-white">
        <img
          src="/images/home/1.jpg"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/80 via-black/55 to-black/20" />

        <div className="container-site py-11 sm:py-20">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-white/85 hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {es ? "Inicio" : "Home"}
          </Link>

          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-6xl">
            {es ? "Contacto" : "Contact"}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {es
              ? "Conecta con Armonía y descubre cómo participar en la conservación."
              : "Connect with Armonía and discover how to get involved in conservation."}
          </p>
        </div>
      </section>

      <nav
        aria-label={
          es ? "Secciones de contacto" : "Contact sections"
        }
        className="border-b border-border bg-background"
      >
        <div className="container-site py-4 sm:py-5">
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
            {navigation.map(
              ({ id, es: label, en, icon: Icon }) => {
                const active = hash === `#${id}`;

                return (
                  <Link
                    key={id}
                    to={getDestination(id)}
                    aria-current={
                      active ? "location" : undefined
                    }
                    className={`armonia-subindice flex min-h-12 shrink-0 snap-start items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors sm:shrink sm:px-3 ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-brand-deep hover:border-primary hover:bg-secondary"
                    }`}
                  >
                    <Icon className="size-5 shrink-0" />

                    <span className="flex-1 whitespace-nowrap sm:whitespace-normal">
                      {es ? label : en}
                    </span>

                    {id === "consultas" ? (
                      <ArrowDown className="size-3 shrink-0" />
                    ) : (
                      <ArrowUpRight className="size-3 shrink-0" />
                    )}
                  </Link>
                );
              }
            )}
          </div>

          <p className="mt-1 text-center text-xs text-muted-foreground sm:hidden">
            {es
              ? "Desliza para explorar las opciones de contacto"
              : "Swipe to explore contact options"}
          </p>
        </div>
      </nav>

      <CanalesContacto />

      <SeccionesContacto />

      <section
        id="consultas"
        className="section scroll-mt-24 bg-muted/40"
      >
        <div className="container-site grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div className="max-w-xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircle className="size-7" />
            </span>

            <h2 className="mt-4 font-display text-3xl leading-tight text-brand-deep sm:text-4xl">
              {es ? "Consultas" : "General queries"}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {es
                ? "Cuéntanos cómo podemos ayudarte. Selecciona el motivo de tu consulta y completa el formulario."
                : "Tell us how we can help. Choose your enquiry topic and complete the form."}
            </p>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {es
                ? "Formulario de demostración: no envía mensajes reales."
                : "Demo form: no real messages are sent."}
            </p>
          </div>

          <form
            id="form"
            onSubmit={submit}
            className="min-w-0 rounded-3xl border border-border bg-background p-5 shadow-card sm:p-8"
          >
            <h3 className="font-display text-2xl leading-tight text-brand-deep">
              {t("contact.form.title")}
            </h3>

            <div className="mt-6 grid gap-5">
              <label className="block min-w-0 text-sm font-medium">
                {t("contact.form.name")}

                <input
                  required
                  name="name"
                  autoComplete="name"
                  className={field}
                />
              </label>

              <label className="block min-w-0 text-sm font-medium">
                {t("contact.form.email")}

                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  className={field}
                />
              </label>

              <label className="block min-w-0 text-sm font-medium">
                {t("contact.form.topic")}

                <select
                  required
                  name="topic"
                  defaultValue=""
                  className={field}
                >
                  <option value="" disabled>
                    {es ? "Seleccionar" : "Select"}
                  </option>

                  {[
                    ...contactSections,
                    {
                      id: "consultas",
                      es: "Otras consultas",
                      en: "Other queries",
                    },
                  ].map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {es ? item.es : item.en}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 text-sm font-medium">
                {t("contact.form.message")}

                <textarea
                  required
                  name="message"
                  rows={5}
                  className={field}
                />
              </label>

              <Button
                type="submit"
                variant="hero"
                className="min-h-12 w-full rounded-full sm:w-fit"
              >
                {t("contact.form.send")}
              </Button>

              {sent && (
                <p
                  role="status"
                  className="flex items-start gap-2 text-sm leading-relaxed text-primary"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />

                  <span>
                    {es
                      ? "Prueba completada. No se ha enviado ningún mensaje real."
                      : "Demo completed. No real message was sent."}
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
