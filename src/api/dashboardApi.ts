const API = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");
export type TipoRegistro = "paisaje" | "programa" | "noticia" | "nosotros" | "recurso";
export type RegistroReciente = { id: string; tipo: TipoRegistro; titulo: string; fecha: string };
export type DashboardResumen = {
  paisajes: string; programas: string; noticias: string; nosotros: string; recursos: string;
  junta: string; equipo: string; socios: string; pdfs: string;
  relaciones_paisajes: { id: string; titulo: string; programas: string }[];
  noticias_asociadas: string; noticias_independientes: string; noticias_pendientes: string;
  recientes: RegistroReciente[]; consultado_en: string;
};
export async function obtenerDashboard(signal?: AbortSignal): Promise<DashboardResumen> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Inicia sesión nuevamente.");
  const controller = new AbortController();
  const cancelar = () => controller.abort();
  if (signal?.aborted) cancelar();
  signal?.addEventListener("abort", cancelar, { once: true });
  const timer = window.setTimeout(cancelar, 12000);
  try {
    const response = await fetch(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, signal: controller.signal, cache: "no-store" });
    if (response.status === 401) throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    if (response.status === 403) throw new Error("No tienes permiso para consultar el panel.");
    const result = await response.json() as { success: boolean; data?: DashboardResumen; message?: string };
    if (!response.ok || !result.success || !result.data) throw new Error(result.message || "No se pudo cargar el resumen.");
    const data = result.data;
    const counts = [data.paisajes, data.programas, data.noticias, data.nosotros, data.recursos, data.junta, data.equipo, data.socios, data.pdfs, data.noticias_asociadas, data.noticias_independientes, data.noticias_pendientes];
    if (!counts.every(v => typeof v === "string" && /^\d+$/.test(v)) || !Array.isArray(data.relaciones_paisajes) || !data.relaciones_paisajes.every(r => r && typeof r.id === "string" && typeof r.titulo === "string" && typeof r.programas === "string" && /^\d+$/.test(r.programas)) || !Array.isArray(data.recientes) || typeof data.consultado_en !== "string") throw new Error("La respuesta del servidor no es válida.");
    return data;
  } catch (error) {
    if (controller.signal.aborted || error instanceof TypeError) throw new Error("No se pudo conectar con el servidor. Comprueba la conexión e inténtalo nuevamente.");
    if (error instanceof SyntaxError) throw new Error("El servidor devolvió una respuesta no válida.");
    throw error;
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", cancelar);
  }
}
