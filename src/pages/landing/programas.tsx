import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Programs } from "@/components/Programs";
import FormatoPrograma from "./paisajes/formato_programa";
export function Programas() {
  const { search, key } = useLocation();
  const { id: rutaId } = useParams();
  const { lang, t } = useI18n(); const es = lang === "es";
  const id = new URLSearchParams(search).get("programa") || rutaId;
  useEffect(() => { window.scrollTo({top: 0, behavior: "instant"}); }, [key]);
  if (id) return <FormatoPrograma key={id} id={id} />;
  return <main id="programas-pagina" className="min-h-[70vh] overflow-x-clip">
    <section className="relative isolate overflow-hidden bg-brand-deep text-white">
      <img src="/images/home/3.jpg" alt="" className="absolute inset-0 -z-20 size-full object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/55 to-black/20" />
      <div className="container-site flex min-h-[340px] flex-col justify-center py-12 sm:min-h-[440px] sm:py-20">
        <Link to="/" className="mb-7 inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white"><ArrowLeft className="size-4" />{es ? "Inicio" : "Home"}</Link>
        <span className="text-xs font-bold uppercase tracking-[.2em] text-brand-light">{t("brand.name")}</span>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-white sm:text-6xl lg:text-7xl">{es ? "Programas" : "Programs"}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-lg">{es ? "Programas de conservación de biodiversidad en Bolivia" : "Biodiversity conservation programs in Bolivia"}</p>
      </div>
    </section><Programs />
  </main>;
}

// Compatibilidad con la ruta de detalle registrada en App.tsx.
export function ProgramaDetalle() {
  return <Programas />;
}

export default Programas;
