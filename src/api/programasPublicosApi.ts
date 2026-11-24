import type { BloquePublico, ProgramaAsociado } from "./paisajesPublicosApi";
export { imagenPaisajeUrl as imagenProgramaUrl } from "./paisajesPublicosApi";
const API_URL = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");
export type ProgramaPublicoResumen = ProgramaAsociado & {
  id_paisaje: string;
  paisaje_titulo_es: string;
  paisaje_titulo_en: string;
  color: string;
  cantidad_bloques: number;
};
export type ProgramaPublicoDetalle = Omit<ProgramaPublicoResumen, "cantidad_bloques" | "id_imagen_portada" | "descripcion_es" | "descripcion_en"> & {
  id_contenido: string;
  bloques: BloquePublico[];
};
type Respuesta<T> = { success: boolean; data?: T; message?: string };

async function obtener<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  const cancel = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener("abort", cancel, { once: true });
  try {
    const response = await fetch(`${API_URL}/programas${path}`, {
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

export async function listarProgramasPublicos(signal?: AbortSignal) {
  const data = await obtener<ProgramaPublicoResumen[]>("", signal);
  if (!Array.isArray(data)) throw new Error("INVALID_RESPONSE");
  return data;
}
export async function obtenerProgramaPublico(id: string, signal?: AbortSignal) {
  const data = await obtener<ProgramaPublicoDetalle>(`/${encodeURIComponent(id)}`, signal);
  if (!data || !Array.isArray(data.bloques)) throw new Error("INVALID_RESPONSE");
  return data;
}
