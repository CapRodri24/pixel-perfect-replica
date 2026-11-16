import { createFileRoute } from "@tanstack/react-router";
import { DonationForm } from "@/components/DonationForm";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";
import { images } from "@/config/images";

export const Route = createFileRoute("/donar")({
  head: () => ({ meta: [
    { title: "Donar · Asociación Armonía" },
    { name: "description", content: "Apoya la conservación de las aves y los paisajes de Bolivia con una donación a través de Givebutter." },
    { property: "og:title", content: "Donar · Asociación Armonía" },
    { property: "og:description", content: "Tu aporte ayuda a proteger la biodiversidad de Bolivia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DonatePage,
});
function DonatePage() {
  const { lang } = useI18n();
  return <SectionView title={lang === "es" ? "Por las aves. Por Bolivia." : "For birds. For Bolivia."}>
    <div className="container-site grid gap-10 py-12 lg:grid-cols-2">
      <img src={images.landscapes.beni} alt={lang === "es" ? "Paisajes del Beni" : "Beni landscapes"} className="aspect-[4/3] w-full rounded-lg object-cover" />
      <DonationForm />
    </div>
  </SectionView>;
}
