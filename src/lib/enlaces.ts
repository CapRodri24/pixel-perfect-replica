// Reconoce qué hay detrás de un enlace del contenido editorial, para mostrarlo
// dentro de la página: video de YouTube, audio de SoundCloud, presentación de
// Genially, audio/foto/video de Macaulay Library, documento PDF (o archivo de Google Drive),
// páginas de eBird (como referencia) o una página web cualquiera.

export type EnlaceDetectado =
  | { tipo: "youtube"; url: string; id: string }
  | { tipo: "soundcloud"; url: string; embed: string; lista: boolean }
  | { tipo: "genially"; url: string; embed: string }
  | { tipo: "macaulay"; url: string; id: string; embed: string }
  | { tipo: "ebird"; url: string; clase: ClaseEbird }
  | { tipo: "pdf"; url: string; nombre: string; vista: string; descarga: string }
  | { tipo: "web"; url: string; dominio: string };

export type TipoEnlace = EnlaceDetectado["tipo"];
export type ClaseEbird = "especie" | "reporte" | "lista" | "publicacion" | "punto" | "otro";

export const NOMBRE_CLASE_EBIRD: Record<ClaseEbird, { es: string; en: string }> = {
  especie: { es: "Ficha de especie", en: "Species account" },
  reporte: { es: "Reporte de viaje", en: "Trip report" },
  lista: { es: "Lista de observación", en: "Checklist" },
  publicacion: { es: "Publicación", en: "Post" },
  punto: { es: "Sitio de observación", en: "Hotspot" },
  otro: { es: "Enlace", en: "Link" },
};

export const NOMBRE_TIPO_ENLACE: Record<TipoEnlace, { es: string; en: string }> = {
  youtube: { es: "Video de YouTube", en: "YouTube video" },
  soundcloud: { es: "Audio de SoundCloud", en: "SoundCloud audio" },
  genially: { es: "Presentación de Genially", en: "Genially presentation" },
  macaulay: { es: "Grabación de Macaulay Library (audio, foto o video)", en: "Macaulay Library recording (audio, photo or video)" },
  ebird: { es: "Enlace de eBird (se muestra como referencia)", en: "eBird link (shown as a reference)" },
  pdf: { es: "Documento PDF", en: "PDF document" },
  web: { es: "Enlace a otra página", en: "Link to another page" },
};

const dominio = (url: URL) => url.hostname.toLowerCase().replace(/^www\./, "");
const es = (host: string, base: string) => host === base || host.endsWith(`.${base}`);

export function youtubeId(url: URL): string | null {
  const host = dominio(url);
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1] || null;
  if (es(host, "youtube.com") || es(host, "youtube-nocookie.com")) {
    id = url.searchParams.get("v") || url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] || null;
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

