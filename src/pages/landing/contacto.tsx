import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/Contact";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [
    { title: "Contacto · Asociación Armonía" },
    { name: "description", content: "Contacta con Asociación Armonía y participa en la conservación." },
    { property: "og:title", content: "Contacto · Asociación Armonía" },
    { property: "og:description", content: "Contacta con Asociación Armonía y participa en la conservación." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SectionPage,
});

function SectionPage() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Contacto" : "Contact";
  return <SectionView title={title}><Contact /></SectionView>;
}
