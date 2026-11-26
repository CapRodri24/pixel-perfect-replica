// Tienda de souvenirs: administración (con sesión) y catálogo público.
const API_URL = String(import.meta.env["VITE_API_URL"] || "http://localhost:5000/api").replace(/\/+$/, "");

export type ImagenNueva = { archivo: string; nombre_archivo: string };
/** Imagen al guardar: la que ya tenía (id) o una nueva (archivo en base64). */
export type ImagenEntrada = { id_imagen: string } | ImagenNueva;

export type Souvenir = {
  id_souvenir: string;
  nombre_es: string;
  nombre_en: string;
  colores_es: string[];
  colores_en: string[];
  tallas: string[];
  precio: number;
  id_imagen: string;
  disponible: boolean;
};

export type SouvenirEntrada = Omit<Souvenir, "id_souvenir" | "id_imagen"> & { imagen: ImagenEntrada };

export type ProductoPromocion = { id_souvenir: string; cantidad: number };

export type Promocion = {
  id_promocion: string;
  titulo_es: string;
  titulo_en: string;
  descripcion_es: string;
  descripcion_en: string;
  id_imagen: string | null;
  precio: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activa: boolean;
  productos: ProductoPromocion[];
};

export type PromocionEntrada = Omit<Promocion, "id_promocion" | "id_imagen"> & { imagen: ImagenEntrada | null };

export type CatalogoSouvenirs = { productos: Souvenir[]; promociones: Promocion[] };

type Respuesta<T> = { success: boolean; data?: T; message?: string };

async function solicitud<T>(ruta: string, opciones: { metodo?: string; body?: unknown; admin?: boolean; signal?: AbortSignal } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opciones.admin) {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No existe una sesión activa. Inicia sesión nuevamente.");
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (opciones.body !== undefined) headers["Content-Type"] = "application/json";
  let response: Response;
  try {
    response = await fetch(`${API_URL}${ruta}`, {
      method: opciones.metodo || "GET",
      headers,
      ...(opciones.body !== undefined ? { body: JSON.stringify(opciones.body) } : {}),
      ...(opciones.signal ? { signal: opciones.signal } : {}),
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new Error("No se pudo conectar con el servidor.");
  }
  const json = (await response.json().catch(() => ({}))) as Respuesta<T>;
  if (!response.ok || !json.success) throw new Error(json.message || "Ocurrió un error en el servidor.");
  return json.data as T;
}

export const imagenSouvenirUrl = (id: string | null | undefined) =>
  id && /^[1-9]\d*$/.test(id) ? `${API_URL}/souvenirs/imagenes/${id}` : "";

// Público
export const obtenerCatalogoSouvenirs = (signal?: AbortSignal) =>
  solicitud<CatalogoSouvenirs>("/souvenirs", signal ? { signal } : {});

// Administración
export const listarSouvenirs = () => solicitud<Souvenir[]>("/admin/souvenirs/productos", { admin: true });
export const guardarSouvenir = (datos: SouvenirEntrada, id?: string) =>
  solicitud<{ id_souvenir: string }>(`/admin/souvenirs/productos${id ? `/${id}` : ""}`, { admin: true, metodo: id ? "PUT" : "POST", body: datos });
export const eliminarSouvenir = (id: string) => solicitud<void>(`/admin/souvenirs/productos/${id}`, { admin: true, metodo: "DELETE" });

export const listarPromociones = () => solicitud<Promocion[]>("/admin/souvenirs/promociones", { admin: true });
export const guardarPromocion = (datos: PromocionEntrada, id?: string) =>
  solicitud<{ id_promocion: string }>(`/admin/souvenirs/promociones${id ? `/${id}` : ""}`, { admin: true, metodo: id ? "PUT" : "POST", body: datos });
export const eliminarPromocion = (id: string) => solicitud<void>(`/admin/souvenirs/promociones/${id}`, { admin: true, metodo: "DELETE" });

/** Precio en bolivianos: «Bs 90» o «Bs 89,50». */
export function precioBs(valor: number) {
  return `Bs ${valor.toLocaleString("es-BO", { minimumFractionDigits: Number.isInteger(valor) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

/** Suma de los productos incluidos (precio normal de la promoción). */
export function precioRegular(promo: Pick<Promocion, "productos">, productos: Souvenir[]) {
  return promo.productos.reduce((total, item) => total + (productos.find((p) => p.id_souvenir === item.id_souvenir)?.precio ?? 0) * item.cantidad, 0);
}
