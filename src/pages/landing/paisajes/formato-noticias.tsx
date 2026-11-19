import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { EditorialContent, useLandscapePrograms, type EditorialBlock } from "./formato_programa";
import { useNewsItems, NewsCard } from "./noticias-mock";

// Contenido editorial de demostración: cada noticia puede tener cualquier número de bloques.
const demoGallery = ["/images/home/1.jpg", "/images/home/2.jpg", "/images/home/3.jpg"];
const demoVideos: Readonly<Record<string, string>> = { n1: "BUuG52ueZQc", n3: "xguICbF6rEw", n4: "BUuG52ueZQc" };

export default function FormatoNoticias({ id }: { id: string }) {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const items = useNewsItems();
  const programs = useLandscapePrograms();
  const item = items.find(n => n.id === id);
  if (!item) return <div className="container-site section"><p>{es ? "Noticia no encontrada." : "News item not found."}</p><Link to="/noticias" className="mt-4 inline-flex text-primary underline">{es ? "Volver a noticias" : "Back to news"}</Link></div>;
  const program = item.programId ? programs.find(p => p.id === item.programId) : undefined;
  const videoId = demoVideos[item.id];
  const blocks: EditorialBlock[] = [
    { type: "paragraph", text: item.text },
    { type: "image", src: item.image, alt: item.title },
    { type: "heading", text: es ? "Contexto de la noticia" : "Story background" },
    { type: "paragraph", text: es ? "El trabajo de conservación requiere conocer las características de cada territorio, identificar las prioridades de protección e integrar la experiencia de las personas que viven en él. Las actividades de campo y el intercambio de información permiten comprender mejor las oportunidades y los desafíos de la biodiversidad boliviana.\n\nEsta publicación de demostración presenta un espacio para explicar el contexto de la actividad, sus objetivos, los actores involucrados y los próximos pasos. Los datos y resultados específicos se incorporarán cuando se publique el contenido definitivo." : "Conservation work requires understanding each territory, identifying protection priorities and incorporating the experience of the people who live there. Field activities and knowledge sharing help us understand the opportunities and challenges facing Bolivia’s biodiversity.\n\nThis demo article provides space to explain the activity’s context, objectives, stakeholders and next steps. Specific data and results will be added when the final content is published." },
    { type: "heading", text: es ? "Galería de imágenes" : "Image gallery" },
    { type: "gallery", images: [{ src: item.image, alt: item.title }, ...demoGallery.map((src, i) => ({ src, alt: `${es ? "Imagen de demostración" : "Demo image"} ${i + 1}` }))] },
    { type: "paragraph", text: es ? "La documentación visual ayuda a compartir el contexto de las acciones de conservación con distintos públicos. Esta galería contiene imágenes provisionales para probar el diseño y la navegación de la noticia." : "Visual documentation helps share the context of conservation activities with different audiences. This gallery contains provisional images to test the article layout and navigation." },
  ];
  if (videoId) blocks.push(
    { type: "heading", text: es ? "Video de demostración" : "Demo video" },
    { type: "videos", videos: [{ id: videoId, title: es ? "Video de conservación (referencial)" : "Conservation video (reference)" }] },
  );
  const related = program ? items.filter(n => n.id !== item.id && n.programId === program.id) : [];
  return <article className="bg-background"><div className="container-site py-10 sm:py-16"><div className="mx-auto max-w-4xl">
    <Link to="/noticias" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />{es ? "Volver a noticias" : "Back to news"}</Link>
    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary">{t(`news.categories.${item.category}`)}</span>
      <span className="flex items-center gap-2"><Calendar className="size-4" />{new Date(item.date).toLocaleDateString(es ? "es-BO" : "en-US", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}</span>
      <span className="text-xs">{t("news.demo")}</span>
    </div>
    <h1 className="mb-6 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">{item.title}</h1>
    {program && <Link to={`/programas/${program.id}`} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-primary hover:underline">{program.name}<ArrowUpRight className="size-4" /></Link>}
    <EditorialContent key={item.id} blocks={blocks} />
    {related.length > 0 && <section className="mt-14 border-t border-border pt-10"><h2 className="mb-6 font-display text-2xl text-brand-deep sm:text-3xl">{es ? "Más noticias del programa" : "More program news"}</h2><div className="grid gap-5 sm:grid-cols-2">{related.map(n => <NewsCard key={n.id} item={n} />)}</div></section>}
  </div></div></article>;
}
