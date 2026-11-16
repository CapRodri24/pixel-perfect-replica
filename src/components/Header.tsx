import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Heart } from "lucide-react";
import { useI18n, type Lang } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export const quickLinks = [
  { key: "donate", href: "/donar" },
  { key: "member", href: "/contacto" },
  { key: "reserves", href: "/paisajes" },
  { key: "anniversary", href: "/noticias" },
] as const;

const navSections = [
  { key: "about", to: "/nosotros", hash: "nosotros" },
  { key: "landscapes", to: "/paisajes", hash: "paisajes" },
  { key: "programs", to: "/programas", hash: "programas" },
  { key: "news", to: "/noticias", hash: "noticias" },
  { key: "contact", to: "/contacto", hash: "contacto" },
] as const;

function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return <div role="group" aria-label={t("nav.language")} className="inline-flex rounded-full border border-border p-0.5">
    {(["es", "en"] as Lang[]).map((l) => <Button key={l} size="sm" variant={lang === l ? "default" : "ghost"} onClick={() => setLang(l)} aria-pressed={lang === l} className="px-2 uppercase">{l}</Button>)}
  </div>;
}

export function Header() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  
  const location = useLocation();
  const pathname = location.pathname;

  const label = (key: string) => key === "programs" ? (lang === "es" ? "Programas" : "Programs") : t<string>(`nav.${key}`);
  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  
  useEffect(() => { setOpen(false); }, [pathname]);

  return <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
    {/* ALTURA AJUSTADA AQUÍ: h-16 (móvil) y xl:h-20 (escritorio) */}
    <div className="mx-auto max-w-[1600px] flex h-16 items-center justify-between gap-6 px-4 sm:px-8 xl:h-20">
      <Logo />
      
      <nav aria-label="Principal" className="hidden xl:block">
        <ul className="flex gap-1">
          {navSections.map((s) => <li key={s.key} className="group relative">
            <Button asChild variant="ghost" className={pathname.startsWith(s.to) ? "bg-secondary text-primary" : "text-brand-deep"}>
              <Link to={s.to}>{label(s.key)}<ChevronDown className="size-3" /></Link>
            </Button>
            <div className="invisible absolute left-0 top-full w-60 pt-2 opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="rounded-lg border border-border bg-popover p-2 shadow-card">
                <Button asChild variant="ghost" className="w-full justify-start"><Link to={s.to}>{lang === "es" ? "Ver sección completa" : "View full section"}</Link></Button>
                <Button asChild variant="ghost" className="w-full justify-start"><Link to={`/#${s.hash}`}>{lang === "es" ? "Atajo en inicio" : "Home shortcut"}</Link></Button>
              </div>
            </div>
          </li>)}
        </ul>
      </nav>
      
      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden sm:block"><LangSwitch /></div>
        <Button asChild variant="hero"><Link to="/donar"><Heart />{lang === "es" ? "Donar" : "Donate"}</Link></Button>
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label={t("nav.menu")} aria-expanded={open} onClick={() => setOpen(true)}><Menu /></Button>
      </div>
    </div>
    
    {open && <div className="fixed inset-0 z-[100] flex h-dvh flex-col bg-background xl:hidden">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4"><Logo /><div className="flex items-center gap-2"><LangSwitch /><Button variant="ghost" size="icon" aria-label={t("nav.close")} onClick={() => setOpen(false)}><X /></Button></div></div>
      <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto px-4 py-5">
        {navSections.map((s) => <div key={s.key} className="border-b border-border py-3">
          <Button asChild variant="ghost" className="w-full justify-start text-base"><Link to={s.to} onClick={() => setOpen(false)}>{label(s.key)}</Link></Button>
          <Button asChild variant="link" size="sm"><Link to={`/#${s.hash}`} onClick={() => setOpen(false)}>{lang === "es" ? "Atajo en inicio" : "Home shortcut"}</Link></Button>
        </div>)}
        <Button asChild variant="hero" size="lg" className="mt-6 w-full"><Link to="/donar" onClick={() => setOpen(false)}><Heart />{lang === "es" ? "Donar" : "Donate"}</Link></Button>
      </nav>
    </div>}
  </header>;
}