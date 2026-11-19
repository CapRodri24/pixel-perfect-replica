import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, X, Heart } from "lucide-react";
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
  return <div role="group" aria-label={t("nav.language")} className="inline-flex rounded-full border border-border p-0.5">
    {(["es", "en"] as Lang[]).map((l) => <Button key={l} size="sm" variant={lang === l ? "default" : "ghost"} onClick={() => setLang(l)} aria-pressed={lang === l} className="px-2 uppercase">{l}</Button>)}
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
}: {
  items: NavItem[];
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <div className="invisible absolute left-full top-0 z-50 ml-2 w-72 translate-x-1 opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100 group-focus-within/sub:visible group-focus-within/sub:translate-x-0 group-focus-within/sub:opacity-100">
      <span className="absolute -left-2 top-4 size-2 rotate-45 border-l border-b border-border bg-popover" />
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
  return (
    <div className="invisible absolute left-0 top-full z-50 w-80 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <span className="absolute left-6 top-2 size-2.5 rotate-45 border-l border-t border-border bg-popover" />
      <div className="relative rounded-xl border border-border bg-gradient-to-b from-popover to-popover/95 p-2 shadow-xl ring-1 ring-black/5">
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
                  <SubDropdown items={item.children} />
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

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  return <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
    <div className="mx-auto max-w-[1600px] flex h-16 items-center justify-between gap-6 px-4 sm:px-8 xl:h-20">
      <Logo />

      <nav aria-label="Principal" className="hidden xl:block">
        <ul className="flex gap-1">
          {navSections.map((s) => (
            <li key={s.key} className="group relative">
              <Button asChild variant="ghost" className={pathname.startsWith(s.to) ? "bg-secondary text-primary" : "text-brand-deep"}>
                <Link to={s.to}>
                  {pick(lang, s.es, s.en)}
                  <ChevronDown className="size-3 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
              </Button>
              <DesktopDropdown section={s} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden sm:block"><LangSwitch /></div>
        <AnniversaryBadge />
        <Button variant="ghost" size="icon" className="xl:hidden" aria-label={t("nav.menu")} aria-expanded={open} onClick={() => setOpen(true)}><Menu /></Button>
      </div>
    </div>

    {open && <div className="fixed inset-0 z-[100] flex h-dvh flex-col bg-background xl:hidden">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
        <Logo />
        <div className="flex items-center gap-2">
          <LangSwitch />
          <Button variant="ghost" size="icon" aria-label={t("nav.close")} onClick={() => setOpen(false)}><X /></Button>
        </div>
      </div>
      <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto px-4 py-3">
        {navSections.map((s) => <MobileSection key={s.key} section={s} onNavigate={() => setOpen(false)} />)}
        <div className="mt-6 flex items-center justify-center gap-3">
          <AnniversaryBadge onClick={() => setOpen(false)} />
        </div>
      </nav>
    </div>}
  </header>;
}