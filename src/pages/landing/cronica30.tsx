// Crónica de los 30 años de Armonía (reemplaza a la publicada en el sitio anterior).
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Languages, PenLine, Quote } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { sanitize } from "@/pages/admin/datos";
import { estilosTextoEnriquecido } from "@/lib/textoEnriquecido";
import { CRONICA_30, type BloqueCronica } from "@/content/cronica30";

function Foto({ src, pie, className = "" }: { src: string; pie: string; className?: string }) {
  return <figure className={className}>
    <img src={src} alt={pie.replace(/^Fotos?:\s*/i, "") || "Fotografía de la crónica de Armonía"} loading="lazy" decoding="async"
      className="mx-auto block h-auto max-h-[75vh] w-auto max-w-full rounded-2xl bg-muted object-contain" />
    {pie && <figcaption className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">{pie}</figcaption>}
  </figure>;
}

function Bloque({ b }: { b: BloqueCronica }) {
  switch (b.t) {
    case "parrafo":
      return <p className={`break-words text-base leading-[1.85] text-black sm:text-lg ${estilosTextoEnriquecido}`} dangerouslySetInnerHTML={{ __html: sanitize(b.html) }} />;
    case "subtitulo":
      return <h2 className="pt-6 font-display text-2xl leading-tight text-brand-deep sm:text-3xl">{b.texto}</h2>;
    case "cita":
      return <blockquote className="relative my-2 rounded-2xl border-l-4 border-primary bg-secondary/60 px-6 py-5 sm:px-8">
        <Quote className="absolute -top-3 left-4 size-7 rounded-full bg-background p-1 text-primary" aria-hidden="true" />
        <p className="font-display text-xl leading-snug text-brand-deep sm:text-2xl">{b.texto}</p>
      </blockquote>;
    case "imagen":
      return <Foto src={b.src} pie={b.pie} className="py-2" />;
    case "galeria":
      return <div className="grid gap-4 py-2 sm:grid-cols-2">
        {b.fotos.map((f) => <Foto key={f.src} src={f.src} pie={f.pie} />)}
      </div>;
  }
}

export default function Cronica30() {
  const { lang } = useI18n();
  const es = lang === "es";
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const fecha = new Date(`${CRONICA_30.fecha}T12:00:00`).toLocaleDateString(es ? "es-BO" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return <article className="min-h-[65vh] overflow-x-clip bg-background">
    <div className="container-site py-8 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link to="/30-aniversario-de-armonia/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />{es ? "Volver a 30 años de Armonía" : "Back to 30 years of Armonía"}
        </Link>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">{es ? "Crónica · 1996 – 2026" : "Chronicle · 1996 – 2026"}</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-brand-deep sm:text-5xl">{CRONICA_30.titulo}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden="true" />{fecha}</span>
          <span className="inline-flex items-center gap-1.5"><PenLine className="size-4" aria-hidden="true" />{CRONICA_30.autor}</span>
        </p>
        {!es && <p className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-secondary/50 p-3 text-sm text-muted-foreground">
          <Languages className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />This chronicle is only available in Spanish.
        </p>}
        <div className="mt-8 space-y-6" lang="es">
          {CRONICA_30.bloques.map((b, i) => <Bloque key={i} b={b} />)}
        </div>
        <p className="mt-12 flex items-center gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:text-base">
          <PenLine className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="italic">{es ? "Texto escrito por:" : "Written by:"}</span>
          <span className="font-semibold text-brand-deep">{CRONICA_30.autor}</span>
        </p>
      </div>
    </div>
  </article>;
}
