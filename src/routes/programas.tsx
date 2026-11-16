import { createFileRoute } from "@tanstack/react-router";
import { Programs } from "@/components/site/Programs";
import { SectionView } from "@/components/site/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/programas")({
  head: () => ({ meta: [
    { title: "Programas · Asociación Armonía" },
    { name: "description", content: "Programas de conservación de aves y hábitats de Bolivia." },
    { property: "og:title", content: "Programas · Asociación Armonía" },
    { property: "og:description", content: "Programas de conservación de aves y hábitats de Bolivia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SectionPage,
});

function SectionPage() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Programas" : "Programs";
  return <SectionView title={title}><Programs /></SectionView>;
}
