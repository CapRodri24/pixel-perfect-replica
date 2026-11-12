import { Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Logo } from "./Logo";
import { quickLinks } from "./Header";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
);

export function Footer() {
  const { t } = useI18n();
  const nav = [["about", "#nosotros"], ["landscapes", "#paisajes"], ["resources", "#recursos"], ["news", "#noticias"], ["contact", "#contacto"]];
  const head = "text-xs font-bold uppercase tracking-[0.2em] text-brand-light";
  const link = "text-sm text-primary-foreground/75 hover:text-primary-foreground";
  return (
    <footer className="bg-brand-deep text-primary-foreground">
      <div className="container-site grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">{t("footer.text")}</p>
          <div className="mt-6 flex gap-2">
            {[FacebookIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
              <a key={i} href="#inicio" aria-label={t("footer.follow")} className="grid size-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary"><Icon className="size-4" /></a>
            ))}
          </div>
        </div>
        <nav aria-label={t("footer.explore")}>
          <h3 className={head}>{t("footer.explore")}</h3>
          <ul className="mt-4 space-y-2.5">{nav.map(([k, h]) => <li key={k}><a href={h} className={link}>{t(`nav.${k}`)}</a></li>)}</ul>
        </nav>
        <div>
          <h3 className={head}>{t("footer.access")}</h3>
          <ul className="mt-4 space-y-2.5">{quickLinks.map((q) => <li key={q.key}><a href={q.href} className={link}>{t(`quick.${q.key}`)}</a></li>)}</ul>
        </div>
        <div>
          <h3 className={head}>{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/75">
            <li className="flex gap-2"><MapPin className="size-4 shrink-0" />{t("contact.officeText")}</li>
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