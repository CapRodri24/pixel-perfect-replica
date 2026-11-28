
import { useEffect, useRef, useState } from "react";
import { RelatedNews } from "./noticias-publicas";
import { sanitize } from "@/pages/admin/datos";
import { estilosTextoEnriquecido } from "@/lib/textoEnriquecido";
import { pdfContenidoUrl, type BloquePublico } from "@/api/paisajesPublicosApi";
import { EnlaceIncrustado, VisorPdf } from "@/components/contenido/EnlaceIncrustado";
import { youtubeId } from "@/lib/enlaces";
import { listarProgramasPublicos, obtenerProgramaPublico, imagenProgramaUrl, type ProgramaPublicoDetalle, type ProgramaPublicoResumen } from "@/api/programasPublicosApi";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  ImageOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";

// Exports de compatibilidad para los consumidores anteriores, sin registros ficticios.
export const demoLandscapeUrl = "/paisajes";
export const demoProgramLinks: readonly { id: string; anchor: string }[] = [];
export function useLandscapePrograms() {
  const { lang } = useI18n();
  const [items, setItems] = useState<ProgramaPublicoResumen[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    listarProgramasPublicos(controller.signal).then(data => {
      if (!controller.signal.aborted) setItems(data);
    }).catch(() => { if (!controller.signal.aborted) setItems([]); });
    return () => controller.abort();
  }, []);
  return items.map(p => ({ id: p.id_programa, landscape: p.id_paisaje,
    image: imagenProgramaUrl(p.id_imagen_portada) || "",
    name: lang === "es" ? p.titulo_es : p.titulo_en,
    text: new DOMParser().parseFromString((lang === "es" ? p.descripcion_es : p.descripcion_en) || "", "text/html").body.textContent || "" }));
}

export type EditorialVideo = {
  id: string;
  title: string;
};

export type EditorialBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string; html?: boolean }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "link"; url: string; text: string }
  | { type: "embed"; url: string }
  | { type: "pdf"; id: string; name: string; size: number | null }
  | {
      type: "gallery";
      images: { src: string; alt: string; caption?: string }[];
    }
  | {
      type: "videos";
      videos: EditorialVideo[];
    };

function EditorialImage({ src, alt, className, draggable, fallbackClassName }: { src: string; alt: string; className: string; draggable?: boolean; fallbackClassName?: string }) {
  const [fallo, setFallo] = useState(false);
  useEffect(() => setFallo(false), [src]);
  if (!src || fallo) return <div role="img" aria-label={alt} className={`${fallbackClassName ?? className} grid place-items-center bg-muted text-muted-foreground`}><ImageOff className="size-10 opacity-40" /></div>;
  return <img src={src} alt={alt} loading="lazy" draggable={draggable} className={className} onError={() => setFallo(true)} />;
}

