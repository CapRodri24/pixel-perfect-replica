import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { SVGProps } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { REDES_SOCIALES, WHATSAPP_ARMONIA } from "@/config/redesSociales";

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

const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
  </svg>
);

export function Footer() {
  const { t, lang } = useI18n();
  const es = lang === "es";
  const link = "inline-flex items-center gap-2 text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:underline";
  const socials = [
    { Icon: InstagramIcon, name: REDES_SOCIALES.instagram.nombre, href: REDES_SOCIALES.instagram.url },
    { Icon: FacebookIcon, name: REDES_SOCIALES.facebook.nombre, href: REDES_SOCIALES.facebook.url },
    { Icon: XIcon, name: REDES_SOCIALES.x.nombre, href: REDES_SOCIALES.x.url },
    { Icon: YoutubeIcon, name: REDES_SOCIALES.youtube.nombre, href: REDES_SOCIALES.youtube.url },
  ];
  const nav = [
    {href:"/nosotros",label:t<string>("nav.about")},
    {href:"/paisajes",label:t<string>("nav.landscapes")},
    {href:"/recursos",label:es?"Recursos":"Resources"},
    {href:"/noticias",label:t<string>("nav.news")},
    {href:"/contacto",label:t<string>("nav.contact")},
  ];
  const access = [
    {href:"/donar",label:es?"Donar":"Donate"},
    {href:"/contacto/haztemiembro",label:es?"Hazte miembro":"Become a member"},
    {href:"/contacto/visitanuestrasreservas",label:es?"Visita nuestras reservas":"Visit our reserves"},
    {href:"/contacto/guiadecampoaves",label:es?"Guía de campo Aves de Bolivia":"Birds of Bolivia field guide"},
  ];
  const heading = "text-sm font-bold uppercase tracking-wider text-primary-foreground";
  return (
    <footer className="bg-brand-deep text-primary-foreground">
      <div className="container-site grid gap-7 py-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1.15fr_1.3fr] lg:gap-8 lg:py-10">
        <div className="min-w-0">
          <Logo light/>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/85">{t("footer.text")}</p>
          <div className="mt-4 flex gap-2">{socials.map(({Icon,name,href}) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="grid size-9 place-items-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"><Icon className="size-4"/></a>)}</div>
        </div>
        <nav aria-label={t("footer.explore")}><h3 className={heading}>{t("footer.explore")}</h3><ul className="mt-3 space-y-2">{nav.map(item=><li key={item.href}><Link to={item.href} className={link}>{item.label}</Link></li>)}</ul></nav>
        <nav aria-label={t("footer.access")}><h3 className={heading}>{t("footer.access")}</h3><ul className="mt-3 space-y-2">{access.map(item=><li key={item.href}><Link to={item.href} className={link}>{item.label}</Link></li>)}</ul></nav>
        <div className="min-w-0"><h3 className={heading}>{t("footer.contact")}</h3><div className="mt-3 flex flex-col items-start gap-2.5">
          <a href="mailto:armonia@armonia-bo.org" className={`${link} break-all`}><Mail className="size-4 shrink-0"/>armonia@armonia-bo.org</a>
          <a href="tel:+59172149863" className={link}><Phone className="size-4 shrink-0"/>+591 72149863</a>
          <a href={`https://wa.me/${WHATSAPP_ARMONIA}`} target="_blank" rel="noopener noreferrer" className={link}><MessageCircle className="size-4 shrink-0"/>WhatsApp</a>
          <Link to="/contacto/oficinas" className={link}><MapPin className="size-4 shrink-0"/>{es ? "Nuestras oficinas" : "Our offices"}</Link>
        </div></div>
      </div>
      <div className="border-t border-primary-foreground/10"><p className="container-site py-4 text-center text-xs text-primary-foreground/70">© {new Date().getFullYear()} Asociación Armonía. {t("footer.rights")}</p></div>
    </footer>
  );
}
