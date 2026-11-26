// Lecturas públicas. No se envía JWT ni se necesita archivo .env en desarrollo.
const API_URL = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");

export type PaisajePublicoResumen = {
  id_paisaje: string;
  titulo_es: string;
  titulo_en: string;
  color: string;
  id_imagen_portada: string | null;
  cantidad_bloques: number;
  descripcion_es?: string | null;
  descripcion_en?: string | null;
};

export type FotoPublica = {
  id_imagen: string;
  credito: string | null;
  pie_es?: string | null;
  pie_en?: string | null;
};

export type BloquePublico = {
  id_bloque: string;
  tipo: "parrafo" | "subtitulo" | "imagen" | "carrusel" | "enlace" | "video" | "pdf";
  orden: number;
  texto_es: string | null;
  texto_en: string | null;
  pie_es: string | null;
  pie_en: string | null;
  url: string | null;
  id_imagen: string | null;
  id_archivo_pdf?: string | null;
  pdf_nombre?: string | null;
  pdf_tamano?: number | null;
  imagen?: Omit<FotoPublica, "id_imagen"> | null;
  imagenes?: FotoPublica[];
};

export type ProgramaAsociado = {
  id_programa: string;
  titulo_es: string;
  titulo_en: string;
  id_imagen_portada: string | null;
  descripcion_es: string | null;
  descripcion_en: string | null;
};

export type PaisajePublicoDetalle = {
  id_paisaje: string;
  id_contenido: string;
  titulo_es: string;
  titulo_en: string;
  color: string;
  bloques: BloquePublico[];
  programas?: ProgramaAsociado[];
};

type Respuesta<T> = { success: boolean; data?: T; message?: string };

async function obtener<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  const cancel = () => controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    const response = await fetch(`${API_URL}/paisajes${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (response.status === 404) throw new Error("NOT_FOUND");
    if (!response.ok) throw new Error("SERVER_ERROR");
    const json = (await response.json()) as Respuesta<T>;
    if (!json.success || json.data === undefined) throw new Error("INVALID_RESPONSE");
    return json.data;
  } catch (error) {
    if (signal?.aborted) throw new Error("CANCELLED");
    if (error instanceof Error && ["NOT_FOUND", "SERVER_ERROR", "INVALID_RESPONSE"].includes(error.message)) throw error;
    throw new Error("NETWORK_ERROR");
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", cancel);
  }
}

export function listarPaisajesPublicos(signal?: AbortSignal) {
  return obtener<PaisajePublicoResumen[]>("", signal);
}

export function obtenerPaisajePublico(id: string, signal?: AbortSignal) {
  return obtener<PaisajePublicoDetalle>(`/${encodeURIComponent(id)}`, signal);
}

/** PDF subido en un bloque de noticia, programa o paisaje. */
export function pdfContenidoUrl(id: string | null | undefined, descargar = false): string | null {
  return id && /^[1-9]\d*$/.test(id) ? `${API_URL}/contenido/pdf/${id}${descargar ? "?descargar=1" : ""}` : null;
}

export function imagenPaisajeUrl(id: string | null | undefined): string | null {
  return id && /^[1-9]\d*$/.test(id) ? `${API_URL}/paisajes/imagenes/${id}` : null;
}
