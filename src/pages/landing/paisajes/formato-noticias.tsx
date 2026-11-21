
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import {
  EditorialContent,
  useLandscapePrograms,
  type EditorialBlock,
} from "./formato_programa";
import { useNewsItems, NewsCard } from "./noticias-mock";

const demoGallery = [
  "/images/home/1.jpg",
  "/images/home/2.jpg",
  "/images/home/3.jpg",
];

const demoVideos: Readonly<Record<string, string>> = {
  n1: "BUuG52ueZQc",
  n3: "xguICbF6rEw",
  n4: "BUuG52ueZQc",
};

export default function FormatoNoticias({
  id,
}: {
  id: string;
}) {
  const { t, lang } = useI18n();
  const es = lang === "es";

  const items = useNewsItems();
  const programs = useLandscapePrograms();

  const item = items.find((n) => n.id === id);

  if (!item) {
    return (
      <div className="container-site section">
        <p>
          {es
            ? "Noticia no encontrada."
            : "News item not found."}
        </p>

        <Link
          to="/noticias"
          className="mt-4 inline-flex text-primary underline"
        >
          {es ? "Volver a noticias" : "Back to news"}
        </Link>
      </div>
    );
  }

  const program = item.programId
    ? programs.find((p) => p.id === item.programId)
    : undefined;

  const videoId = demoVideos[item.id];

  const blocks: EditorialBlock[] = [
    {
      type: "paragraph",
      text: item.text,
    },
    {
      type: "image",
      src: item.image,
      alt: item.title,
    },
    {
      type: "heading",
      text: es ? "Contexto de la noticia" : "Story background",
    },
    {
      type: "paragraph",
      text: es
        ? "El trabajo de conservación requiere conocer las características de cada territorio, identificar las prioridades de protección e integrar la experiencia de las personas que viven en él. Las actividades de campo y el intercambio de información permiten comprender mejor las oportunidades y los desafíos de la biodiversidad boliviana.\n\nEsta publicación de demostración presenta un espacio para explicar el contexto de la actividad, sus objetivos, los actores involucrados y los próximos pasos. Los datos y resultados específicos se incorporarán cuando se publique el contenido definitivo."
        : "Conservation work requires understanding each territory, identifying protection priorities and incorporating the experience of the people who live there. Field activities and knowledge sharing help us understand the opportunities and challenges facing Bolivia’s biodiversity.\n\nThis demo article provides space to explain the activity’s context, objectives, stakeholders and next steps. Specific data and results will be added when the final content is published.",
    },
    {
      type: "heading",
      text: es ? "Galería de imágenes" : "Image gallery",
    },
    {
      type: "gallery",
      images: [
        {
          src: item.image,
          alt: item.title,
        },
        ...demoGallery.map((src, i) => ({
          src,
          alt: `${es ? "Imagen de demostración" : "Demo image"} ${i + 1}`,
        })),
      ],
    },
    {
      type: "paragraph",
      text: es
        ? "La documentación visual ayuda a compartir el contexto de las acciones de conservación con distintos públicos. Esta galería contiene imágenes provisionales para probar el diseño y la navegación de la noticia."
        : "Visual documentation helps share the context of conservation activities with different audiences. This gallery contains provisional images to test the article layout and navigation.",
    },
  ];

  if (videoId) {
    blocks.push(
      {
        type: "heading",
        text: es ? "Video de demostración" : "Demo video",
      },
      {
        type: "videos",
        videos: [
          {
            id: videoId,
            title: es
              ? "Video de conservación (referencial)"
              : "Conservation video (reference)",
          },
        ],
      }
    );
  }

  const related = program
    ? items.filter(
        (n) =>
          n.id !== item.id &&
          n.programId === program.id
      )
    : [];

  return (
    <article className="overflow-x-clip bg-background">
      <div className="container-site py-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/noticias"
            className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline sm:mb-8"
          >
            <ArrowLeft className="size-4" />
            {es ? "Volver a noticias" : "Back to news"}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              {t(`news.categories.${item.category}`)}
            </span>

            <span className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="size-4" />
              {new Date(item.date).toLocaleDateString(
                es ? "es-BO" : "en-US",
                {
                  timeZone: "UTC",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>

            <span className="text-xs">
              {t("news.demo")}
            </span>
          </div>

          <h1 className="mb-6 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">
            {item.title}
          </h1>

          {program && (
            <Link
              to={`/programas/${program.id}`}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-primary hover:underline sm:rounded-full"
            >
              <span>{program.name}</span>
              <ArrowUpRight className="size-4 shrink-0" />
            </Link>
          )}

          <EditorialContent
            key={item.id}
            blocks={blocks}
          />

          {related.length > 0 && (
            <section className="mt-12 border-t border-border pt-8 sm:mt-14 sm:pt-10">
              <h2 className="mb-6 font-display text-2xl text-brand-deep sm:text-3xl">
                {es
                  ? "Más noticias del programa"
                  : "More program news"}
              </h2>

              <div
                aria-label={
                  es
                    ? "Más noticias del programa"
                    : "More program news"
                }
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible"
              >
                {related.map((n) => (
                  <div
                    key={n.id}
                    className="w-[86%] max-w-[370px] shrink-0 snap-center sm:w-auto sm:max-w-none"
                  >
                    <NewsCard item={n} />
                  </div>
                ))}
              </div>

              {related.length > 1 && (
                <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                  {es
                    ? "Desliza para ver más noticias"
                    : "Swipe to see more news"}
                  <ArrowRight className="size-4" />
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
