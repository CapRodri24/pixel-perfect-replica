// Administración de la tienda de souvenirs: productos y promociones.
import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { EyeOff, ImagePlus, Loader2, Package, Pencil, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import {
  eliminarPromocion, eliminarSouvenir, guardarPromocion, guardarSouvenir, imagenSouvenirUrl, listarPromociones,
  listarSouvenirs, precioBs, precioRegular, type ImagenEntrada, type Promocion, type Souvenir,
} from "@/api/souvenirsApi";
import { TarjetaProducto, TarjetaPromocion } from "@/components/souvenirs/Tarjetas";
import { AdminHeading, CloseButton, Confirm, Empty, Notice, field, panel, primary, secondary } from "./ui";
import { withTranslator } from "./traduccion";
import { SelectorFecha } from "./SelectorFecha";

type ImagenLocal = { id_imagen?: string | undefined; archivo?: string | undefined; nombre_archivo?: string | undefined };
type BorradorProducto = Omit<Souvenir, "id_souvenir" | "id_imagen" | "precio"> & { id_souvenir?: string; precio: string; imagen: ImagenLocal };
type BorradorPromocion = Omit<Promocion, "id_promocion" | "id_imagen" | "precio"> & { id_promocion?: string; precio: string; imagen: ImagenLocal };
type Pendiente = { tipo: "producto"; item: Souvenir } | { tipo: "promocion"; item: Promocion };

const TALLAS_RAPIDAS = ["XS", "S", "M", "L", "XL", "XXL", "Talla única"];
const hoyLaPaz = () => new Date(Date.now() - 4 * 3600 * 1000).toISOString().slice(0, 10);

const productoVacio = (): BorradorProducto => ({ nombre_es: "", nombre_en: "", colores_es: [], colores_en: [], tallas: [], precio: "", disponible: true, imagen: {} });
const promocionVacia = (): BorradorPromocion => ({ titulo_es: "", titulo_en: "", descripcion_es: "", descripcion_en: "", precio: "", fecha_inicio: null, fecha_fin: null, activa: true, productos: [], imagen: {} });

function mensaje(e: unknown) { return e instanceof Error ? e.message : "Ocurrió un error inesperado."; }
function aNumero(valor: string) { const n = Number(valor.replace(",", ".")); return valor.trim() !== "" && Number.isFinite(n) ? n : null; }
function srcImagen(imagen: ImagenLocal) { return imagen.archivo || imagenSouvenirUrl(imagen.id_imagen); }
function entradaImagen(imagen: ImagenLocal): ImagenEntrada | null {
  if (imagen.archivo) return { archivo: imagen.archivo, nombre_archivo: imagen.nombre_archivo || "imagen" };
  if (imagen.id_imagen) return { id_imagen: imagen.id_imagen };
  return null;
}

function leerImagen(file: File): Promise<ImagenLocal> {
  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) return Promise.reject(new Error("Utiliza una imagen JPG, PNG, WEBP o GIF."));
  if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error("La imagen debe pesar como máximo 5 MB."));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => typeof reader.result === "string" ? resolve({ archivo: reader.result, nombre_archivo: file.name }) : reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

