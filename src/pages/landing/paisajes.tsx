import { Landscapes } from "@/components/Landscapes";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export default function Paisajes() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Paisajes" : "Landscapes";
  
  return (
    <SectionView title={title}>
      <Landscapes />
    </SectionView>
  );
}