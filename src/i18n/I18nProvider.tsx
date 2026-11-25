import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import es from "./es.json";
import en from "./en.json";
import { RUTAS } from "@/config/rutas";

export type Lang = "es" | "en";
const dictionaries = { es, en } as const;
// Solo guarda la elección hecha a mano con el selector ES/EN (clave nueva: la anterior también
// se llenaba sola al visitar una URL y habría tapado la detección del idioma del navegador).
const STORAGE_KEY = "armonia-lang-elegido";

type Ctx = { lang: Lang; setLang: (l: Lang, opciones?: { guardar?: boolean }) => void; t: <T = string>(path: string) => T };
const I18nContext = createContext<Ctx | null>(null);

function resolve(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined), obj);
}

/** Idioma preferido del navegador: el primero de su lista que sea español o inglés. */
function idiomaNavegador(): Lang | null {
  const lista = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of lista) {
    const base = l?.toLowerCase().split("-")[0];
    if (base === "es" || base === "en") return base;
  }
  return null;
}

/**
 * Idioma inicial, en este orden: el de la URL localizada; el que el visitante eligió con ES/EN;
 * el idioma del navegador; si no, español.
 */
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
  return idiomaNavegador() ?? "es";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang, { guardar = true }: { guardar?: boolean } = {}) => {
    setLangState(l);
    if (!guardar) return;
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
