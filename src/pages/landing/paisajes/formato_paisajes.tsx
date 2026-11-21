
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { landscapes } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import {
  demoProgramLinks,
  useLandscapePrograms,
  EditorialContent,
  type EditorialBlock,
} from "./formato_programa";

export default function FormatoPaisajes() {
  const { t, lang } = useI18n();
  const es = lang === "es";

  const landscape = landscapes.find((l) => l.id === "beni");
  const programs = useLandscapePrograms();

  const related = [
    ...programs.filter(
      (p) =>
        p.landscape === "beni" &&
        !demoProgramLinks.some((d) => d.id === p.id)
    ),
    ...demoProgramLinks.flatMap((d) =>
      programs.filter((p) => p.id === d.id)
    ),
  ];

  if (!landscape) {
    return (
      <div className="container-site section">
        <p>
          {es
            ? "Paisaje de prueba no disponible."
            : "Demo landscape unavailable."}
        </p>
        <Link to="/paisajes">
          {t("landscapes.back")}
        </Link>
      </div>
    );
  }

  const name = t<string>(
    `landscapes.items.${landscape.id}.name`
  );

  const blocks: EditorialBlock[] = [
    {
      type: "paragraph",
      text:
        t<string>(`landscapes.items.${landscape.id}.text`) +
        (es
          ? "\n\nLos pastizales del Beni forman un mosaico de sabanas, humedales e islas de bosque. Los cambios estacionales en la disponibilidad de agua influyen en la distribución de la fauna y en la dinámica del paisaje. Estos ambientes ofrecen espacios de alimentación, refugio y reproducción para numerosas especies de aves residentes y migratorias."
          : "\n\nThe Beni grasslands form a mosaic of savannas, wetlands and forest islands. Seasonal changes in water availability influence wildlife distribution and landscape dynamics. These environments provide feeding, shelter and breeding areas for many resident and migratory birds."),
    },
    {
      type: "image",
      src: landscape.image,
      alt: name,
    },
    {
      type: "heading",
      text: t<string>("landscapes.lines"),
    },
    {
      type: "paragraph",
      text:
        t<string[]>(
          `landscapes.items.${landscape.id}.lines`
        ).join(" · ") +
        (es
          ? ".\n\nEn este paisaje, la conservación integra la protección de hábitats, el seguimiento de aves y la búsqueda de alternativas productivas compatibles con la biodiversidad. El monitoreo de las especies ayuda a comprender sus necesidades y orientar las decisiones de manejo.\n\nEl trabajo con las comunidades y los productores locales permite explorar prácticas que favorezcan la convivencia entre las actividades económicas y la naturaleza. El aviturismo ofrece además una oportunidad para conocer el valor de estos ecosistemas y promover su cuidado."
          : ".\n\nConservation in this landscape combines habitat protection, bird monitoring and the search for productive alternatives compatible with biodiversity. Species monitoring helps explain their needs and guide management decisions.\n\nWorking with communities and local producers makes it possible to explore practices that support coexistence between economic activities and nature. Birdwatching also offers an opportunity to discover the value of these ecosystems and encourage their protection."),
    },
    {
      type: "heading",
      text: es ? "Galería de imágenes" : "Image gallery",
    },
    {
      type: "gallery",
      images: [
        { src: landscape.image, alt: name },
        { src: "/images/home/1.jpg", alt: name },
        ...related
          .filter((p) => p.landscape === "beni")
          .map((p) => ({
            src: p.image,
            alt: p.name,
          })),
      ],
    },
    {
      type: "paragraph",
      text: es
        ? "A través de las imágenes es posible conocer la diversidad de ambientes que conforman este paisaje, desde las áreas abiertas de pastizales hasta los espacios de refugio para la fauna. Esta galería contiene fotografías de demostración que serán sustituidas por material definitivo con sus respectivos créditos."
        : "The images provide a view of the diverse environments that make up this landscape, from open grasslands to wildlife refuges. This gallery contains demonstration photographs that will be replaced by final material with appropriate credits.",
    },
    {
      type: "heading",
      text: es ? "Videos" : "Videos",
    },
    {
      type: "videos",
      videos: [
        {
          id: "BUuG52ueZQc",
          title: es
            ? "La Paraba Barba Azul"
            : "The Blue-throated Macaw",
        },
        {
          id: "ZrFLlV83MEI",
          title: es
            ? "Reserva Laney Rickman"
            : "Laney Rickman Reserve",
        },
      ],
    },
  ];

  return (
    <article
      id="beni"
      className="theme-beni overflow-x-clip bg-background"
    >
      <div className="container-site py-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/paisajes"
            className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline sm:mb-8"
          >
            <ArrowLeft className="size-4" />
            {t("landscapes.back")}
          </Link>

          <h1 className="mb-6 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">
            {name}
          </h1>

          <EditorialContent blocks={blocks} />

          <section
            id="programas"
            className="mt-12 scroll-mt-24 border-t border-border pt-8 sm:mt-16"
          >
            <h2 className="font-display text-2xl leading-tight text-brand-deep sm:text-3xl">
              {es
                ? "Programas de conservación de biodiversidad en Bolivia"
                : "Biodiversity conservation programs in Bolivia"}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {es
                ? "Programas asociados para esta demostración."
                : "Associated programs for this demonstration."}
            </p>

            <div
              aria-label={es ? "Programas relacionados" : "Related programs"}
              className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible"
            >
              {related.map((program) => (
                <Link
                  key={program.id}
                  id={
                    demoProgramLinks.find(
                      (d) => d.id === program.id
                    )?.anchor ?? program.id
                  }
                  to={`/programas/${program.id}`}
                  className="group w-[86%] max-w-[360px] shrink-0 snap-center scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/50 hover:shadow-card focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none sm:w-auto sm:max-w-none"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={program.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />

                    <div className="absolute inset-0 hidden bg-black/65 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:flex lg:items-end">
                      <p className="p-4 text-sm leading-relaxed text-white">
                        {program.text}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold leading-snug text-brand-deep">
                      {program.name}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:sr-only">
                      {program.text}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {t("programs.more")}
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {related.length > 1 && (
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                {es
                  ? "Desliza para ver los programas"
                  : "Swipe to see programs"}
                <ArrowRight className="size-4" />
              </p>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
