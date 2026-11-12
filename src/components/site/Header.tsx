import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Heart, UserPlus, MapPin, BookOpen, Sparkles } from "lucide-react";
import { useI18n, type Lang } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export const quickLinks = [
  { key: "donate", href: "#contacto", icon: Heart },
  { key: "member", href: "#contacto", icon: UserPlus },
  { key: "reserves", href: "#contacto", icon: MapPin },
  { key: "guide", href: "#recursos", icon: BookOpen },
  { key: "anniversary", href: "#noticias", icon: Sparkles },
] as const;

const navSections = [
  { key: "about", href: "#nosotros" },
  { key: "landscapes", href: "#paisajes" },
  { key: "resources", href: "#recursos" },
  { key: "news", href: "#noticias" },
  { key: "contact", href: "#contacto" },
] as const;

function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t("nav.language")} className={`inline-flex rounded-full border border-border p-0.5 text-xs font-bold ${className}`}>
      {(["es", "en"] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`rounded-full px-3 py-1.5 uppercase transition-colors ${lang === l ? "bg-primary text-primary-foreground" : "text-brand-gray hover:text-primary"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const current = navSections.filter((s) => {
        const el = document.querySelector(s.href);
        return el && el.getBoundingClientRect().top < 160;
      }).pop();
      setActive(current?.href ?? "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur transition-shadow ${scrolled ? "shadow-card" : ""}`}>
      {/* Permanent quick links */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-site flex items-center gap-1 overflow-x-auto py-1.5 text-xs font-medium [scrollbar-width:none]">
          {quickLinks.map(({ key, href, icon: Icon }) => (
            <a key={key} href={href} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:bg-primary-foreground/15 ${key === "donate" ? "bg-primary-foreground text-primary hover:bg-brand-light" : ""}`}>
              <Icon className="size-3.5" /> {t(`quick.${key}`)}
            </a>
          ))}
        </div>
      </div>

      <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navSections.map((s) => (
              <li key={s.key} className="group relative">
                <a href={s.href} className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-secondary hover:text-primary ${active === s.href ? "text-primary" : "text-brand-deep"}`}>
                  {t(`nav.${s.key}`)} <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </a>
                {active === s.href && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded bg-primary" />}
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="w-64 rounded-2xl border border-border bg-popover p-2 shadow-card">
                    {t<string[]>(`nav.${s.key}Items`).map((item) => (
                      <li key={item}><a href={s.href} className="block rounded-xl px-3 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary">{item}</a></li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("nav.menu")} aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu className="size-6!" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <div className="container-site flex h-16 items-center justify-between border-b border-border">
            <Logo />
            <Button variant="ghost" size="icon" aria-label={t("nav.close")} onClick={() => setOpen(false)}><X className="size-6!" /></Button>
          </div>
          <nav className="container-site flex-1 overflow-y-auto py-4">
            {navSections.map((s) => (
              <details key={s.key} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-base font-bold uppercase tracking-wide text-brand-deep">
                  {t(`nav.${s.key}`)} <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="pb-3">
                  {t<string[]>(`nav.${s.key}Items`).map((item) => (
                    <li key={item}><a href={s.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-foreground hover:bg-secondary">{item}</a></li>
                  ))}
                </ul>
              </details>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {quickLinks.map(({ key, href, icon: Icon }) => (
                <a key={key} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-2xl p-3 text-sm font-semibold ${key === "donate" ? "col-span-2 bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  <Icon className="size-4 shrink-0" /> {t(`quick.${key}`)}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
