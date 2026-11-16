import { Resources } from "@/components/Resources";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export default function Recursos() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Recursos" : "Resources";
  
  return (
    <SectionView title={title}>
      <Resources />
    </SectionView>
  );
}