function soundcloud(url: URL): EnlaceDetectado | null {
  const host = dominio(url);
  if (!es(host, "soundcloud.com")) return null;
  // Enlace del reproductor ya listo para insertar.
  if (host === "w.soundcloud.com") {
    const destino = url.searchParams.get("url") || "";
    return { tipo: "soundcloud", url: url.href, embed: url.href, lista: /\/(sets|playlists)\//.test(destino) };
  }
  const partes = url.pathname.split("/").filter(Boolean);
  if (!partes.length) return null;
  // Enlaces cortos (on.soundcloud.com/xxxx) y de móvil se pasan tal cual al reproductor.
  const limpio = host === "m.soundcloud.com" ? `https://soundcloud.com${url.pathname}` : `https://${url.hostname}${url.pathname}`;
  const lista = partes.length === 1 || partes[1] === "sets" || partes.includes("playlists");
  const parametros = new URLSearchParams({
    url: limpio, color: "#2381c4", auto_play: "false", hide_related: "true",
    show_comments: "false", show_user: "true", show_reposts: "false", visual: "false",
  });
  return { tipo: "soundcloud", url: url.href, embed: `https://w.soundcloud.com/player/?${parametros}`, lista };
}

function genially(url: URL): EnlaceDetectado | null {
  const host = dominio(url);
  if (!es(host, "genially.com") && !es(host, "genial.ly")) return null;
  const id = url.pathname.split("/").find((parte) => /^[0-9a-f]{24}$/i.test(parte));
  if (!id) return null;
  return { tipo: "genially", url: url.href, embed: `https://view.genially.com/${id}` };
}

// Macaulay Library: macaulaylibrary.org/asset/123, …/asset/123/embed o search.macaulaylibrary.org/catalog/123.
function macaulay(url: URL): EnlaceDetectado | null {
  const host = dominio(url);
  if (!es(host, "macaulaylibrary.org")) return null;
  const id = url.pathname.match(/\/(?:asset|catalog)\/(?:ML)?(\d{3,})/i)?.[1];
  if (!id) return null;
  return { tipo: "macaulay", url: url.href, id, embed: `https://macaulaylibrary.org/asset/${id}/embed` };
}

// eBird no permite mostrarse dentro de otra web: se reconoce para etiquetar mejor la referencia.
function ebird(url: URL): EnlaceDetectado | null {
  if (!es(dominio(url), "ebird.org")) return null;
  const p = url.pathname;
  const clase: ClaseEbird = /^\/species\//.test(p) ? "especie"
    : /^\/tripreport\//.test(p) ? "reporte"
    : /^\/checklist\//.test(p) ? "lista"
    : /\/post\//.test(p) ? "publicacion"
    : /^\/hotspot\//.test(p) ? "punto"
    : "otro";
  return { tipo: "ebird", url: url.href, clase };
}

/** Dirección sin parámetros de seguimiento (para mostrarla en las tarjetas). */
export function urlLimpia(valor: string): string {
  try { const u = new URL(valor); return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`; } catch { return valor; }
}

function pdf(url: URL): EnlaceDetectado | null {
  const host = dominio(url);
  // Archivos de Google Drive: se muestran con el visor de Drive.
  if (host === "drive.google.com") {
    const id = url.pathname.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/)?.[1] || url.searchParams.get("id");
    if (id && /^[A-Za-z0-9_-]{10,}$/.test(id)) {
      return {
        tipo: "pdf", url: url.href, nombre: "Google Drive",
        vista: `https://drive.google.com/file/d/${id}/preview`,
        descarga: `https://drive.google.com/uc?export=download&id=${id}`,
      };
    }
    return null;
  }
  if (!/\.pdf$/i.test(url.pathname)) return null;
  let nombre = url.pathname.split("/").pop() || "documento.pdf";
  try { nombre = decodeURIComponent(nombre); } catch { /* nombre con caracteres raros: se deja igual */ }
  // Muchos sitios prohíben mostrar sus PDF dentro de otra página (frame-ancestors),
  // así que la vista previa usa el visor de Google Docs, que sí se puede insertar.
  const vista = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(url.href)}`;
  return { tipo: "pdf", url: url.href, nombre, vista, descarga: url.href };
}

/** Devuelve null si el texto no es un enlace http(s) válido. */
export function detectarEnlace(valor: string | null | undefined): EnlaceDetectado | null {
  let url: URL;
  try { url = new URL((valor || "").trim()); } catch { return null; }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  const id = youtubeId(url);
  if (id) return { tipo: "youtube", url: url.href, id };
  return soundcloud(url) || genially(url) || macaulay(url) || ebird(url) || pdf(url) || { tipo: "web", url: url.href, dominio: dominio(url) };
}

export function tamanoLegible(bytes: number | null | undefined): string {
  if (!bytes || bytes < 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".0", "")} MB`;
}

export type SegmentoVideos<T> = { tipo: "videos"; ids: string[]; items: T[] } | { tipo: "uno"; item: T };

/** Junta los videos de YouTube consecutivos para mostrarlos en cuadrícula en vez de uno debajo de otro. */
export function agruparVideos<T>(items: T[], url: (item: T) => string | null | undefined): SegmentoVideos<T>[] {
  const out: SegmentoVideos<T>[] = [];
  for (const item of items) {
    const enlace = detectarEnlace(url(item));
    if (enlace?.tipo === "youtube") {
      const ultimo = out[out.length - 1];
      if (ultimo?.tipo === "videos") { ultimo.ids.push(enlace.id); ultimo.items.push(item); }
      else out.push({ tipo: "videos", ids: [enlace.id], items: [item] });
    } else out.push({ tipo: "uno", item });
  }
  return out;
}
