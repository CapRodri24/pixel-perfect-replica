// Tarjetas de la tienda de souvenirs. Las usa la página pública y la vista previa del admin.
import { useEffect, useState } from "react";
import { CalendarClock, Check, ImageOff, Plus, Sparkles, Tag } from "lucide-react";
import { imagenSouvenirUrl, precioBs, precioRegular, type Promocion, type Souvenir } from "@/api/souvenirsApi";

// Muestra de color para los nombres más comunes; si no se reconoce, solo se ve el texto.
const COLORES: Record<string, string> = {
  blanco: "#ffffff", negro: "#111827", gris: "#9ca3af", plomo: "#6b7280", azul: "#1d4ed8", celeste: "#7dd3fc",
  "azul marino": "#1e3a8a", rojo: "#dc2626", verde: "#16a34a", "verde oliva": "#6b8e23", amarillo: "#facc15",
  naranja: "#f97316", rosado: "#f9a8d4", rosa: "#f9a8d4", morado: "#7c3aed", lila: "#c4b5fd", beige: "#e8dcc4",
  "café": "#7c4a2d", cafe: "#7c4a2d", "marrón": "#7c4a2d", marron: "#7c4a2d", crema: "#fff7e0", turquesa: "#14b8a6",
  white: "#ffffff", black: "#111827", grey: "#9ca3af", gray: "#9ca3af", blue: "#1d4ed8", red: "#dc2626", green: "#16a34a",
  yellow: "#facc15", orange: "#f97316", pink: "#f9a8d4", purple: "#7c3aed", brown: "#7c4a2d", navy: "#1e3a8a",
};
const muestra = (nombre: string) => COLORES[nombre.trim().toLowerCase()] ?? null;

function Foto({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [fallo, setFallo] = useState(false);
  useEffect(() => setFallo(false), [src]);
  if (!src || fallo) return <div role="img" aria-label={alt} className={`${className} grid place-items-center text-muted-foreground`}><ImageOff className="size-10 opacity-40" aria-hidden="true" /></div>;
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} onError={() => setFallo(true)} />;
}

function Opciones({ titulo, valores, elegido, onElegir, colores }: {
  titulo: string; valores: string[]; elegido: string; onElegir: (v: string) => void; colores?: boolean;
}) {
  return <fieldset className="mt-3">
    <legend className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{titulo}</legend>
    <div className="flex flex-wrap gap-1.5">
      {valores.map((v) => {
        const activo = v === elegido;
        const c = colores ? muestra(v) : null;
        return <button key={v} type="button" aria-pressed={activo} onClick={() => onElegir(v)}
          // rounded-[999px] (y no rounded-full) evita el estilo global de filtros de tipografias.css.
          className={`inline-flex min-h-8 items-center gap-1.5 rounded-[999px] border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activo ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"}`}>
          {c && <span aria-hidden="true" className="size-3.5 rounded-full border border-black/15" style={{ background: c }} />}
          {v}
        </button>;
      })}
    </div>
  </fieldset>;
}

export type SeleccionProducto = { color: string; talla: string };

export function TarjetaProducto({ producto, es, imagenSrc, onAgregar }: {
  producto: Souvenir;
  es: boolean;
  /** Para la vista previa del admin con una imagen aún no guardada. */
  imagenSrc?: string | undefined;
  onAgregar?: ((seleccion: SeleccionProducto) => void) | undefined;
}) {
  const colores = es ? producto.colores_es : producto.colores_en;
  const [color, setColor] = useState(colores.length === 1 ? colores[0] ?? "" : "");
  const [talla, setTalla] = useState(producto.tallas.length === 1 ? producto.tallas[0] ?? "" : "");
  const [agregado, setAgregado] = useState(false);
  useEffect(() => { setColor(colores.length === 1 ? colores[0] ?? "" : ""); }, [colores.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setTalla(producto.tallas.length === 1 ? producto.tallas[0] ?? "" : ""); }, [producto.tallas.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  const falta = (colores.length > 1 && !color) || (producto.tallas.length > 1 && !talla);
  const nombre = (es ? producto.nombre_es : producto.nombre_en) || producto.nombre_es;
  function agregar() {
    if (falta || !onAgregar) return;
    onAgregar({ color, talla });
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1400);
  }
  return <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-card">
    <Foto src={imagenSrc ?? imagenSouvenirUrl(producto.id_imagen)} alt={nombre} className="aspect-square w-full bg-white object-contain p-3" />
    <div className="flex flex-1 flex-col border-t border-border p-5">
      <h3 className="font-display text-xl leading-tight text-brand-deep">{nombre || (es ? "Nombre del producto" : "Product name")}</h3>
      <p className="mt-2 text-lg font-semibold">{precioBs(producto.precio)}</p>
      {colores.length > 0 && <Opciones titulo={es ? "Color" : "Colour"} valores={colores} elegido={color} onElegir={setColor} colores />}
      {producto.tallas.length > 0 && <Opciones titulo={es ? "Talla" : "Size"} valores={producto.tallas} elegido={talla} onElegir={setTalla} />}
      <div className="mt-auto pt-4">
        <button type="button" onClick={agregar} disabled={falta}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
          {agregado ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {agregado ? (es ? "Añadido" : "Added") : (es ? "Añadir al carrito" : "Add to cart")}
        </button>
        {falta && <p className="mt-2 text-center text-xs text-muted-foreground">
          {es ? `Elige ${[colores.length > 1 && !color ? "el color" : "", producto.tallas.length > 1 && !talla ? "la talla" : ""].filter(Boolean).join(" y ")}` : `Choose ${[colores.length > 1 && !color ? "a colour" : "", producto.tallas.length > 1 && !talla ? "a size" : ""].filter(Boolean).join(" and ")}`}
        </p>}
      </div>
    </div>
  </article>;
}

function fechaCorta(iso: string, es: boolean) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 2000, (m ?? 1) - 1, d ?? 1).toLocaleDateString(es ? "es-BO" : "en-GB", { day: "numeric", month: "long" });
}

