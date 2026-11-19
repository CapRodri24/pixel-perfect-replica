import { useState } from "react";
import { RelatedNews } from "./noticias-mock";
import { ArrowLeft, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { landscapes, programs } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";

// Datos de demostración: sustituir la fuente por la API cuando exista.
export const demoLandscapeUrl = "/paisajes?paisaje=beni";
export const demoProgramLinks = [
  { id: "conservaaves", anchor: "aves" },
  { id: "kba", anchor: "kba" },
  { id: "natures-heartbeat", anchor: "natures-heartbeat" },
  { id: "accionandina", anchor: "accion-andina" },
] as const;

export function useLandscapePrograms() {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const existing = programs.map((p) => ({
    id: String(p.id), landscape: p.landscape,
    image: p.image,
    name: t<string>(`programs.items.${p.id}.name`),
    text: t<string>(`programs.items.${p.id}.text`),
  }));
  return [
    ...existing,
    { id: "kba", landscape: null, image: landscapes.find(l => l.id === "beni")?.image ?? "/images/home/1.jpg", name: es ? "KBA / Áreas clave" : "KBA / Key biodiversity areas", text: es ? "Identificación y seguimiento de sitios prioritarios para la biodiversidad." : "Identification and monitoring of priority biodiversity sites." },
    { id: "natures-heartbeat", landscape: null, image: landscapes.find(l => l.id === "yungas")?.image ?? "/images/home/2.jpg", name: "Nature's heartbeat", text: es ? "Ejemplo de iniciativa de monitoreo de ecosistemas y participación local." : "Example initiative for ecosystem monitoring and local participation." },
  ];
}

// Bloques editoriales reutilizables. Los datos mock pueden sustituirse por la API.
export type EditorialVideo = { id: string; title: string };
export type EditorialBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "videos"; videos: EditorialVideo[] };

function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const { lang } = useI18n();
  const es = lang === "es";
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const current = index % images.length;
  const currentImage = images[current];
  if (!currentImage) return null;
  const move = (step: number) => setIndex((i) => (i + step + images.length) % images.length);
  return (
    <div className="space-y-3" role="region" aria-label={es ? "Galería de imágenes" : "Image gallery"}>
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img src={currentImage.src} alt={currentImage.alt} loading="lazy" className="aspect-[16/9] w-full object-cover" />
        {images.length > 1 && <>
          <button type="button" onClick={() => move(-1)} aria-label={es ? "Imagen anterior" : "Previous image"} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => move(1)} aria-label={es ? "Imagen siguiente" : "Next image"} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white"><ChevronRight className="size-5" /></button>
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white" aria-live="polite">{current + 1} / {images.length}</span>
        </>}
      </div>
      {images.length > 1 && <div className="flex justify-center gap-1 overflow-x-auto">
        {images.map((_, i) => <button key={i} type="button" onClick={() => setIndex(i)} aria-label={`${es ? "Ver imagen" : "View image"} ${i + 1}`} aria-pressed={i === current} className={`grid size-8 shrink-0 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring`}><span className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-primary/30"}`} /></button>)}
      </div>}
    </div>
  );
}

