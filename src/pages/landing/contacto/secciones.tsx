import {
  Heart,
  Users,
  Trees,
  Newspaper,
  ShoppingBag,
  MapPin,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { DonationForm } from "@/components/DonationForm";

export const contactSections = [
  {
    id: "donaciones",
    es: "Donaciones y membresía",
    en: "Donations & membership",
    icon: Heart,
  },
  {
    id: "turismo",
    es: "Turismo y reservas",
    en: "Tourism & reserves",
    icon: Trees,
  },
  {
    id: "prensa",
    es: "Contacto prensa",
    en: "Press contact",
    icon: Newspaper,
  },
  {
    id: "souvenirs",
    es: "Souvenirs",
    en: "Souvenirs",
    icon: ShoppingBag,
  },
  {
    id: "oficinas",
    es: "Oficinas",
    en: "Offices",
    icon: MapPin,
  },
  {
    id: "guiadecampoaves",
    es: "Guía de campo Aves de Bolivia",
    en: "Birds of Bolivia field guide",
    icon: BookOpen,
  },
] as const;

const links = {
  turismo: "visitanuestrasreservas",
  prensa: "prensa",
  souvenirs: "souvenirs",
  oficinas: "oficinas",
  guiadecampoaves: "guiadecampoaves",
} as const;

export default function SeccionesContacto() {
  const { lang } = useI18n();
  const es = lang === "es";

  return (
    <>
      {/* =========================
          DONACIONES Y MEMBRESÍA
      ========================== */}
      <section id="donaciones" className="section">
        <div className="container-site grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl bg-secondary p-6 sm:p-10">
            <Users className="size-10 text-primary" />

            <h2 className="mt-5 font-display text-3xl text-brand-deep">
              {es ? "Hazte miembro" : "Become a member"}
            </h2>

            <p className="mt-4 text-muted-foreground">
              {es
                ? "Elige tu plan y forma parte de nuestra comunidad de conservación."
                : "Choose your plan and join our conservation community."}
            </p>

            <Link
              to="/contacto/haztemiembro"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {es ? "Conocer los planes" : "Explore plans"}
            </Link>
          </div>

          <div className="min-w-0 rounded-3xl border border-border bg-background p-4 shadow-card sm:p-8">
            <DonationForm />
          </div>
        </div>
      </section>

      {/* =========================
          ACCESOS DIRECTOS
      ========================== */}
      <section className="relative overflow-hidden">
        {/* Fondo de paisaje */}
        <div className="absolute inset-0">
          <img
            src="/images/home/2.jpg"
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-deep/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/30 via-brand-deep/55 to-brand-deep/70" />
        </div>

        <div className="relative container-site py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center text-primary-foreground">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
              {es ? "Más formas de conectar" : "More ways to connect"}
            </p>

            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">
              {es ? "Explora nuestras opciones" : "Explore our options"}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              {es
                ? "Accede rápidamente a turismo y reservas, prensa, souvenirs, oficinas y la guía de campo de aves de Bolivia."
                : "Quickly access tourism and reserves, press contact, souvenirs, offices, and the Birds of Bolivia field guide."}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {contactSections
              .filter((section) => section.id !== "donaciones")
              .map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="group rounded-[2rem] border border-white/65 bg-white/95 p-6 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-20px_rgba(0,0,0,0.42)] sm:p-8"
                  >
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-7" />
                    </div>

                    <h2 className="mt-6 font-display text-2xl leading-tight text-brand-deep sm:text-3xl">
                      {es ? section.es : section.en}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {section.id === "turismo" &&
                        (es
                          ? "Conoce nuestras reservas, descubre experiencias de naturaleza y solicita tu visita."
                          : "Discover our reserves, explore nature experiences and request your visit.")}
                      {section.id === "prensa" &&
                        (es
                          ? "Encuentra información institucional y canales de contacto para medios de comunicación."
                          : "Find institutional information and contact channels for the press.")}
                      {section.id === "souvenirs" &&
                        (es
                          ? "Explora artículos inspirados en la biodiversidad y solicita tu pedido por WhatsApp."
                          : "Browse biodiversity-inspired items and request your order via WhatsApp.")}
                      {section.id === "oficinas" &&
                        (es
                          ? "Ubica nuestros puntos de atención y conoce nuestros canales institucionales."
                          : "Find our contact locations and institutional communication channels.")}
                      {section.id === "guiadecampoaves" &&
                        (es
                          ? "Accede a la guía de campo para conocer más sobre las aves de Bolivia."
                          : "Access the field guide to learn more about the birds of Bolivia.")}
                    </p>

                    <Link
                      to={`/contacto/${links[section.id]}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3 hover:underline"
                    >
                      {es ? "Conocer más" : "Learn more"}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </section>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}