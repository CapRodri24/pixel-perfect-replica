import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";

export type Lang = "es" | "en";
const dictionaries = { es, en } as const;
const STORAGE_KEY = "armonia-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: <T = string>(path: string) => T };
const I18nContext = createContext<Ctx | null>(null);

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = (dictionaries[lang].meta.title);
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
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
