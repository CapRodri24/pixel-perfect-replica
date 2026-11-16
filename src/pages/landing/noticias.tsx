import { News } from "@/components/News";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export default function Noticias() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Noticias" : "News";
  
  return (
    <SectionView title={title}>
      <News />
    </SectionView>
  );
}