import { About } from "@/components/About";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export default function Nosotros() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Nosotros" : "About us";
  
  return (
    <SectionView title={title}>
      <About />
    </SectionView>
  );
}