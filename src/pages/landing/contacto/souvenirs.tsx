import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageCircle, Minus, Plus, RefreshCw, ShoppingBag, ShoppingCart, Sparkles, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { WHATSAPP_ARMONIA } from "@/config/redesSociales";
import { obtenerCatalogoSouvenirs, precioBs, precioRegular, type CatalogoSouvenirs } from "@/api/souvenirsApi";
import { TarjetaProducto, TarjetaPromocion, type SeleccionProducto } from "@/components/souvenirs/Tarjetas";
import { ContactPage } from "./comun";
import { CarruselMovil } from "@/components/CarruselMovil";

type ItemCarrito = { clave: string; nombre: string; detalle: string; precio: number; cantidad: number };

export default function Souvenirs() {
  const { lang } = useI18n();
  const es = lang === "es";
  const [catalogo, setCatalogo] = useState<CatalogoSouvenirs | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">("cargando");
  const [intento, setIntento] = useState(0);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    setEstado("cargando");
    obtenerCatalogoSouvenirs(controller.signal)
      .then((data) => { setCatalogo(data); setEstado("listo"); })
      .catch(() => { if (!controller.signal.aborted) setEstado("error"); });
    return () => controller.abort();
  }, [intento]);

  const productos = catalogo?.productos ?? [];
  const promociones = catalogo?.promociones ?? [];

  function agregar(item: Omit<ItemCarrito, "cantidad">) {
    setCarrito((prev) => prev.some((x) => x.clave === item.clave)
      ? prev.map((x) => x.clave === item.clave ? { ...x, cantidad: Math.min(99, x.cantidad + 1) } : x)
      : [...prev, { ...item, cantidad: 1 }]);
  }
  function cambiar(clave: string, delta: number) {
    setCarrito((prev) => prev.map((x) => x.clave === clave ? { ...x, cantidad: Math.max(0, Math.min(99, x.cantidad + delta)) } : x).filter((x) => x.cantidad > 0));
  }

  const total = carrito.reduce((s, x) => s + x.precio * x.cantidad, 0);
  const unidades = carrito.reduce((s, x) => s + x.cantidad, 0);
  const mensaje = useMemo(() => [
    es ? "Hola, quisiera consultar por estos souvenirs de Armonía:" : "Hello, I would like to enquire about these Armonía souvenirs:",
    ...carrito.map((x) => `• ${x.cantidad} × ${x.nombre}${x.detalle ? ` (${x.detalle})` : ""} — ${precioBs(x.precio * x.cantidad)}`),
    `${es ? "Total referencial" : "Estimated total"}: ${precioBs(total)}`,
    es ? "¿Podrían confirmar disponibilidad y entrega?" : "Could you confirm availability and delivery?",
  ].join("\n"), [carrito, total, es]);

  return <ContactPage title="Souvenirs" description={es ? "Encuentra artículos inspirados en la conservación y prepara tu pedido por WhatsApp." : "Explore conservation-inspired items and prepare your order through WhatsApp."}>
    {estado === "cargando" && <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-5 animate-spin" />{es ? "Cargando productos…" : "Loading products…"}</p>}
    {estado === "error" && <div role="status" className="mx-auto max-w-xl rounded-3xl border border-border bg-muted/40 p-8 text-center">
      <p className="text-muted-foreground">{es ? "No pudimos cargar la tienda. Comprueba tu conexión." : "We couldn't load the shop. Please check your connection."}</p>
      <button type="button" onClick={() => setIntento((n) => n + 1)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><RefreshCw className="size-4" />{es ? "Volver a intentar" : "Try again"}</button>
    </div>}
    {estado === "listo" && !productos.length && !promociones.length && <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border p-10 text-center">
      <ShoppingBag className="mx-auto size-12 text-primary/50" aria-hidden="true" />
      <p className="mt-4 text-muted-foreground">{es ? "Muy pronto publicaremos nuestros souvenirs." : "Our souvenirs will be available soon."}</p>
    </div>}
    {estado === "listo" && (productos.length > 0 || promociones.length > 0) && <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-10">
        {promociones.length > 0 && <section aria-labelledby="titulo-promociones" className="space-y-5">
          <h2 id="titulo-promociones" className="flex items-center gap-2 font-display text-2xl text-brand-deep sm:text-3xl"><Sparkles className="size-6 text-amber-500" aria-hidden="true" />{es ? "Promociones" : "Special offers"}</h2>
          <CarruselMovil nombre={es ? "Promociones" : "Special offers"} gridEscritorio="gap-5" lleno>
          {promociones.map((promo) => <TarjetaPromocion key={promo.id_promocion} promo={promo} productos={productos} es={es}
            onAgregar={() => {
              const regular = precioRegular(promo, productos);
              const precio = promo.precio ?? regular;
              agregar({
                clave: `promo-${promo.id_promocion}`,
                nombre: `${es ? "Promoción" : "Offer"}: ${(es ? promo.titulo_es : promo.titulo_en) || promo.titulo_es}`,
                detalle: promo.productos.map((item) => {
                  const p = productos.find((x) => x.id_souvenir === item.id_souvenir);
                  return p ? `${item.cantidad} × ${(es ? p.nombre_es : p.nombre_en) || p.nombre_es}` : "";
                }).filter(Boolean).join(", "),
                precio,
              });
            }} />)}
          </CarruselMovil>
        </section>}
        {productos.length > 0 && <section aria-labelledby="titulo-productos" className="space-y-5">
          <h2 id="titulo-productos" className="font-display text-2xl text-brand-deep sm:text-3xl">{es ? "Productos" : "Products"}</h2>
          <CarruselMovil nombre={es ? "Productos" : "Products"} gridEscritorio="sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {productos.map((p) => <TarjetaProducto key={p.id_souvenir} producto={p} es={es}
              onAgregar={({ color, talla }: SeleccionProducto) => agregar({
                clave: `prod-${p.id_souvenir}-${color}-${talla}`,
                nombre: (es ? p.nombre_es : p.nombre_en) || p.nombre_es,
                detalle: [color && `${es ? "Color" : "Colour"}: ${color}`, talla && `${es ? "Talla" : "Size"}: ${talla}`].filter(Boolean).join(" · "),
                precio: p.precio,
              })} />)}
          </CarruselMovil>
        </section>}
        <p className="text-xs text-muted-foreground">{es ? "Precios referenciales en bolivianos. No hay cobro en línea: confirmamos disponibilidad y entrega por WhatsApp." : "Reference prices in bolivianos. No online payment: we confirm availability and delivery via WhatsApp."}</p>
      </div>
      <aside className="rounded-3xl border border-border bg-background p-5 shadow-card lg:sticky lg:top-28">
        <h2 className="flex items-center gap-2 font-display text-2xl text-brand-deep"><ShoppingCart className="size-6" />{es ? "Tu carrito" : "Your cart"} ({unidades})</h2>
        {!carrito.length ? <p className="mt-5 text-sm text-muted-foreground">{es ? "Tu carrito está vacío." : "Your cart is empty."}</p> : <>
          <ul className="mt-5 divide-y divide-border">
            {carrito.map((x) => <li key={x.clave} className="py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{x.nombre}</p>
                  {x.detalle && <p className="mt-0.5 text-xs text-muted-foreground">{x.detalle}</p>}
                </div>
                <button type="button" aria-label={es ? "Eliminar" : "Remove"} onClick={() => cambiar(x.clave, -99)} className="p-2 text-muted-foreground hover:text-red-700"><Trash2 className="size-4" /></button>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <button type="button" aria-label={es ? "Restar" : "Decrease"} onClick={() => cambiar(x.clave, -1)} className="rounded-full border p-2"><Minus className="size-4" /></button>
                {x.cantidad}
                <button type="button" aria-label={es ? "Sumar" : "Increase"} onClick={() => cambiar(x.clave, 1)} className="rounded-full border p-2"><Plus className="size-4" /></button>
                <span className="ml-auto font-semibold">{precioBs(x.precio * x.cantidad)}</span>
              </div>
            </li>)}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 font-semibold"><span>{es ? "Total referencial" : "Estimated total"}</span><span>{precioBs(total)}</span></div>
          <a href={`https://wa.me/${WHATSAPP_ARMONIA}?text=${encodeURIComponent(mensaje)}`} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800"><MessageCircle className="size-5" />{es ? "Enviar pedido por WhatsApp" : "Send order via WhatsApp"}</a>
        </>}
      </aside>
    </div>}
  </ContactPage>;
}
