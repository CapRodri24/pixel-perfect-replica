import type { BloquePublico } from "./paisajesPublicosApi";
const API_URL = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");
export const imagenNoticiaUrl = (id: string | null | undefined) => id ? `${API_URL}/noticias/imagenes/${encodeURIComponent(id)}` : "";
export type NoticiaPublicaBase = { id_noticia: string; id_programa: string | null; id_categoria_noticia: string; categoria_es: string; categoria_en: string; programa_titulo_es: string | null; programa_titulo_en: string | null; titulo_es: string; titulo_en: string; fecha_publicacion: string; };
export type NoticiaPublicaResumen = NoticiaPublicaBase & { id_imagen_portada: string | null; descripcion_es: string | null; descripcion_en: string | null; };
export type NoticiaPublicaDetalle = NoticiaPublicaBase & { id_contenido: string; bloques: BloquePublico[]; };
type Respuesta<T> = { success: boolean; data?: T; message?: string };

async function obtener<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  const cancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    const response = await fetch(`${API_URL}/noticias${path}`, {
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

export async function listarNoticiasPublicas(signal?: AbortSignal) {
  const data = await obtener<NoticiaPublicaResumen[]>("", signal);
  if (!Array.isArray(data)) throw new Error("INVALID_RESPONSE");
  return data;
}
export async function obtenerNoticiaPublica(id: string, signal?: AbortSignal) {
  const data = await obtener<NoticiaPublicaDetalle>(`/${encodeURIComponent(id)}`, signal);
  if (!data || !Array.isArray(data.bloques)) throw new Error("INVALID_RESPONSE");
  return data;
}
