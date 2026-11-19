import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Landscapes } from "@/components/Landscapes";
import { SectionView } from "@/components/SectionView";
import FormatoPaisajes from "./paisajes/formato_paisajes";

export default function Paisajes() {
  const { lang } = useI18n();
  const location = useLocation();
  const legacy = ["beni", "yungas", "andes", "bosque-seco", "seco", "amazonia", "accion-andina", "programas", "aves", "kba", "natures-heartbeat"];
  const hash = location.hash.slice(1);
  const detail = new URLSearchParams(location.search).has("paisaje") || legacy.includes(hash);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, hash, detail]);
  if (detail) return <FormatoPaisajes />;
  return <SectionView title={lang === "es" ? "Paisajes" : "Landscapes"}><Landscapes /></SectionView>;
}
