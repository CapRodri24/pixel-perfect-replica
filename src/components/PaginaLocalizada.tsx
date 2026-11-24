import { useEffect, useRef, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { RUTAS, idiomaDeRuta, type ClaveRuta } from "@/config/rutas";

/**
 * Envuelve una vista que tiene URL propia en español y en inglés.
 * - Si se entra por la ruta interna (por ejemplo "/donar"), redirige a la URL del idioma actual.
 * - Si se entra por una URL localizada (por ejemplo "/support-us/"), pone el sitio en ese idioma.
 * - Si el visitante cambia de idioma con el selector, cambia a la URL del otro idioma.
 */
export function PaginaLocalizada({ clave, children }: { clave: ClaveRuta; children: ReactNode }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { lang, setLang } = useI18n();
  const idiomaUrl = idiomaDeRuta(clave, pathname);
  const idiomaAnterior = useRef(lang);

  // La URL manda: al entrar por una dirección localizada se usa su idioma.
  useEffect(() => {
    if (idiomaUrl && idiomaUrl !== lang) setLang(idiomaUrl);
    // Solo al cambiar de URL; los cambios de idioma posteriores los maneja el efecto siguiente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idiomaUrl]);

  // Si el visitante cambia el idioma con el selector, se pasa a la URL de ese idioma.
  useEffect(() => {
    const anterior = idiomaAnterior.current;
    idiomaAnterior.current = lang;
    if (idiomaUrl && anterior !== lang && lang !== idiomaUrl) {
      navigate(`${RUTAS[clave][lang]}${search}${hash}`, { replace: true });
    }
  }, [lang, idiomaUrl, clave, navigate, search, hash]);

  if (!idiomaUrl) return <Navigate to={`${RUTAS[clave][lang]}${search}${hash}`} replace />;
  return <>{children}</>;
}
