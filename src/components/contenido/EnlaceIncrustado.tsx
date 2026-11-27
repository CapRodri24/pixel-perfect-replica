import { useEffect, useState } from "react";
import { Bird, Download, ExternalLink, Eye, EyeOff, FileText, Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { detectarEnlace, NOMBRE_CLASE_EBIRD, tamanoLegible, urlLimpia, type EnlaceDetectado } from "@/lib/enlaces";

const marco = "overflow-hidden rounded-2xl border border-border bg-muted";
const boton = "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-brand-deep transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// En pantallas pequeñas los navegadores no muestran PDF dentro de la página:
// ahí se ofrece abrirlo en otra pestaña. En computadora la vista previa se abre al pedirla.
function usePantallaAmplia() {
  const consulta = "(min-width: 768px) and (pointer: fine)";
  const [amplia] = useState(() => typeof window !== "undefined" && window.matchMedia?.(consulta).matches === true);
  return amplia;
}

export function VisorPdf({ vista, descarga, abrir, nombre, tamano }: {
  vista: string;
  descarga: string;
  abrir?: string | undefined;
  nombre: string;
  tamano?: number | null | undefined;
}) {
  const { lang } = useI18n();
  const es = lang === "es";
  const amplia = usePantallaAmplia();
  const [abierto, setAbierto] = useState(false);
  useEffect(() => { setAbierto(false); }, [vista]);
  const peso = tamanoLegible(tamano);
  return <div className="overflow-hidden rounded-xl border border-border bg-background">
    <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 sm:px-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-700"><FileText className="size-5" aria-hidden="true" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-deep" title={nombre}>{nombre}</p>
        <p className="text-xs text-muted-foreground">PDF{peso ? ` · ${peso}` : ""}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {amplia
          ? <button type="button" className={boton} aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}>
              {abierto ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              {abierto ? (es ? "Ocultar vista previa" : "Hide preview") : (es ? "Vista previa" : "Preview")}
            </button>
          : <a className={boton} href={abrir || vista} target="_blank" rel="noopener noreferrer"><Eye className="size-4" aria-hidden="true" />{es ? "Ver documento" : "View document"}</a>}
        <a className={boton} href={descarga} target="_blank" rel="noopener noreferrer" download><Download className="size-4" aria-hidden="true" />{es ? "Descargar" : "Download"}</a>
      </div>
    </div>
    {abierto && <iframe src={vista} title={nombre} loading="lazy" className="block h-[75vh] max-h-[900px] min-h-[420px] w-full border-0 border-t border-border bg-muted" />}
  </div>;
}

function TarjetaWeb({ url, dominio, etiqueta, ave }: { url: string; dominio: string; etiqueta?: string; ave?: boolean }) {
  const { lang } = useI18n();
  const Icono = ave ? Bird : Globe;
  return <a href={url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${ave ? "bg-[#e8f3ec] text-[#2f7d4f]" : "bg-primary/10 text-primary"}`}><Icono className="size-6" aria-hidden="true" /></span>
    <span className="min-w-0 flex-1">
      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{etiqueta ?? (lang === "es" ? "Referencia" : "Reference")}</span>
      <span className="block truncate font-semibold text-brand-deep group-hover:text-primary">{dominio}</span>
      <span className="block truncate text-sm text-muted-foreground">{urlLimpia(url)}</span>
    </span>
    <ExternalLink className="size-5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
  </a>;
}

function AbrirEnSitio({ url, sitio }: { url: string; sitio: string }) {
  const { lang } = useI18n();
  return <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-primary hover:underline">
    {lang === "es" ? `Abrir en ${sitio}` : `Open on ${sitio}`}<ExternalLink className="size-3.5" aria-hidden="true" />
  </a>;
}

export function ContenidoEnlace({ enlace }: { enlace: EnlaceDetectado }) {
  const { lang } = useI18n();
  switch (enlace.tipo) {
    case "youtube":
      return <div className={`aspect-video ${marco}`}><iframe className="size-full border-0" src={`https://www.youtube-nocookie.com/embed/${enlace.id}?rel=0`} title="YouTube" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>;
    case "soundcloud":
      return <div>
        <iframe className={`block w-full border-0 ${marco}`} style={{ height: enlace.lista ? 450 : 166 }} src={enlace.embed} title="SoundCloud" loading="lazy" allow="autoplay; encrypted-media" />
        <AbrirEnSitio url={enlace.url} sitio="SoundCloud" />
      </div>;
    case "genially":
      return <div>
        <div className={`aspect-video ${marco}`}><iframe className="size-full border-0" src={enlace.embed} title="Genially" loading="lazy" allow="fullscreen; autoplay" allowFullScreen /></div>
        <AbrirEnSitio url={enlace.url} sitio="Genially" />
      </div>;
    case "macaulay":
      // Reproductor oficial de Macaulay Library (sonido con espectrograma, foto o video).
      return <div>
        <div className={marco} style={{ aspectRatio: "800 / 431", minHeight: 260 }}><iframe className="size-full border-0" src={enlace.embed} title={`Macaulay Library ML${enlace.id}`} loading="lazy" allow="autoplay; fullscreen" allowFullScreen /></div>
        <AbrirEnSitio url={`https://macaulaylibrary.org/asset/${enlace.id}`} sitio="Macaulay Library" />
      </div>;
    case "ebird":
      return <TarjetaWeb url={enlace.url} dominio="eBird" ave etiqueta={`eBird · ${NOMBRE_CLASE_EBIRD[enlace.clase][lang === "es" ? "es" : "en"]}`} />;
    case "pdf":
      return <VisorPdf vista={enlace.vista} descarga={enlace.descarga} abrir={enlace.url} nombre={enlace.nombre} />;
    case "web":
      return <TarjetaWeb url={enlace.url} dominio={enlace.dominio} />;
  }
}

/** Muestra el contenido de un enlace según su tipo; no muestra nada si la URL no es válida. */
export function EnlaceIncrustado({ url }: { url: string | null | undefined }) {
  const enlace = detectarEnlace(url);
  return enlace ? <ContenidoEnlace enlace={enlace} /> : null;
}
