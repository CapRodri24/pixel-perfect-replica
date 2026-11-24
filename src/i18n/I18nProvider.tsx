import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";
import { RUTAS } from "@/config/rutas";

export type Lang = "es" | "en";
const dictionaries = { es, en } as const;
const STORAGE_KEY = "armonia-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: <T = string>(path: string) => T };
const I18nContext = createContext<Ctx | null>(null);

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

/** Idioma inicial: el de la URL localizada si la hay; si no, el guardado; si no, español. */
function initialLang(): Lang {
  if (typeof window === "undefined") return "es";
  const path = window.location.pathname;
  for (const r of Object.values(RUTAS)) {
    if (path === r.es) return "es";
    if (path === r.en) return "en";
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch { /* almacenamiento no disponible */ }
  return "es";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* almacenamiento no disponible */ }
  }, []);
  // Future hook: dynamic content could be machine-translated here when a key is missing.
  const t = useCallback(<T,>(path: string) => (resolve(dictionaries[lang], path) ?? resolve(dictionaries.es, path) ?? path) as T, [lang]);
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
