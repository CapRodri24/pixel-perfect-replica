import type { Lang } from "@/i18n/I18nProvider";

/**
 * Direcciones públicas por idioma que deben seguir en línea (pedidas por Armonía).
 * - `es` / `en`: URL canónica de la vista en cada idioma (se respetan tal cual, con su barra final).
 * - `interna`: ruta que usa el código en sus enlaces; al visitarla se redirige a la URL del idioma actual.
 * Nota: "biodivserty" está escrito así a propósito porque es la dirección existente.
 */
export const RUTAS = {
  inicio: { es: "/es", en: "/en", interna: "/" },
  nosotros: { es: "/acerca-de-nosotros/", en: "/about-armonia-bolivia/", interna: "/nosotros" },
  noticias: { es: "/noticias/", en: "/news/", interna: "/noticias" },
  contacto: { es: "/contacte-armonia/", en: "/contact-armonia-bolivian-biodivserty-conservation/", interna: "/contacto" },
  donar: { es: "/apoyenos/", en: "/support-us/", interna: "/donar" },
  reservas: { es: "/visite-nuestras-reservas-naturales/", en: "/wildlife-watching-holiday-in-bolivia/", interna: "/contacto/visitanuestrasreservas" },
  guiaAves: { es: "/comprar-aves-de-bolivia-guia-de-campo/", en: "/birds-of-bolivia-field-guide-2/", interna: "/contacto/guiadecampoaves" },
} as const satisfies Record<string, { es: string; en: string; interna: string }>;

export type ClaveRuta = keyof typeof RUTAS;

/** Idioma que fija la URL exacta, o null si es la ruta interna (sin idioma). */
export function idiomaDeRuta(clave: ClaveRuta, pathname: string): Lang | null {
  const r = RUTAS[clave];
  if (pathname === r.es) return "es";
  if (pathname === r.en) return "en";
  return null;
}

const sinBarra = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * Convierte una URL localizada en la ruta interna equivalente (por ejemplo, "/news/" → "/noticias").
 * Sirve para marcar el menú activo y saber si se está en el inicio.
 */
export function rutaInterna(pathname: string): string {
  const actual = sinBarra(pathname);
  for (const r of Object.values(RUTAS)) {
    if (actual === sinBarra(r.es) || actual === sinBarra(r.en)) return r.interna;
  }
  return pathname;
}