/** Lista de valores como etiquetas: se escribe y se pulsa Enter (o coma) para añadir. */
function Etiquetas({ id, valores, onChange, placeholder, rapidas }: { id: string; valores: string[]; onChange: (v: string[]) => void; placeholder: string; rapidas?: string[] }) {
  const [texto, setTexto] = useState("");
  function añadir(valor: string) {
    const nuevos = valor.split(",").map((v) => v.trim()).filter(Boolean).filter((v) => !valores.some((x) => x.toLowerCase() === v.toLowerCase()));
    if (nuevos.length) onChange([...valores, ...nuevos].slice(0, 20));
    setTexto("");
  }
  function tecla(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); añadir(texto); }
    if (e.key === "Backspace" && !texto && valores.length) onChange(valores.slice(0, -1));
  }
  return <div className="space-y-2">
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
      {valores.map((v) => <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-3 pr-1 text-xs font-semibold text-primary">
        {v}<button type="button" aria-label={`Quitar ${v}`} onClick={() => onChange(valores.filter((x) => x !== v))} className="rounded-full p-0.5 hover:bg-primary/20"><X className="size-3.5" /></button>
      </span>)}
      <input id={id} value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={tecla} onBlur={() => texto.trim() && añadir(texto)} placeholder={valores.length ? "" : placeholder} className="min-w-28 flex-1 bg-transparent px-1 py-1 text-sm text-black outline-none" />
    </div>
    {rapidas && <div className="flex flex-wrap gap-1.5">
      {rapidas.filter((r) => !valores.includes(r)).map((r) => <button key={r} type="button" onClick={() => onChange([...valores, r])} className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">+ {r}</button>)}
    </div>}
  </div>;
}

function SelectorImagen({ imagen, onChange, onQuitar, ayuda }: { imagen: ImagenLocal; onChange: (i: ImagenLocal) => void; onQuitar?: () => void; ayuda: string }) {
  const [error, setError] = useState("");
  async function cargar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try { onChange(await leerImagen(file)); } catch (err) { setError(mensaje(err)); }
  }
  const src = srcImagen(imagen);
  return <div className="space-y-2">
    {src && <img src={src} alt="Vista previa" className="max-h-56 w-full rounded-xl border border-border bg-white object-contain" />}
    <div className="flex flex-wrap gap-2">
      <label className={`${secondary} cursor-pointer`}><ImagePlus className="size-4" />{src ? "Reemplazar imagen" : "Subir imagen"}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={cargar} />
      </label>
      {src && onQuitar && <button type="button" className={`${secondary} text-red-700`} onClick={onQuitar}><Trash2 className="size-4" />Quitar imagen</button>}
    </div>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <p className="text-xs text-muted-foreground">{ayuda}</p>
  </div>;
}

function estadoPromocion(p: Promocion) {
  const hoy = hoyLaPaz();
  if (!p.activa) return { texto: "Oculta", clase: "bg-muted text-muted-foreground" };
  if (p.fecha_fin && p.fecha_fin < hoy) return { texto: "Vencida", clase: "bg-red-100 text-red-800" };
  if (p.fecha_inicio && p.fecha_inicio > hoy) return { texto: "Programada", clase: "bg-sky-100 text-sky-800" };
  return { texto: "Visible en la web", clase: "bg-green-100 text-green-800" };
}