function EditorialVideoPlayer({ video }: { video: EditorialVideo }) {
  const { lang } = useI18n();
  const es = lang === "es";
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="relative aspect-video overflow-hidden bg-overlay">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${es ? "Reproducir" : "Play"}: ${video.title}`}
            className="group absolute inset-0 size-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
            <span className="absolute inset-0 grid place-items-center bg-black/15 transition-colors group-hover:bg-black/30">
              <span className="grid size-16 place-items-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-105 motion-reduce:transition-none">
                <PlayCircle className="size-10" />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg text-brand-deep">{video.title}</h3>
        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs text-primary hover:underline">
          {es ? "Abrir en YouTube" : "Open on YouTube"}
        </a>
      </div>
    </div>
  );
}

export function EditorialContent({ blocks }: { blocks: EditorialBlock[] }) {
  return <div className="space-y-6 sm:space-y-8">
    {blocks.map((block, i) => {
      switch (block.type) {
        case "heading": return <h2 key={i} className="pt-3 font-display text-2xl leading-tight text-brand-deep sm:text-3xl">{block.text}</h2>;
        case "paragraph": return <p key={i} className="whitespace-pre-line text-base leading-relaxed text-muted-foreground sm:text-lg">{block.text}</p>;
        case "image": return <img key={i} src={block.src} alt={block.alt} loading="lazy" className="aspect-[16/9] w-full rounded-2xl object-cover" />;
        case "gallery": return <ImageCarousel key={i} images={block.images} />;
        case "videos": return <div key={i} className="grid gap-5 sm:grid-cols-2">
          {block.videos.map(video => <EditorialVideoPlayer key={video.id} video={video} />)}
        </div>;
      }
    })}
  </div>;
}

export default function FormatoPrograma({ id }: { id: string }) {
  const { lang } = useI18n();
  const es = lang === "es";
  const program = useLandscapePrograms().find(p => p.id === id);
  const anchor = demoProgramLinks.find(p => p.id === id)?.anchor;
  if (!program) return <div className="container-site section"><p>{es ? "Programa no encontrado." : "Program not found."}</p><Link className="mt-4 inline-flex text-primary underline" to="/programas">{es ? "Volver a programas" : "Back to programs"}</Link></div>;
  const demo = Boolean(anchor) || program.landscape === "beni";
  const blocks: EditorialBlock[] = [
    { type: "paragraph", text: program.text + (es ? "\n\nLa conservación de la biodiversidad requiere comprender las necesidades de las especies y las condiciones de los ecosistemas donde habitan. Esta ficha ilustra cómo un programa puede presentar sus objetivos, su ámbito de trabajo y las acciones que vinculan la investigación con la protección de la naturaleza." : "\n\nBiodiversity conservation requires understanding the needs of species and the conditions of the ecosystems they inhabit. This page illustrates how a program can present its objectives, scope and activities linking research with nature protection.") },
    { type: "image", src: program.image, alt: program.name },
    { type: "heading", text: es ? "Sobre el programa" : "About the program" },
    { type: "paragraph", text: es ? "Como ejemplo de trabajo programático, las actividades pueden incluir recorridos de campo, registro de especies y evaluación de las condiciones del hábitat. Esta información permite orientar las prioridades de conservación y planificar acciones de seguimiento a largo plazo.\n\nLa participación de las comunidades locales es también un componente importante del enfoque. Los espacios de intercambio, la educación ambiental y la colaboración con actores locales pueden contribuir a identificar soluciones compatibles con las necesidades de las personas y la protección de la biodiversidad. Este contenido es ilustrativo y no constituye un informe de resultados del programa." : "Example program activities may include field surveys, species records and assessments of habitat conditions. This information can help guide conservation priorities and plan long-term monitoring.\n\nLocal community participation is also an important part of this approach. Knowledge sharing, environmental education and collaboration with local stakeholders can help identify solutions compatible with people’s needs and biodiversity protection. This illustrative content is not a report of program results." },
    { type: "heading", text: es ? "Galería de imágenes" : "Image gallery" },
    { type: "gallery", images: [{ src: program.image, alt: program.name }, ...["/images/home/1.jpg", "/images/home/2.jpg", "/images/home/3.jpg"].map((src, i) => ({ src, alt: `${es ? "Imagen de prueba" : "Demo image"} ${i + 1}` }))] },
    { type: "paragraph", text: es ? "Las fotografías permiten acercar al visitante a los ambientes naturales, las especies y el contexto territorial del trabajo de conservación. La galería es una muestra provisional del formato de publicación; las imágenes definitivas deberán corresponder al programa y contar con sus créditos respectivos." : "Photographs help visitors discover natural environments, species and the territorial context of conservation work. This gallery is a provisional example of the publication format; final images should correspond to the program and include appropriate credits." },
    { type: "heading", text: es ? "Videos" : "Videos" },
    { type: "videos", videos: [{ id: "BUuG52ueZQc", title: es ? "La Paraba Barba Azul" : "The Blue-throated Macaw" }, { id: "ZrFLlV83MEI", title: es ? "Reserva Laney Rickman" : "Laney Rickman Reserve" }] },
  ];
  return <article className="bg-background"><div className="container-site py-10 sm:py-16"><div className="mx-auto max-w-4xl">
    <Link to={demo ? `${demoLandscapeUrl}#${anchor ?? "programas"}` : "/programas"} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />{demo ? (es ? "Volver al paisaje" : "Back to landscape") : (es ? "Volver a programas" : "Back to programs")}</Link>
    <h1 className="mb-6 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">{program.name}</h1>
    <EditorialContent key={id} blocks={blocks} />
    <RelatedNews programId={id} />
  </div></div></article>;
}
