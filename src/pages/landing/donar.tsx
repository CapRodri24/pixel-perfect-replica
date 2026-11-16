import { DonationForm } from "@/components/DonationForm";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";
import { images } from "@/config/images";

export default function Donar() {
  const { lang } = useI18n();
  return (
    <SectionView title={lang === "es" ? "Por las aves. Por Bolivia." : "For birds. For Bolivia."}>
      <div className="container-site grid gap-10 py-12 lg:grid-cols-2">
        <img src={images.landscapes.beni} alt={lang === "es" ? "Paisajes del Beni" : "Beni landscapes"} className="aspect-[4/3] w-full rounded-lg object-cover" />
        <DonationForm />
      </div>
    </SectionView>
  );
}