export default function SouvenirsAdmin() {
  const [pestana, setPestana] = useState<"productos" | "promociones">("productos");
  const [productos, setProductos] = useState<Souvenir[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [producto, setProducto] = useState<BorradorProducto | null>(null);
  const [promocion, setPromocion] = useState<BorradorPromocion | null>(null);
  const [pendiente, setPendiente] = useState<Pendiente | null>(null);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      const [a, b] = await Promise.all([listarSouvenirs(), listarPromociones()]);
      setProductos(a);
      setPromociones(b);
    } catch (e) { setError(mensaje(e)); }
    finally { setCargando(false); }
  }
  useEffect(() => { void cargar(); }, []);

  function cerrar() { setProducto(null); setPromocion(null); setError(""); }

  // ---------- Productos ----------
  async function guardarProducto(e: FormEvent) {
    e.preventDefault();
    if (!producto) return;
    setError(""); setExito("");
    const precio = aNumero(producto.precio);
    if (!producto.nombre_es.trim()) return setError("Escribe el nombre del producto.");
    if (precio === null || precio < 0) return setError("Escribe un precio válido en bolivianos.");
    const imagen = entradaImagen(producto.imagen);
    if (!imagen) return setError("Sube la imagen del producto.");
    setOcupado(true);
    try {
      const { nombre_en, colores_en } = await withTranslator(async (t) => ({
        nombre_en: await t(producto.nombre_es.trim()),
        colores_en: await Promise.all(producto.colores_es.map((c) => t(c))),
      }));
      await guardarSouvenir({ nombre_es: producto.nombre_es.trim(), nombre_en, colores_es: producto.colores_es, colores_en, tallas: producto.tallas, precio, disponible: producto.disponible, imagen }, producto.id_souvenir);
      setExito(producto.id_souvenir ? "Producto actualizado." : "Producto creado.");
      setProducto(null);
      await cargar();
    } catch (err) { setError(mensaje(err)); }
    finally { setOcupado(false); }
  }

  // ---------- Promociones ----------
  async function guardarPromo(e: FormEvent) {
    e.preventDefault();
    if (!promocion) return;
    setError(""); setExito("");
    if (!promocion.titulo_es.trim()) return setError("Escribe el título de la promoción.");
    const precio = promocion.precio.trim() ? aNumero(promocion.precio) : null;
    if (promocion.precio.trim() && (precio === null || precio < 0)) return setError("Escribe un precio promocional válido.");
    if (promocion.fecha_inicio && promocion.fecha_fin && promocion.fecha_fin < promocion.fecha_inicio) return setError("La fecha de fin no puede ser anterior a la de inicio.");
    setOcupado(true);
    try {
      const { titulo_en, descripcion_en } = await withTranslator(async (t) => ({
        titulo_en: await t(promocion.titulo_es.trim()),
        descripcion_en: await t(promocion.descripcion_es.trim()),
      }));
      await guardarPromocion({
        titulo_es: promocion.titulo_es.trim(), titulo_en, descripcion_es: promocion.descripcion_es.trim(), descripcion_en,
        precio, fecha_inicio: promocion.fecha_inicio || null, fecha_fin: promocion.fecha_fin || null, activa: promocion.activa,
        productos: promocion.productos, imagen: entradaImagen(promocion.imagen),
      }, promocion.id_promocion);
      setExito(promocion.id_promocion ? "Promoción actualizada." : "Promoción creada.");
      setPromocion(null);
      await cargar();
    } catch (err) { setError(mensaje(err)); }
    finally { setOcupado(false); }
  }

  async function confirmarEliminar() {
    if (!pendiente) return;
    const actual = pendiente;
    setPendiente(null);
    setOcupado(true); setError(""); setExito("");
    try {
      if (actual.tipo === "producto") await eliminarSouvenir(actual.item.id_souvenir);
      else await eliminarPromocion(actual.item.id_promocion);
      setExito(actual.tipo === "producto" ? "Producto eliminado." : "Promoción eliminada.");
      await cargar();
    } catch (err) { setError(mensaje(err)); }
    finally { setOcupado(false); }
  }

  const editando = Boolean(producto || promocion);
  const productoVista: Souvenir | null = producto && { ...producto, id_souvenir: producto.id_souvenir || "nuevo", id_imagen: producto.imagen.id_imagen || "", precio: aNumero(producto.precio) ?? 0, nombre_en: producto.nombre_es, colores_en: producto.colores_es };
  const promoVista: Promocion | null = promocion && { ...promocion, id_promocion: "vista", id_imagen: promocion.imagen.id_imagen || null, precio: promocion.precio.trim() ? aNumero(promocion.precio) : null, titulo_en: promocion.titulo_es, descripcion_en: promocion.descripcion_es };
  const regular = promocion ? precioRegular(promocion, productos) : 0;

  return <div className="mx-auto max-w-7xl space-y-6">
    <AdminHeading title="Souvenirs" description="Productos y promociones de la tienda. Lo que guardes aquí se muestra en la página Souvenirs de la web." count={productos.length} />

    <div role="tablist" aria-label="Secciones de souvenirs" className="inline-flex rounded-2xl border border-border bg-white p-1">
      {([["productos", "Productos", productos.length, Package], ["promociones", "Promociones", promociones.length, Sparkles]] as const).map(([id, nombre, n, Icono]) =>
        <button key={id} role="tab" type="button" aria-selected={pestana === id} disabled={editando || ocupado} onClick={() => { setPestana(id); setExito(""); }}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${pestana === id ? "bg-primary text-primary-foreground shadow-sm" : "text-brand-deep hover:bg-muted"}`}>
          <Icono className="size-4" aria-hidden="true" />{nombre}<span className={`rounded-full px-2 text-xs ${pestana === id ? "bg-white/25" : "bg-muted"}`}>{n}</span>
        </button>)}
    </div>

    <Notice error={error} success={exito} />

    {cargando ? <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-5 animate-spin" />Cargando…</p>

    : producto ? <form noValidate onSubmit={guardarProducto} className={`${panel} border-t-4 border-t-[#2381C4]`}>
      <fieldset disabled={ocupado} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-xl text-brand-deep">{producto.id_souvenir ? "Editar producto" : "Nuevo producto"}</h3>
            <CloseButton onClick={cerrar} />
          </div>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
            <label className="block text-sm font-semibold">Nombre
              <input className={field} value={producto.nombre_es} maxLength={150} onChange={(e) => setProducto({ ...producto, nombre_es: e.target.value })} placeholder="Polera institucional" />
            </label>
            <label className="block text-sm font-semibold">Precio (Bs)
              <input className={field} type="number" min="0" step="0.5" inputMode="decimal" value={producto.precio} onChange={(e) => setProducto({ ...producto, precio: e.target.value })} placeholder="90" />
            </label>
          </div>
          <div className="block text-sm font-semibold"><label htmlFor="souvenir-colores">Colores</label>
            <Etiquetas id="souvenir-colores" valores={producto.colores_es} onChange={(colores_es) => setProducto({ ...producto, colores_es })} placeholder="Escribe un color y pulsa Enter (ej.: Blanco)" />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Déjalo vacío si el producto no tiene opciones de color.</span>
          </div>
          <div className="block text-sm font-semibold"><label htmlFor="souvenir-tallas">Tallas</label>
            <Etiquetas id="souvenir-tallas" valores={producto.tallas} onChange={(tallas) => setProducto({ ...producto, tallas })} placeholder="Escribe una talla y pulsa Enter" rapidas={TALLAS_RAPIDAS} />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Déjalo vacío si el producto no tiene tallas (por ejemplo, una bolsa o un cuaderno).</span>
          </div>
          <div className="space-y-2 rounded-2xl bg-[#edf6fc] p-4">
            <h4 className="text-sm font-bold text-brand-deep">Imagen del producto</h4>
            <SelectorImagen imagen={producto.imagen} onChange={(imagen) => setProducto({ ...producto, imagen })} ayuda="Recomendado: imagen cuadrada de 1000 × 1000 px con fondo claro, JPG o WebP de menos de 1 MB (máximo 5 MB)." />
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" className="size-5 accent-[#2381C4]" checked={producto.disponible} onChange={(e) => setProducto({ ...producto, disponible: e.target.checked })} />
            Mostrar en la web
          </label>
          <p className="text-xs text-muted-foreground">Escribe en español: el nombre y los colores se traducen al inglés automáticamente al guardar.</p>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <CloseButton onClick={cerrar} />
            <button type="submit" className={primary}>{ocupado ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{ocupado ? "Guardando…" : "Guardar producto"}</button>
          </div>
        </div>
        {productoVista && <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Vista previa</p>
          <TarjetaProducto producto={productoVista} es imagenSrc={srcImagen(producto.imagen)} onAgregar={() => undefined} />
        </div>}
      </fieldset>
    </form>

    : promocion ? <form noValidate onSubmit={guardarPromo} className={`${panel} border-t-4 border-t-amber-400`}>
      <fieldset disabled={ocupado} className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-xl text-brand-deep">{promocion.id_promocion ? "Editar promoción" : "Nueva promoción"}</h3>
          <CloseButton onClick={cerrar} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-semibold">Título
              <input className={field} value={promocion.titulo_es} maxLength={150} onChange={(e) => setPromocion({ ...promocion, titulo_es: e.target.value })} placeholder="Combo aniversario: polera + gorra" />
            </label>
            <label className="block text-sm font-semibold">Descripción
              <textarea className={field} rows={3} maxLength={1000} value={promocion.descripcion_es} onChange={(e) => setPromocion({ ...promocion, descripcion_es: e.target.value })} placeholder="Celebra los 30 años de Armonía con este combo especial." />
            </label>
            <div className="space-y-2 rounded-2xl bg-amber-50 p-4">
              <h4 className="text-sm font-bold text-brand-deep">Imagen o banner (opcional)</h4>
              <SelectorImagen imagen={promocion.imagen} onChange={(imagen) => setPromocion({ ...promocion, imagen })} onQuitar={() => setPromocion({ ...promocion, imagen: {} })} ayuda="Puedes subir el diseño exportado desde Canva (PNG o JPG). Se muestra completo, sin recortes. Máximo 5 MB." />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Productos incluidos</p>
              {!productos.length ? <p className="mt-2 text-sm text-muted-foreground">Primero crea productos en la pestaña Productos.</p>
              : <ul className="mt-2 max-h-64 divide-y divide-border overflow-y-auto rounded-xl border border-border bg-background">
                {productos.map((p) => {
                  const item = promocion.productos.find((x) => x.id_souvenir === p.id_souvenir);
                  return <li key={p.id_souvenir} className="flex items-center gap-3 px-3 py-2">
                    <input type="checkbox" className="size-4 accent-[#2381C4]" id={`promo-p-${p.id_souvenir}`} checked={Boolean(item)}
                      onChange={(e) => setPromocion({ ...promocion, productos: e.target.checked ? [...promocion.productos, { id_souvenir: p.id_souvenir, cantidad: 1 }] : promocion.productos.filter((x) => x.id_souvenir !== p.id_souvenir) })} />
                    <img src={imagenSouvenirUrl(p.id_imagen)} alt="" className="size-10 shrink-0 rounded-lg border border-border bg-white object-contain" />
                    <label htmlFor={`promo-p-${p.id_souvenir}`} className="min-w-0 flex-1 text-sm"><span className="block truncate font-medium">{p.nombre_es}</span><span className="text-xs text-muted-foreground">{precioBs(p.precio)}{!p.disponible && " · oculto en la web (no se mostrará en la promoción)"}</span></label>
                    {item && <label className="flex items-center gap-1 text-xs text-muted-foreground">Cant.
                      <input type="number" min={1} max={99} value={item.cantidad} aria-label={`Cantidad de ${p.nombre_es}`}
                        onChange={(e) => setPromocion({ ...promocion, productos: promocion.productos.map((x) => x.id_souvenir === p.id_souvenir ? { ...x, cantidad: Math.max(1, Math.min(99, Number(e.target.value) || 1)) } : x) })}
                        className="w-14 rounded-lg border border-border px-2 py-1 text-sm text-black" />
                    </label>}
                  </li>;
                })}
              </ul>}
              {regular > 0 && <p className="mt-2 text-xs text-muted-foreground">Precio normal de lo incluido: <strong>{precioBs(regular)}</strong></p>}
            </div>
            <label className="block text-sm font-semibold">Precio promocional (Bs)
              <input className={field} type="number" min="0" step="0.5" inputMode="decimal" value={promocion.precio} onChange={(e) => setPromocion({ ...promocion, precio: e.target.value })} placeholder={regular > 0 ? `Menos de ${regular}` : "Opcional"} />
              {(() => { const n = aNumero(promocion.precio); return n !== null && regular > n ? <span className="mt-1 block text-xs font-semibold text-green-700">El cliente ahorra {precioBs(regular - n)} (−{Math.round(((regular - n) / regular) * 100)}%).</span> : null; })()}
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 text-sm font-semibold"><span className="block">Desde (opcional)</span>
                <SelectorFecha etiqueta="Fecha de inicio" placeholder="Desde hoy" valor={promocion.fecha_inicio}
                  onChange={(fecha_inicio) => setPromocion({ ...promocion, fecha_inicio, fecha_fin: promocion.fecha_fin && fecha_inicio && promocion.fecha_fin < fecha_inicio ? null : promocion.fecha_fin })} />
              </div>
              <div className="space-y-1.5 text-sm font-semibold"><span className="block">Hasta (opcional)</span>
                <SelectorFecha etiqueta="Fecha de fin" placeholder="Sin fecha de fin" valor={promocion.fecha_fin} minimo={promocion.fecha_inicio}
                  onChange={(fecha_fin) => setPromocion({ ...promocion, fecha_fin })} />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" className="size-5 accent-[#2381C4]" checked={promocion.activa} onChange={(e) => setPromocion({ ...promocion, activa: e.target.checked })} />
              Mostrar en la web
            </label>
            <p className="text-xs text-muted-foreground">Sin fechas, la promoción se muestra hasta que la ocultes. Con fecha «Hasta», desaparece sola al día siguiente.</p>
          </div>
        </div>
        {promoVista && <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Vista previa</p>
          <TarjetaPromocion promo={promoVista} productos={productos} es imagenSrc={srcImagen(promocion.imagen) || undefined} onAgregar={() => undefined} />
        </div>}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <CloseButton onClick={cerrar} />
          <button type="submit" className={primary}>{ocupado ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}{ocupado ? "Guardando…" : "Guardar promoción"}</button>
        </div>
      </fieldset>
    </form>

    : pestana === "productos" ? <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
        <h2 className="font-display text-xl text-brand-deep">Productos</h2>
        <button type="button" className={primary} disabled={ocupado} onClick={() => { setExito(""); setProducto(productoVacio()); }}><Plus className="size-5" />Añadir producto</button>
      </div>
      {!productos.length ? <Empty text="Aún no hay productos. Añade el primero para que aparezca en la web." />
      : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {productos.map((p) => <article key={p.id_souvenir} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="relative">
            <img src={imagenSouvenirUrl(p.id_imagen)} alt={p.nombre_es} className="aspect-[4/3] w-full bg-white object-contain p-2" />
            {!p.disponible && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white"><EyeOff className="size-3.5" />Oculto</span>}
          </div>
          <div className="space-y-2 border-t border-border p-4">
            <h3 className="font-display text-lg text-brand-deep">{p.nombre_es}</h3>
            <p className="font-semibold">{precioBs(p.precio)}</p>
            {p.colores_es.length > 0 && <p className="text-xs text-muted-foreground"><strong>Colores:</strong> {p.colores_es.join(", ")}</p>}
            {p.tallas.length > 0 && <p className="text-xs text-muted-foreground"><strong>Tallas:</strong> {p.tallas.join(", ")}</p>}
            <div className="flex gap-2 border-t border-border pt-3">
              <button type="button" className={secondary} disabled={ocupado} onClick={() => { setExito(""); setProducto({ ...p, precio: String(p.precio), imagen: { id_imagen: p.id_imagen } }); }}><Pencil className="size-4" />Editar</button>
              <button type="button" className={secondary} disabled={ocupado} onClick={() => setPendiente({ tipo: "producto", item: p })}><Trash2 className="size-4" />Eliminar</button>
            </div>
          </div>
        </article>)}
      </div>}
    </section>

    : <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
        <div>
          <h2 className="font-display text-xl text-brand-deep">Promociones</h2>
          <p className="text-xs text-muted-foreground">Se muestran en un apartado destacado arriba de los productos.</p>
        </div>
        <button type="button" className={primary} disabled={ocupado} onClick={() => { setExito(""); setPromocion(promocionVacia()); }}><Plus className="size-5" />Añadir promoción</button>
      </div>
      {!promociones.length ? <Empty text="No hay promociones. Crea una para destacarla en la tienda." />
      : <div className="grid gap-4 md:grid-cols-2">
        {promociones.map((p) => {
          const estado = estadoPromocion(p);
          const reg = precioRegular(p, productos);
          return <article key={p.id_promocion} className="flex gap-4 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm">
            {p.id_imagen ? <img src={imagenSouvenirUrl(p.id_imagen)} alt="" className="size-24 shrink-0 rounded-xl border border-border bg-white object-contain" />
              : <div className="grid size-24 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-500"><Sparkles className="size-8" /></div>}
            <div className="min-w-0 flex-1 space-y-1.5">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${estado.clase}`}>{estado.texto}</span>
              <h3 className="font-display text-lg leading-tight text-brand-deep">{p.titulo_es}</h3>
              <p className="text-sm">
                {p.precio !== null && reg > p.precio && <span className="mr-2 text-muted-foreground line-through">{precioBs(reg)}</span>}
                <strong>{p.precio !== null ? precioBs(p.precio) : reg > 0 ? precioBs(reg) : "Sin precio"}</strong>
              </p>
              <p className="text-xs text-muted-foreground">{p.productos.length} producto(s){p.fecha_inicio || p.fecha_fin ? ` · ${p.fecha_inicio ? `desde ${p.fecha_inicio}` : ""}${p.fecha_inicio && p.fecha_fin ? " " : ""}${p.fecha_fin ? `hasta ${p.fecha_fin}` : ""}` : ""}</p>
              <div className="flex gap-2 pt-1">
                <button type="button" className={secondary} disabled={ocupado} onClick={() => { setExito(""); setPromocion({ ...p, precio: p.precio === null ? "" : String(p.precio), imagen: p.id_imagen ? { id_imagen: p.id_imagen } : {} }); }}><Pencil className="size-4" />Editar</button>
                <button type="button" className={secondary} disabled={ocupado} onClick={() => setPendiente({ tipo: "promocion", item: p })}><Trash2 className="size-4" />Eliminar</button>
              </div>
            </div>
          </article>;
        })}
      </div>}
    </section>}

    {pendiente && <Confirm danger text={`¿Eliminar ${pendiente.tipo === "producto" ? "el producto" : "la promoción"} «${pendiente.tipo === "producto" ? pendiente.item.nombre_es : pendiente.item.titulo_es}»? Esta acción no se puede deshacer.`} onClose={() => setPendiente(null)} onConfirm={() => void confirmarEliminar()} />}
  </div>;
}
