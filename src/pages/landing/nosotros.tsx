import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/About";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/nosotros")({
  head: () => ({ meta: [
    { title: "Nosotros · Asociación Armonía" },
    { name: "description", content: "Conoce la misión y el trabajo de Asociación Armonía." },
    { property: "og:title", content: "Nosotros · Asociación Armonía" },
    { property: "og:description", content: "Conoce la misión y el trabajo de Asociación Armonía." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SectionPage,
});

function SectionPage() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Nosotros" : "About us";
  return <SectionView title={title}><About /></SectionView>;
}
