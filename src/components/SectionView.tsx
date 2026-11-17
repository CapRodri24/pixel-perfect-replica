import { Link } from "react-router-dom"; // <-- CORREGIDO
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

export type SectionPath = "/nosotros" | "/paisajes" | "/programas" | "/recursos" | "/noticias";

export function SectionView({ title, children }: { title: string; children: ReactNode }) {
  const { lang } = useI18n();
  return <main className="min-h-[70vh]">
    <div className="container-site pt-8">
      <Button asChild variant="ghost" className="px-0"><Link to="/"><ArrowLeft />{lang === "es" ? "Inicio" : "Home"}</Link></Button>
      <h1 className="mt-3 text-4xl text-brand-deep sm:text-5xl">{title}</h1>
    </div>
    {children}
  </main>;
}

export function SectionShortcut({ to }: { to: SectionPath }) {
  const { lang } = useI18n();
  return <div className="container-site flex justify-end py-5">
    <Button asChild variant="outline"><Link to={to}>{lang === "es" ? "Ver sección completa" : "View full section"}<ArrowUpRight /></Link></Button>
  </div>;
}