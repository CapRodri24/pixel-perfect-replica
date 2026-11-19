import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import type { SVGProps } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { quickLinks } from "./Header";

const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z" />
  </svg>
);
const InstagramIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
);

export function Footer() {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const nav = [
    { key: "about", href: "/nosotros", label: t<string>("nav.about") },
    { key: "landscapes", href: "/paisajes", label: t<string>("nav.landscapes") },
    { key: "programs", href: "/programas", label: es ? "Programas" : "Programs" },
    { key: "resources", href: "/recursos", label: es ? "Recursos" : "Resources" },
    { key: "news", href: "/noticias", label: t<string>("nav.news") },
    { key: "contact", href: "/contacto", label: t<string>("nav.contact") },
  ];
  const access = [
    ...quickLinks.map(q => ({ key: String(q.key), href: q.href, label: t<string>(`quick.${q.key}`) })),
    { key: "guide", href: "/contacto/guiadecampoaves", label: es ? "Guía de campo Aves de Bolivia" : "Birds of Bolivia field guide" },
  ];
  const contactLinks = [
    { href: "/contacto/prensa", label: es ? "Contacto prensa" : "Press contact" },
    { href: "/contacto/souvenirs", label: es ? "Souvenirs" : "Souvenirs" },
    { href: "/contacto/oficinas", label: es ? "Oficinas" : "Offices" },
    { href: "/contacto#consultas", label: es ? "Consultas" : "Enquiries" },
  ];
  const head = "text-xs font-bold uppercase tracking-[0.2em] text-brand-light";
  const link = "text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:underline";
  return (
    <footer className="bg-brand-deep text-primary-foreground">
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">{t("footer.text")}</p>
          <div className="mt-6 flex gap-2">
            {[{ Icon: FacebookIcon, name: "Facebook" }, { Icon: InstagramIcon, name: "Instagram" }, { Icon: YoutubeIcon, name: "YouTube" }].map(({ Icon, name }) => (
              <span key={name} title={`${name} — ${es ? "enlace pendiente" : "link pending"}`} className="grid size-10 place-items-center rounded-full bg-primary-foreground/10" aria-label={`${name} — ${es ? "enlace pendiente" : "link pending"}`}><Icon className="size-4" /></span>
            ))}
          </div>
        </div>
        <nav aria-label={t("footer.explore")}>
          <h3 className={head}>{t("footer.explore")}</h3>
          <ul className="mt-4 space-y-2.5">{nav.map(item => <li key={item.key}><Link to={item.href} className={link}>{item.label}</Link></li>)}</ul>
        </nav>
        <nav aria-label={t("footer.access")}>
          <h3 className={head}>{t("footer.access")}</h3>
          <ul className="mt-4 space-y-2.5">{access.map(item => <li key={item.key}><Link to={item.href} className={link}>{item.label}</Link></li>)}</ul>
        </nav>
        <div>
          <h3 className={head}>{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-2.5">{contactLinks.map(item => <li key={item.href}><Link to={item.href} className={link}>{item.label}</Link></li>)}</ul>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
            <li><Link to="/contacto/oficinas" className={`flex gap-2 ${link}`}><MapPin className="size-4 shrink-0" />{t("contact.officeText")}</Link></li>
            <li className="flex gap-2"><Mail className="size-4 shrink-0" />info@armonia-bo.org</li>
            <li className="flex gap-2"><Phone className="size-4 shrink-0" />+591 3 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <p className="container-site py-6 text-xs text-primary-foreground/60">© {new Date().getFullYear()} Asociación Armonía. {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
