import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { ListadoPaisajesPublicos, DetallePaisajePublico } from "@/components/PaisajesPublicos";

export default function Paisajes() {
  const { search, key } = useLocation();
  const { lang, t } = useI18n();
  const es = lang === "es";

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [key]);
  const id = new URLSearchParams(search).get("paisaje");
  // Los enlaces antiguos con nombres abren el listado, sin datos ficticios.
  if (id && /^[1-9]\d*$/.test(id)) return <DetallePaisajePublico id={id} />;

  return (
    <main className="min-h-[70vh] overflow-x-clip">
      <section className="relative isolate overflow-hidden bg-brand-deep text-white">
        <img src="/images/home/1.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/20" />
        <div className="container-site flex min-h-[340px] flex-col justify-center py-12 sm:min-h-[440px] sm:py-20">
          <Link to="/" className="mb-7 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="size-4" />
            {es ? "Inicio" : "Home"}
          </Link>
          <span className="text-xs font-bold uppercase tracking-[.2em] text-brand-light">{t("brand.name")}</span>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-6xl lg:text-7xl">
            {es ? "Paisajes" : "Landscapes"}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-lg">
            {es ? "Explora los paisajes de Bolivia y nuestro trabajo de conservación." : "Explore Bolivia’s landscapes and our conservation work."}
          </p>
        </div>
      </section>
      <ListadoPaisajesPublicos />
    </main>
  );
}