export function TarjetaPromocion({ promo, productos, es, imagenSrc, onAgregar }: {
  promo: Promocion;
  productos: Souvenir[];
  es: boolean;
  imagenSrc?: string | undefined;
  onAgregar?: (() => void) | undefined;
}) {
  const [agregado, setAgregado] = useState(false);
  const regular = precioRegular(promo, productos);
  const precio = promo.precio ?? (regular > 0 ? regular : null);
  const ahorro = promo.precio !== null && regular > promo.precio ? regular - promo.precio : 0;
  const titulo = (es ? promo.titulo_es : promo.titulo_en) || promo.titulo_es;
  const descripcion = (es ? promo.descripcion_es : promo.descripcion_en) || promo.descripcion_es;
  const imagen = imagenSrc ?? imagenSouvenirUrl(promo.id_imagen);
  const incluidos = promo.productos
    .map((item) => ({ item, producto: productos.find((p) => p.id_souvenir === item.id_souvenir) }))
    .filter((x): x is { item: typeof x.item; producto: Souvenir } => Boolean(x.producto));
  function agregar() {
    if (!onAgregar) return;
    onAgregar();
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1400);
  }
  return <article className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-background to-sky-50 shadow-card">
    <div className={`grid ${imagen ? "md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" : ""}`}>
      {imagen && <Foto src={imagen} alt={titulo} className="max-h-[480px] w-full bg-white object-contain md:h-full" />}
      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950"><Sparkles className="size-3.5" aria-hidden="true" />{es ? "Promoción" : "Special offer"}</span>
          {promo.fecha_fin && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><CalendarClock className="size-3.5" aria-hidden="true" />{es ? `Hasta el ${fechaCorta(promo.fecha_fin, es)}` : `Until ${fechaCorta(promo.fecha_fin, es)}`}</span>}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight text-brand-deep sm:text-3xl">{titulo || (es ? "Título de la promoción" : "Offer title")}</h3>
        {descripcion && <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{descripcion}</p>}
        {incluidos.length > 0 && <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{es ? "Incluye" : "Includes"}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {incluidos.map(({ item, producto }) => <li key={item.id_souvenir} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-sm">
              <Tag className="size-3.5 text-primary" aria-hidden="true" />{item.cantidad > 1 ? `${item.cantidad} × ` : ""}{(es ? producto.nombre_es : producto.nombre_en) || producto.nombre_es}
            </li>)}
          </ul>
        </div>}
        {precio !== null && <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
          {ahorro > 0 && <span className="text-base text-muted-foreground line-through">{precioBs(regular)}</span>}
          <span className="font-display text-3xl font-bold text-brand-deep sm:text-4xl">{precioBs(precio)}</span>
          {ahorro > 0 && <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">{es ? "Ahorras" : "You save"} {precioBs(ahorro)} (−{Math.round((ahorro / regular) * 100)}%)</span>}
        </div>}
        {onAgregar && precio !== null && <button type="button" onClick={agregar}
          className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105">
          {agregado ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {agregado ? (es ? "Añadida" : "Added") : (es ? "Añadir promoción al carrito" : "Add offer to cart")}
        </button>}
      </div>
    </div>
  </article>;
}
