import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export const quickLinks = [
  { key: "donate", href: "/donar" },
  { key: "member", href: "/contacto" },
  { key: "reserves", href: "/paisajes" },
  { key: "anniversary", href: "/noticias" },
] as const;

/* ─────────────────────────────────────────────────────────────
   Tipos de navegación (children recursivo para sub-subsecciones)
   ───────────────────────────────────────────────────────────── */
type NavItem = {
  key: string;
  es: string;
  en: string;
  to: string;
  hash?: string;
  children?: NavItem[];
};
type NavGroup = NavItem;

const navSections: NavGroup[] = [
  {
    key: "about",
    es: "Nosotros",
    en: "About",
    to: "/nosotros",
    hash: "nosotros",
    children: [
      { key: "about-who", es: "Quiénes somos", en: "Who we are", to: "/nosotros", hash: "quienes-somos" },
      { key: "about-board", es: "Junta directiva", en: "Board", to: "/nosotros", hash: "junta-directiva" },
      { key: "about-team", es: "Nuestro equipo", en: "Our team", to: "/nosotros", hash: "equipo" },
      {
        key: "about-partners",
        es: "Socios y aliados",
        en: "Partners & allies",
        to: "/nosotros",
        hash: "socios",
        children: [
          { key: "about-partners-fin", es: "Socios y financieros", en: "Partners & funders", to: "/nosotros", hash: "socios-financieros" },
          { key: "about-partners-strat", es: "Aliados estratégicos", en: "Strategic allies", to: "/nosotros", hash: "aliados-estrategicos" },
          { key: "about-partners-corp", es: "Miembros corporativos", en: "Corporate members", to: "/nosotros", hash: "miembros-corporativos" },
        ],
      },
      { key: "about-jobs", es: "Oportunidades", en: "Opportunities", to: "/nosotros", hash: "oportunidades" },
    ],
  },
  {
    key: "landscapes",
    es: "Paisajes",
    en: "Landscapes",
    to: "/paisajes",
    hash: "paisajes",
    children: [
      { key: "land-map", es: "Mapa general de paisajes", en: "Landscapes overview map", to: "/paisajes", hash: "mapa" },
      { key: "land-ben", es: "Pastizales del Beni", en: "Beni grasslands", to: "/paisajes", hash: "beni" },
      { key: "land-yungas", es: "Yungas", en: "Yungas", to: "/paisajes", hash: "yungas" },
      { key: "land-andes", es: "Andes altos", en: "High Andes", to: "/paisajes", hash: "andes" },
      { key: "land-dry", es: "Bosque seco interandino", en: "Inter-Andean dry forest", to: "/paisajes", hash: "bosque-seco" },
      { key: "land-amazon", es: "Amazonía", en: "Amazon", to: "/paisajes", hash: "amazonia" },
      {
        key: "land-programs",
        es: "Programas de conservación de biodiversidad en Bolivia",
        en: "Biodiversity conservation programs in Bolivia",
        to: "/programas",
        hash: "programas",
        children: [
          { key: "land-prog-birds", es: "Conservas aves", en: "Bird conservation", to: "/programas", hash: "aves" },
          { key: "land-prog-kba", es: "KBA / Áreas clave", en: "KBA / Key areas", to: "/programas", hash: "kba" },
          { key: "land-prog-heart", es: "Nature's heartbeat", en: "Nature's heartbeat", to: "/programas", hash: "natures-heartbeat" },
        ],
      },
      { key: "land-andina", es: "Acción andina", en: "Acción Andina", to: "/paisajes", hash: "accion-andina" },
    ],
  },
  {
    key: "resources",
    es: "Recursos",
    en: "Resources",
    to: "/recursos",
    hash: "recursos",
    children: [
      { key: "res-reports", es: "Informes y memorias", en: "Reports & annual reviews", to: "/recursos", hash: "informes" },
      { key: "res-pubs", es: "Publicaciones científicas y técnicas", en: "Scientific & technical publications", to: "/recursos", hash: "publicaciones" },
      { key: "res-gis", es: "Recursos SIG / mapas", en: "GIS resources / maps", to: "/recursos", hash: "sig" },
      { key: "res-collab", es: "Colaboraciones", en: "Collaborations", to: "/recursos", hash: "colaboraciones" },
      { key: "res-legal", es: "Herramientas legales", en: "Legal tools", to: "/recursos", hash: "legales" },
    ],
  },
  {
    key: "news",
    es: "Noticias",
    en: "News",
    to: "/noticias",
    hash: "noticias",
    children: [
      { key: "news-inst", es: "Noticias institucionales", en: "Institutional news", to: "/noticias", hash: "institucionales" },
      { key: "news-stories", es: "Historias de conservación", en: "Conservation stories", to: "/noticias", hash: "historias" },
      { key: "news-agenda", es: "Agenda y eventos", en: "Agenda & events", to: "/noticias", hash: "agenda" },
      { key: "news-social", es: "Redes sociales", en: "Social media", to: "/noticias", hash: "redes" },
      {
        key: "news-media",
        es: "Multimedia",
        en: "Multimedia",
        to: "/noticias",
        hash: "multimedia",
        children: [
          { key: "news-media-yt", es: "Videos de YouTube", en: "YouTube videos", to: "/noticias", hash: "youtube" },
          { key: "news-media-info", es: "Infogramas", en: "Infographics", to: "/noticias", hash: "infogramas" },
          { key: "news-media-flickr", es: "Fotogalería / Flickr", en: "Photo gallery / Flickr", to: "/noticias", hash: "flickr" },
        ],
      },
    ],
  },
  {
    key: "contact",
    es: "Contacto",
    en: "Contact",
    to: "/contacto",
    hash: "contacto",
    children: [
      { key: "contact-donate", es: "Donaciones y membresía", en: "Donations & membership", to: "/contacto", hash: "donaciones" },
      { key: "contact-tourism", es: "Turismo y reservas", en: "Tourism & reserves", to: "/contacto", hash: "turismo" },
      { key: "contact-press", es: "Contacto prensa", en: "Press contact", to: "/contacto", hash: "prensa" },
      { key: "contact-souvenirs", es: "Souvenirs", en: "Souvenirs", to: "/contacto", hash: "souvenirs" },
      { key: "contact-offices", es: "Oficinas", en: "Offices", to: "/contacto", hash: "oficinas" },
      { key: "contact-queries", es: "Consultas", en: "General queries", to: "/contacto", hash: "consultas" },
    ],
  },
];