function ImageCarousel({
  images,
}: {
  images: { src: string; alt: string; caption?: string }[];
}) {
  const { lang } = useI18n();
  const es = lang === "es";

  const [index, setIndex] = useState(0);

  const touchStart = useRef<{
    x: number;
    y: number;
  } | null>(null);

  if (!images.length) return null;

  const current = index % images.length;
  const currentImage = images[current];

  if (!currentImage) return null;

  const move = (step: number) => {
    setIndex((i) => (i + step + images.length) % images.length);
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    const touch = e.touches.item(0);

    if (!touch) return;

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    const touch = e.changedTouches.item(0);

    if (!touch || !touchStart.current || images.length <= 1) {
      touchStart.current = null;
      return;
    }

    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    touchStart.current = null;

    if (
      Math.abs(dx) > 45 &&
      Math.abs(dx) > Math.abs(dy) * 1.25
    ) {
      move(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="space-y-3"
      role="region"
      aria-label={
        es ? "Galería de imágenes" : "Image gallery"
      }
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <EditorialImage
          src={currentImage.src}
          alt={currentImage.alt}
          draggable={false}
          className="aspect-[4/3] w-full select-none object-contain sm:aspect-[16/9]"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={
                es ? "Imagen anterior" : "Previous image"
              }
              className="absolute left-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white sm:left-3"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => move(1)}
              aria-label={
                es ? "Imagen siguiente" : "Next image"
              }
              className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white sm:right-3"
            >
              <ChevronRight className="size-5" />
            </button>

            <span
              className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white"
              aria-live="polite"
            >
              {current + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {currentImage.caption && <p className="text-center text-sm text-muted-foreground">{currentImage.caption}</p>}
      {images.length > 1 && (
        <div className="flex justify-center gap-1 overflow-x-auto [scrollbar-width:none]">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${
                es ? "Ver imagen" : "View image"
              } ${i + 1}`}
              aria-pressed={i === current}
              className="grid size-9 shrink-0 place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditorialVideoPlayer({
  video,
}: {
  video: EditorialVideo;
}) {
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
            aria-label={`${
              es ? "Reproducir" : "Play"
            }: ${video.title}`}
            className="group absolute inset-0 size-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            <EditorialImage
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            />

            <span className="absolute inset-0 grid place-items-center bg-black/15 transition-colors group-hover:bg-black/30">
              <span className="grid size-16 place-items-center rounded-full bg-red-600 text-white shadow-lg transition-transform motion-safe:group-hover:scale-105">
                <PlayCircle className="size-10" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug text-brand-deep">
          {video.title}
        </h3>

        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-9 items-center text-xs font-medium text-primary hover:underline"
        >
          {es ? "Abrir en YouTube" : "Open on YouTube"}
        </a>
      </div>
    </div>
  );
}

export function EditorialContent({
  blocks,
}: {
  blocks: EditorialBlock[];
}) {
  const { lang } = useI18n();
  const es = lang === "es";

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="pt-3 font-display text-2xl leading-tight text-brand-deep sm:text-3xl"
              >
                {block.text}
              </h2>
            );

          case "paragraph":
            if (block.html) return <div key={i} className={`whitespace-pre-line break-words text-base leading-[1.8] text-black sm:text-lg sm:leading-relaxed ${estilosTextoEnriquecido}`} dangerouslySetInnerHTML={{__html: sanitize(block.text)}} />;
            return (
              <p
                key={i}
                className="whitespace-pre-line break-words text-base leading-[1.8] text-muted-foreground sm:text-lg sm:leading-relaxed"
              >
                {block.text}
              </p>
            );

          case "image":
            return <figure key={i}>
              <EditorialImage src={block.src} alt={block.alt} className="mx-auto block h-auto max-h-[80vh] w-auto max-w-full rounded-2xl object-contain" fallbackClassName="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/9]" />
              {block.caption && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{block.caption}</figcaption>}
            </figure>;
          case "link":
            return <a key={i} href={block.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">{block.text}<ArrowRight className="size-4" /></a>;

          case "embed":
            return <EnlaceIncrustado key={i} url={block.url} />;

          case "pdf":
            return <VisorPdf key={i} vista={pdfContenidoUrl(block.id) || ""} descarga={pdfContenidoUrl(block.id, true) || ""} nombre={block.name} tamano={block.size} />;

          case "gallery":
            return (
              <ImageCarousel
                key={i}
                images={block.images}
              />
            );

          case "videos":
            return (
              <div key={i}>
                <div
                  aria-label={
                    es ? "Videos de conservación" : "Conservation videos"
                  }
                  className={`flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] sm:grid sm:gap-5 sm:overflow-visible ${block.videos.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
                >
                  {block.videos.map((video) => (
                    <div
                      key={video.id}
                      className={`${block.videos.length > 1 ? "w-[88%] max-w-[410px]" : "w-full"} shrink-0 snap-center sm:w-auto sm:max-w-none`}
                    >
                      <EditorialVideoPlayer video={video} />
                    </div>
                  ))}
                </div>

                {block.videos.length > 1 && (
                  <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:hidden">
                    {es
                      ? "Desliza para ver más videos"
                      : "Swipe to see more videos"}
                    <ArrowRight className="size-4" />
                  </p>
                )}
              </div>
            );
        }
      })}
    </div>
  );
}

