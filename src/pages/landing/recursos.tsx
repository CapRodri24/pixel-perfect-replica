import { createFileRoute } from "@tanstack/react-router";
import { Resources } from "@/components/Resources";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/recursos")({
  head: () => ({ meta: [
    { title: "Recursos · Asociación Armonía" },
    { name: "description", content: "Biblioteca y recursos de conservación de Asociación Armonía." },
    { property: "og:title", content: "Recursos · Asociación Armonía" },
    { property: "og:description", content: "Biblioteca y recursos de conservación de Asociación Armonía." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SectionPage,
});

function SectionPage() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Recursos" : "Resources";
  return <SectionView title={title}><Resources /></SectionView>;
}
