const API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/$/, "");

import type { BloquePaisaje } from "./paisajesApi";

export type ProgramaResumen = {
  id_programa: string;
  id_paisaje: string;
  paisaje_titulo_es: string;
  id_contenido: string;
  titulo_es: string;
  titulo_en: string;
  color: string;
  fecha_publicacion: string;
  updated_at: string;
  cantidad_bloques: number;
};

export type ProgramaDetalle = Omit<ProgramaResumen, "updated_at" | "cantidad_bloques"> & {
  bloques: BloquePaisaje[];
};

export type ProgramaEntrada = {
  titulo_es: string;
  titulo_en: string;
  id_paisaje: string;
  bloques: BloquePaisaje[];
};

type ApiResponse<T> = { success: boolean; message?: string; data?: T };

async function solicitud<T>(ruta: string, metodo = "GET", body?: unknown): Promise<T> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No existe una sesión activa. Inicia sesión nuevamente.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/admin/programas${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }
  let result: ApiResponse<T>;
  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error("El servidor devolvió una respuesta no válida.");
  }
  if (!response.ok || !result.success) {
    if (response.status === 401) throw new Error("Sesión inválida o expirada. Vuelve a iniciar sesión.");
    throw new Error(result.message || `No se pudo completar la operación (${response.status}).`);
  }
  return result.data as T;
}

export const listarProgramas = () => solicitud<ProgramaResumen[]>("");
export const obtenerPrograma = (id: string) => solicitud<ProgramaDetalle>(`/${encodeURIComponent(id)}`);
export const crearPrograma = (datos: ProgramaEntrada) => solicitud<{ id_programa: string }>("", "POST", datos);
export const actualizarPrograma = (id: string, datos: ProgramaEntrada) => solicitud<{ id_programa: string }>(`/${encodeURIComponent(id)}`, "PUT", datos);
export const eliminarPrograma = (id: string) => solicitud<void>(`/${encodeURIComponent(id)}`, "DELETE");
