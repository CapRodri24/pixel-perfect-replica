import { createFileRoute } from "@tanstack/react-router";
import { News } from "@/components/News";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/noticias")({
  head: () => ({ meta: [
    { title: "Noticias · Asociación Armonía" },
    { name: "description", content: "Noticias, historias y actividades de Asociación Armonía." },
    { property: "og:title", content: "Noticias · Asociación Armonía" },
    { property: "og:description", content: "Noticias, historias y actividades de Asociación Armonía." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SectionPage,
});

function SectionPage() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Noticias" : "News";
  return <SectionView title={title}><News /></SectionView>;
}
