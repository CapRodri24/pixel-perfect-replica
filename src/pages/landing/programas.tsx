import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Programs } from "@/components/Programs";
import { SectionView } from "@/components/SectionView";
import FormatoPrograma, { demoLandscapeUrl } from "./paisajes/formato_programa";

export function Programas() {
  const { lang } = useI18n();
  const { hash, key } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [key]);
  if (["#aves", "#kba", "#natures-heartbeat"].includes(hash)) return <Navigate replace to={`${demoLandscapeUrl}${hash}`} />;
  return <SectionView title={lang === "es" ? "Programas" : "Programs"}><Programs /></SectionView>;
}

export function ProgramaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { key } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [key]);
  return <FormatoPrograma id={id ?? ""} />;
}