const pick = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);

function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return <div role="group" aria-label={t("nav.language")} className="inline-flex rounded-full border border-white/35 p-0.5">
    {(["es", "en"] as Lang[]).map((l) => <Button key={l} size="sm" variant={lang === l ? "default" : "ghost"} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-2 uppercase ${lang === l ? "bg-white text-brand-deep hover:bg-white/90" : "text-white hover:bg-white/10 hover:text-white"}`}>{l}</Button>)}
  </div>;
}

/** Botón redondo conmemorativo "30 años" — blanco, resplandor azul solo al hover */
function AnniversaryBadge({ onClick }: { onClick?: (() => void) | undefined }) {
  const { lang } = useI18n();
  return (
    <Link
      to="/noticias"
      onClick={onClick}
      aria-label={lang === "es" ? "30 aniversario" : "30th anniversary"}
      className="group relative inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/60 hover:ring-blue-400/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60"
    >
      <span className="relative flex flex-col items-center leading-none">
        <span className="text-base font-extrabold tracking-tight text-blue-700 drop-shadow-sm">30</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-600 drop-shadow-sm">
          {lang === "es" ? "años" : "yrs"}
        </span>
      </span>
    </Link>
  );
}

/* Ítem de subsección estilizado (hover con acento, fondo y desplazamiento) */
function DropdownItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: (() => void) | undefined;
}) {
  const { lang } = useI18n();
  const label = pick(lang, item.es, item.en);
  const hasChildren = !!item.children?.length;
  const href = `${item.to}${item.hash ? `#${item.hash}` : ""}`;
  return (
    <Link
      to={href}
      onClick={onNavigate}
      className="group/item relative flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 transition-all duration-200 hover:bg-primary/5 hover:pl-4 hover:text-primary"
    >
      <span className="absolute left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary/0 transition-all duration-200 group-hover/item:bg-primary" />
      <span className="min-w-0 flex-1 whitespace-normal leading-snug">{label}</span>
      {hasChildren && (
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover/item:bg-primary/20">
          <ChevronRight className="size-3" />
        </span>
      )}
    </Link>
  );
}

/* Sub-subsecciones en panel lateral (z-50 para no quedar tapado) */
function SubDropdown({
  items,
  onNavigate,
  alignLeft = false,
}: {
  items: NavItem[];
  alignLeft?: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className={`invisible absolute top-0 z-50 w-72 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:translate-x-0 group-focus-within/sub:opacity-100 ${alignLeft ? "right-full pr-2 -translate-x-1" : "left-full pl-2 translate-x-1"}`}>
      <span className={`absolute top-4 size-2 rotate-45 border-border bg-popover ${alignLeft ? "right-1 border-r border-t" : "left-1 border-l border-b"}`} />
      <div className="relative rounded-xl border border-border bg-popover p-2 shadow-xl ring-1 ring-black/5">
        <div className="flex flex-col gap-0.5">
          {items.map((sub) => (
            <DropdownItem key={sub.key} item={sub} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Panel de escritorio: subsecciones + sub-subsecciones (sin overflow-hidden) */
function DesktopDropdown({ section }: { section: NavGroup }) {
  const { lang } = useI18n();
  const alignLeft = section.key === "news" || section.key === "contact";
  return (
    <div className={`invisible absolute top-full z-50 w-80 pt-3 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${alignLeft ? "right-0" : "left-0"}`}>
      <span className={`absolute top-2 size-2.5 rotate-45 border-l border-t border-border bg-popover ${alignLeft ? "right-6" : "left-6"}`} />
      <div className="relative rounded-xl border border-border bg-popover p-2 shadow-xl ring-1 ring-black/5">
        <div className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {pick(lang, section.es, section.en)}
        </div>
        <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex flex-col gap-0.5">
          {section.children?.map((item) => {
            if (item.children?.length) {
              const { hash: _hash, ...parentItem } = item;
              return (
                <div key={item.key} className="group/sub relative">
                  <DropdownItem item={parentItem} />
                  <SubDropdown items={item.children} alignLeft={alignLeft} />
                </div>
              );
            }
            return <DropdownItem key={item.key} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}

/* Acordeón estilizado para el menú móvil */
function MobileSection({ section, onNavigate }: { section: NavGroup; onNavigate: () => void }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/70 py-2">
      <div className="flex items-center justify-between gap-2">
        <Button asChild variant="ghost" className="flex-1 justify-start text-base">
          <Link to={section.to} onClick={onNavigate}>{pick(lang, section.es, section.en)}</Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={pick(lang, "Abrir subsecciones", "Open subsections")}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`transition-colors ${open ? "bg-primary/10 text-primary" : ""}`}
        >
          <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </Button>
      </div>
      {open && (
        <div className="mt-2 flex flex-col gap-0.5 rounded-lg border border-border/70 bg-muted/30 p-2">
          {section.children?.map((item) =>
            item.children?.length ? (
              <details key={item.key} className="group/sub rounded-md">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-deep transition-colors hover:bg-primary/5 hover:text-primary">
                  <span className="min-w-0 flex-1 whitespace-normal leading-snug">{pick(lang, item.es, item.en)}</span>
                  <ChevronDown className="mt-0.5 size-3.5 shrink-0 transition-transform duration-200 group-open/sub:rotate-180" />
                </summary>
                <div className="ml-3 border-l border-border/70 pl-2">
                  {item.children.map((sub) => (
                    <Button
                      key={sub.key}
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-auto w-full justify-start whitespace-normal rounded-md py-2 text-left text-sm font-normal leading-snug text-foreground/80 hover:bg-primary/5 hover:text-primary"
                    >
                      <Link to={`${sub.to}#${sub.hash}`} onClick={onNavigate}>{pick(lang, sub.es, sub.en)}</Link>
                    </Button>
                  ))}
                </div>
              </details>
            ) : (
              <Button
                key={item.key}
                asChild
                variant="ghost"
                size="sm"
                className="h-auto w-full justify-start whitespace-normal rounded-md py-2 text-left text-sm font-normal leading-snug text-foreground/80 hover:bg-primary/5 hover:text-primary"
              >
                <Link to={`${item.to}${item.hash ? `#${item.hash}` : ""}`} onClick={onNavigate}>{pick(lang, item.es, item.en)}</Link>
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const solid = !isHome || scrolled || open;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <>
      {/* Reserva espacio solo en las páginas interiores. */}
      {!isHome && <div aria-hidden="true" className="h-16 xl:h-20" />}

      <header
        className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,box-shadow] duration-400 motion-reduce:transition-none ${
          solid
            ? "bg-brand-deep/95 shadow-md"
            : "bg-transparent"
        }`}
      >
        {/* El desenfoque vive en una capa separada para no afectar al menú móvil fijo. */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${solid ? "backdrop-blur-xl" : "bg-linear-to-b from-black/45 to-transparent"}`} />

        <div className={`relative mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8 transition-[height] duration-400 motion-reduce:transition-none ${scrolled ? "h-16 xl:h-[68px]" : "h-16 xl:h-20"}`}>
          <Logo light />

          <nav aria-label={pick(lang, "Principal", "Main navigation")} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navSections.map((s) => {
                const active = pathname === s.to || pathname.startsWith(`${s.to}/`);
                return (
                  <li key={s.key} className="group relative">
                    <Link
                      to={s.to}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-3 text-sm font-medium transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light ${active ? "text-white" : "text-white/85"}`}
                    >
                      {pick(lang, s.es, s.en)}
                      <ChevronDown className="size-3 opacity-75 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
                      <span aria-hidden="true" className={`absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-brand-light transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 ${active ? "scale-x-100" : "origin-right scale-x-0 group-hover:origin-left"}`} />
                    </Link>
                    <DesktopDropdown section={s} />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <div className="hidden sm:block"><LangSwitch /></div>
            <AnniversaryBadge />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white xl:hidden" aria-label={t("nav.menu")} aria-expanded={open} onClick={() => setOpen(true)}>
              <Menu />
            </Button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-[100] flex h-dvh flex-col bg-background text-foreground xl:hidden">
            <div className="flex h-16 shrink-0 items-center justify-between gap-2 bg-brand-deep px-4 text-white">
              <Logo light />
              <div className="flex items-center gap-2">
                <LangSwitch />
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" aria-label={t("nav.close")} onClick={() => setOpen(false)}><X /></Button>
              </div>
            </div>
            <nav aria-label={pick(lang, "Menú móvil", "Mobile menu")} className="flex-1 overflow-y-auto px-4 py-3">
              {navSections.map((s) => <MobileSection key={s.key} section={s} onNavigate={() => setOpen(false)} />)}
              <div className="mt-6 flex items-center justify-center gap-3">
                <AnniversaryBadge onClick={() => setOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
