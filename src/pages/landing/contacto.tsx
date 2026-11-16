import { Contact } from "@/components/Contact";
import { SectionView } from "@/components/SectionView";
import { useI18n } from "@/i18n/I18nProvider";

export default function Contacto() {
  const { lang } = useI18n();
  const title = lang === "es" ? "Contacto" : "Contact";
  
  return (
    <SectionView title={title}>
      <Contact />
    </SectionView>
  );
}