function textoPlano(valor: string) {
  return new DOMParser().parseFromString(valor, "text/html").body.textContent?.trim() || "";
}
function bloquesEditoriales(bloques: BloquePublico[], es: boolean): EditorialBlock[] {
  const out: EditorialBlock[] = [];
  const leyenda = (...values: (string | null | undefined)[]) => values.filter(Boolean).join(" · ");
  for (const b of bloques) {
    const text = (es ? b.texto_es : b.texto_en) || "";
    const pie = (es ? b.pie_es : b.pie_en) || "";
    switch (b.tipo) {
      case "parrafo": out.push({type:"paragraph",text,html:true}); break;
      case "subtitulo": out.push({type:"heading",text:textoPlano(text)}); break;
      case "imagen": out.push({type:"image",src:imagenProgramaUrl(b.id_imagen)||"",alt:pie,caption:leyenda(pie,b.imagen?.credito)}); break;
      case "carrusel": out.push({type:"gallery",images:(b.imagenes||[]).map(f=>({src:imagenProgramaUrl(f.id_imagen)||"",alt:(es?f.pie_es:f.pie_en)||pie,caption:leyenda((es?f.pie_es:f.pie_en)||pie,f.credito)}))}); break;
      case "enlace": case "video": {
        if (!b.url) break;
        try {
          const url = new URL(b.url);
          if (!["https:", "http:"].includes(url.protocol)) break;
          const id = youtubeId(url);
          if (id) {
            const video = {id,title:"YouTube"};
            const last = out[out.length-1];
            if (last?.type === "videos") last.videos.push(video);
            else out.push({type:"videos",videos:[video]});
          } else out.push({type:"embed",url:url.href}); // SoundCloud, Genially, PDF o página web
        } catch { /* URL inválida: omitir */ }
        break;
      }
      case "pdf":
        if (b.id_archivo_pdf) out.push({type:"pdf",id:b.id_archivo_pdf,name:b.pdf_nombre||"documento.pdf",size:b.pdf_tamano??null});
        break;
    }
  }
  return out;
}

export default function FormatoPrograma({ id }: { id: string }) {
  const { lang } = useI18n();
  const es = lang === "es";
  const [data, setData] = useState<ProgramaPublicoDetalle | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error" | "no-encontrado">("cargando");
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setEstado("cargando");
    obtenerProgramaPublico(id, controller.signal).then(programa => {
      if (!controller.signal.aborted) { setData(programa); setEstado("listo"); }
    }).catch(error => {
      if (!controller.signal.aborted) setEstado(error instanceof Error && error.message === "NOT_FOUND" ? "no-encontrado" : "error");
    });
    return () => controller.abort();
  }, [id, intento]);
  return <article className="min-h-[65vh] overflow-x-clip bg-background">
    <div className="container-site py-8 sm:py-16"><div className="mx-auto max-w-4xl">
      <Link to={data ? `/paisajes?paisaje=${encodeURIComponent(data.id_paisaje)}#programas` : "/programas"} className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline sm:mb-8">
        <ArrowLeft className="size-4" />{data ? (es ? "Volver al paisaje" : "Back to landscape") : (es ? "Volver a programas" : "Back to programs")}
      </Link>
      {estado === "cargando" && <p role="status" className="text-muted-foreground">{es ? "Cargando programa…" : "Loading program…"}</p>}
      {estado === "error" && <div role="status" className="rounded-2xl border border-border bg-muted/40 p-8 text-center"><p>{es ? "No pudimos cargar el programa. Comprueba tu conexión." : "We couldn't load this program. Check your connection."}</p><button type="button" onClick={() => setIntento(n => n + 1)} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{es ? "Volver a intentar" : "Try again"}</button></div>}
      {estado === "no-encontrado" && <p role="status">{es ? "Programa no encontrado." : "Program not found."}</p>}
      {estado === "listo" && data && <>
        <h1 className="mb-6 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">{es ? data.titulo_es : data.titulo_en}</h1>
        <EditorialContent key={id} blocks={bloquesEditoriales(data.bloques, es)} />
        {!data.bloques.length && <p className="text-muted-foreground">{es ? "Próximamente compartiremos más información." : "More information will be available soon."}</p>}
        <RelatedNews programId={id} />
      </>}
    </div></div>
  </article>;
}
