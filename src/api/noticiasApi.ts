const API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/$/, "");

import type { BloquePaisaje } from "./paisajesApi";

export type NoticiaResumen = {
  id_noticia: string;
  id_programa: string;
  id_categoria_noticia: string;
  programa_titulo_es: string;
  categoria_titulo_es: string;
  id_contenido: string;
  titulo_es: string;
  titulo_en: string;
  color: string;
  fecha_publicacion: string;
  updated_at: string;
  cantidad_bloques: number;
};

export type NoticiaDetalle = Omit<NoticiaResumen, "updated_at" | "cantidad_bloques"> & {
  bloques: BloquePaisaje[];
};

export type NoticiaEntrada = {
  titulo_es: string;
  titulo_en: string;
  /** Fecha de la noticia en formato YYYY-MM-DD. */
  fecha_publicacion: string;
  id_programa: string;
  id_categoria_noticia: string;
  bloques: BloquePaisaje[];
};

type ApiResponse<T> = { success: boolean; message?: string; data?: T };

async function solicitud<T>(ruta: string, metodo = "GET", body?: unknown): Promise<T> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No existe una sesión activa. Inicia sesión nuevamente.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/admin/noticias${ruta}`, {
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

export const listarNoticias = () => solicitud<NoticiaResumen[]>("");
export const obtenerNoticia = (id: string) => solicitud<NoticiaDetalle>(`/${encodeURIComponent(id)}`);
export const crearNoticia = (datos: NoticiaEntrada) => solicitud<{ id_noticia: string }>("", "POST", datos);
export const actualizarNoticia = (id: string, datos: NoticiaEntrada) => solicitud<{ id_noticia: string }>(`/${encodeURIComponent(id)}`, "PUT", datos);
export const eliminarNoticia = (id: string) => solicitud<void>(`/${encodeURIComponent(id)}`, "DELETE");

export type CategoriaNoticia = { id_categoria_noticia: string; nombre_es: string; nombre_en: string };
export const listarCategoriasNoticias = () => solicitud<CategoriaNoticia[]>("/categorias");
