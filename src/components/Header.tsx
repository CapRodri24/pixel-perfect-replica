import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, Home, Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/i18n/I18nProvider";
import { rutaInterna } from "@/config/rutas";
import { Logo } from "./Logo";
import { listarPaisajesPublicos, type PaisajePublicoResumen } from "@/api/paisajesPublicosApi";
import { listarProgramasPublicos, type ProgramaPublicoResumen } from "@/api/programasPublicosApi";
import { Button } from "@/components/ui/button";

export const quickLinks = [
  { key: "donate", href: "/donar" },
  { key: "member", href: "/contacto/haztemiembro" },
  { key: "reserves", href: "/contacto/visitanuestrasreservas" },
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
    children: [],
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
          { key: "news-media-info", es: "Infografías", en: "Infographics", to: "/noticias", hash: "infogramas" },
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
      { key: "contact-donate", es: "Donaciones y membresía", en: "Donations & membership", to: "/contacto", hash: "donaciones", children: [{ key: "member-page", es: "Hazte miembro", en: "Become a member", to: "/contacto/haztemiembro" }, { key: "donate-page", es: "Donar", en: "Donate", to: "/donar" }] },
      { key: "contact-tourism", es: "Turismo y reservas", en: "Tourism & reserves", to: "/contacto/visitanuestrasreservas" },
      { key: "contact-press", es: "Contacto prensa", en: "Press contact", to: "/contacto/prensa" },
      { key: "contact-souvenirs", es: "Souvenirs", en: "Souvenirs", to: "/contacto/souvenirs" },
      { key: "contact-offices", es: "Oficinas", en: "Offices", to: "/contacto/oficinas" },
      { key: "contact-guide", es: "Guía de campo Aves de Bolivia", en: "Birds of Bolivia field guide", to: "/contacto/guiadecampoaves" },
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

/** Logo conmemorativo de los 30 años (1996-2026); lleva a las noticias. Del mismo tamaño visual que el logo principal. */
function AnniversaryBadge({ onClick, className = "h-12 xl:h-[54px]" }: { onClick?: (() => void) | undefined; className?: string }) {
  const { lang } = useI18n();
  return (
    <Link
      to="/noticias"
      onClick={onClick}
      title={lang === "es" ? "30 años conservando las aves de Bolivia" : "30 years protecting Bolivia’s birds"}
      className="shrink-0 rounded-md transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
    >
      <img
        src="/images/logo-30-anos.png"
        alt={lang === "es" ? "Armonía, 30 años (1996-2026)" : "Armonía, 30 years (1996-2026)"}
        className={`${className} block w-auto object-contain [filter:drop-shadow(0_0_1px_rgba(255,255,255,.95))_drop-shadow(0_0_6px_rgba(255,255,255,.5))_drop-shadow(0_2px_6px_rgba(0,0,0,.35))]`}
      />
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
  const { lang, t } = useI18n();
  const { pathname: urlPathname, hash } = useLocation();
  // Las URLs localizadas (/news/, /support-us/…) se comparan con su ruta interna.
  const pathname = rutaInterna(urlPathname);
  const label = item.es.startsWith("landscapes.items.") ? t(item.es) : pick(lang, item.es, item.en);
  const hasChildren = !!item.children?.length;
  const href = `${item.to}${item.hash ? `#${item.hash}` : ""}`;
  return (
    <Link
      to={href}
      aria-current={item.to === pathname && item.hash && hash === `#${item.hash}` ? "location" : undefined}
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
                  <DropdownItem item={["about-partners", "land-programs", "news-media", "contact-donate"].includes(item.key) ? item : parentItem} />
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
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/70 py-2">
      <div className="flex items-center justify-between gap-2">
        <Button asChild variant="ghost" className="flex-1 justify-start text-base">
          <Link to={section.to} onClick={onNavigate}>{pick(lang, section.es, section.en)}</Link>
        </Button>
        {!!section.children?.length && <Button
          variant="ghost"
          size="icon"
          aria-label={pick(lang, "Abrir subsecciones", "Open subsections")}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`transition-colors ${open ? "bg-primary/10 text-primary" : ""}`}
        >
          <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </Button>}
      </div>
      {open && !!section.children?.length && (
        <div className="mt-2 flex flex-col gap-0.5 rounded-lg border border-border/70 bg-muted/30 p-2">
          {section.children?.map((item) =>
            item.children?.length ? (
              <details key={item.key} className="group/sub rounded-md">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-deep transition-colors hover:bg-primary/5 hover:text-primary">
                  <span className="min-w-0 flex-1 whitespace-normal leading-snug">{item.es.startsWith("landscapes.items.") ? t(item.es) : pick(lang, item.es, item.en)}</span>
                  <ChevronDown className="mt-0.5 size-3.5 shrink-0 transition-transform duration-200 group-open/sub:rotate-180" />
                </summary>
                <div className="ml-3 border-l border-border/70 pl-2">
                  {(["land-programs", "news-media", "contact-donate"].includes(item.key) || item.key.startsWith("paisaje-db-")) && (
                    <DropdownItem item={{ key: item.key, es: item.es, en: item.en, to: item.to, ...(item.hash !== undefined ? { hash: item.hash } : {}) }} onNavigate={onNavigate} />
                  )}
                  {item.key === "about-partners" && (
                    <DropdownItem item={{ key: item.key, es: "Ver socios y aliados", en: "View partners and allies", to: item.to, hash: "socios" }} onNavigate={onNavigate} />
                  )}
                  {item.children.map((sub) => (
                    <Button
                      key={sub.key}
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-auto w-full justify-start whitespace-normal rounded-md py-2 text-left text-sm font-normal leading-snug text-foreground/80 hover:bg-primary/5 hover:text-primary"
                    >
                      <Link to={`${sub.to}${sub.hash ? `#${sub.hash}` : ""}`} onClick={onNavigate}>{pick(lang, sub.es, sub.en)}</Link>
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
                <Link to={`${item.to}${item.hash ? `#${item.hash}` : ""}`} onClick={onNavigate}>{item.es.startsWith("landscapes.items.") ? t(item.es) : pick(lang, item.es, item.en)}</Link>
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
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [paisajesPublicos, setPaisajesPublicos] = useState<PaisajePublicoResumen[]>([]);
  const [programasPublicos, setProgramasPublicos] = useState<ProgramaPublicoResumen[]>([]);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  const { pathname: rawPathname, key: locationKey } = useLocation();
  // Las URLs localizadas (/es, /en, /news/…) se tratan como su ruta interna.
  const pathname = rutaInterna(rawPathname);
  const navigate = useNavigate();
  const goBack = () => {
    if (typeof window.history.state?.idx === "number" && window.history.state.idx > 0) {
      navigate(-1);
    } else if (pathname !== "/") {
      navigate("/", { replace: true });
    }
  };
  const isHome = pathname === "/";
  const solid = !isHome || scrolled || open;

  // Solo se reemplazan los enlaces de paisajes; las demás secciones del menú permanecen intactas.
  const seccionesNavegacion: NavGroup[] = navSections.map((section) => {
    if (section.key !== "landscapes") return section;
    return {
      ...section,
      children: paisajesPublicos.map((p) => ({
        key: `paisaje-db-${p.id_paisaje}`,
        es: p.titulo_es,
        en: p.titulo_en,
        to: `/paisajes?paisaje=${encodeURIComponent(p.id_paisaje)}`,
        children: programasPublicos.filter(pr => pr.id_paisaje === p.id_paisaje).map(pr => ({
          key: `programa-db-${pr.id_programa}`, es: pr.titulo_es, en: pr.titulo_en,
          to: `/programas?programa=${encodeURIComponent(pr.id_programa)}`,
        })),
      })),
    };
  });

  useEffect(() => {
    const abort = new AbortController();
    listarPaisajesPublicos(abort.signal).then((data) => {
      if (!abort.signal.aborted) setPaisajesPublicos(data);
    }).catch(() => {
      // Sin red: el menú conserva su enlace al listado y no falla el encabezado.
    });
    listarProgramasPublicos(abort.signal).then(data => {
      if (!abort.signal.aborted) setProgramasPublicos(data);
    }).catch(() => { if (!abort.signal.aborted) setProgramasPublicos([]); });
    return () => abort.abort();
  }, [pathname, locationKey]);

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

  useEffect(() => { setOpen(false); }, [locationKey]);

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
        onClickCapture={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
        }}
        className={`fixed inset-x-0 top-0 z-50 text-white transition-[background-color,box-shadow] duration-400 motion-reduce:transition-none ${
          solid
            ? "bg-brand-deep/95 shadow-md"
            : "bg-transparent"
        }`}
      >
        {/* El desenfoque vive en una capa separada para no afectar al menú móvil fijo. */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${solid ? "backdrop-blur-xl" : "bg-linear-to-b from-black/45 to-transparent"}`} />

        <div className={`relative mx-auto flex max-w-[1600px] items-center justify-between gap-1 px-3 sm:gap-4 sm:px-8 transition-[height] duration-400 motion-reduce:transition-none ${scrolled ? "h-16 xl:h-[68px]" : "h-16 xl:h-20"}`}>
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            {!isHome && <Button variant="ghost" size="icon" className="size-8 shrink-0 text-white hover:bg-white/10 hover:text-white xl:hidden" aria-label={pick(lang, "Volver atrás", "Go back")} onClick={goBack}><ArrowLeft className="size-5" /></Button>}
            <Logo light className="h-14 xl:h-16" />
          </div>

          <nav aria-label={pick(lang, "Principal", "Main navigation")} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              <li>
                <Link to="/" aria-current={isHome ? "page" : undefined} onClick={() => { if (isHome) window.scrollTo({ top: 0, behavior: "auto" }); }} className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light ${isHome ? "text-white" : "text-white/85"}`}>
                  <Home className="size-4" />
                  {pick(lang, "Inicio", "Home")}
                  {isHome && <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-brand-light" />}
                </Link>
              </li>
              {seccionesNavegacion.map((s) => {
                const active = pathname === s.to || pathname.startsWith(`${s.to}/`);
                return (
                  <li
                    key={s.key}
                    className="group relative"
                    onMouseLeave={() => setDismissed(current => current === s.key ? null : current)}
                    onFocusCapture={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setDismissed(current => current === s.key ? null : current);
                      }
                    }}
                    onClickCapture={(event) => {
                      if (event.target instanceof Element && event.target.closest("a")) {
                        setDismissed(s.key);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setDismissed(s.key);
                        event.currentTarget.querySelector<HTMLAnchorElement>("a")?.focus();
                      } else if (event.key === "ArrowDown" && dismissed === s.key) {
                        event.preventDefault();
                        setDismissed(null);
                      }
                    }}
                  >
                    <Link
                      to={s.to}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-3 text-sm font-medium transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light ${active ? "text-white" : "text-white/85"}`}
                    >
                      {pick(lang, s.es, s.en)}
                      {!!s.children?.length && <ChevronDown className="size-3 opacity-75 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />}
                      <span aria-hidden="true" className={`absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-brand-light transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 ${active ? "scale-x-100" : "origin-right scale-x-0 group-hover:origin-left"}`} />
                    </Link>
                    {dismissed !== s.key && !!s.children?.length && <DesktopDropdown section={s} />}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            <Link to="/" aria-label={pick(lang, "Inicio", "Home")} aria-current={isHome ? "page" : undefined} onClick={() => { if (isHome) window.scrollTo({ top: 0, behavior: "auto" }); }} className="grid size-8 shrink-0 place-items-center rounded-md text-white hover:bg-white/10 xl:hidden"><Home className="size-5" /></Link>
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
              <div className="border-b border-border/70 py-2">
                <Button asChild variant="ghost" className="w-full justify-start gap-2 text-base">
                  <Link to="/" aria-current={isHome ? "page" : undefined} onClick={() => { setOpen(false); if (isHome) window.scrollTo({ top: 0, behavior: "auto" }); }}><Home className="size-5" />{pick(lang, "Inicio", "Home")}</Link>
                </Button>
              </div>
              {seccionesNavegacion.map((s) => <MobileSection key={s.key} section={s} onNavigate={() => setOpen(false)} />)}
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
