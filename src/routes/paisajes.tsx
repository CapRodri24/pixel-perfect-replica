import { createFileRoute } from "@tanstack/react-router";
import { Landscapes } from "@/components/site/Landscapes";
import { SectionView } from "@/components/site/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/paisajes")({
  head: () => ({ meta: [
    { title: "Paisajes · Asociación Armonía" },
    { name: "description", content: "Explora los paisajes de Bolivia y sus líneas de conservación." },
    { property: "og:title", content: "Paisajes · Asociación Armonía" },
    { property: "og:description", content: "Explora los paisajes de Bolivia y sus líneas de conservación." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SectionPage,
});

function SectionPage() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Paisajes" : "Landscapes";
  return <SectionView title={title}><Landscapes /></SectionView>;
}
