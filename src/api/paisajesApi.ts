const API_URL = (import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/$/, "");

export type ImagenPaisaje = {
  id_imagen?: string;
  archivo?: string;
  nombre_archivo?: string;
  credito?: string;
};

/** PDF de un bloque: existente (id) o recién elegido (archivo en base64). */
export type PdfBloque = {
  id_archivo_pdf?: string;
  archivo?: string;
  nombre_archivo?: string;
  tamano_bytes?: number;
};

export type TipoBloquePaisaje = "parrafo" | "subtitulo" | "imagen" | "carrusel" | "enlace" | "video" | "pdf";

export type BloquePaisaje = {
  id_bloque?: string;
  tipo: TipoBloquePaisaje;
  texto_es?: string;
  texto_en?: string;
  pie_es?: string;
  pie_en?: string;
  url?: string;
  imagen?: ImagenPaisaje;
  imagenes?: ImagenPaisaje[];
  pdf?: PdfBloque;
};

export type PaisajeResumen = {
  id_paisaje: string;
  id_contenido: string;
  titulo_es: string;
  titulo_en: string;
  color: string;
  fecha_publicacion: string;
  updated_at: string;
  cantidad_bloques: number;
};

export type PaisajeDetalle = Omit<PaisajeResumen, "updated_at" | "cantidad_bloques"> & {
  bloques: BloquePaisaje[];
};

export type PaisajeEntrada = {
  titulo_es: string;
  titulo_en: string;
  color: string;
  bloques: BloquePaisaje[];
};

type ApiResponse<T> = { success: boolean; message?: string; data?: T };

async function solicitud<T>(ruta: string, metodo = "GET", body?: unknown): Promise<T> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No existe una sesión activa. Inicia sesión nuevamente.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/admin/paisajes${ruta}`, {
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

export const listarPaisajes = () => solicitud<PaisajeResumen[]>("");
export const obtenerPaisaje = (id: string) => solicitud<PaisajeDetalle>(`/${encodeURIComponent(id)}`);
export const crearPaisaje = (datos: PaisajeEntrada) => solicitud<{ id_paisaje: string }>("", "POST", datos);
export const actualizarPaisaje = (id: string, datos: PaisajeEntrada) => solicitud<{ id_paisaje: string }>(`/${encodeURIComponent(id)}`, "PUT", datos);
export const eliminarPaisaje = (id: string) => solicitud<void>(`/${encodeURIComponent(id)}`, "DELETE");
