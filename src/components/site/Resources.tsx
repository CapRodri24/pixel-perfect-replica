import { FileText, FlaskConical, Map, Handshake, Scale, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { pick, useContentOf } from "@/lib/cms";
import { Download } from "lucide-react";

export function Resources() {
  const { t, lang } = useI18n();
  const docs = useContentOf("library");
  const icons = [FileText, FlaskConical, Map, Handshake, Scale];
  return (
    <section id="recursos" className="section bg-brand-deep text-primary-foreground">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-light">{t("resources.eyebrow")}</p>
          <h2 className="mt-3 text-3xl leading-tight sm:text-4xl lg:text-5xl">{t("resources.title")}</h2>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-5">
          {t<{ title: string; text: string }[]>("resources.items").map((r, i) => {
            const Icon = icons[i % icons.length]!;
            return (
              <li key={r.title}>
                <a href="#recursos" className="group flex h-full flex-col bg-brand-deep p-6 transition-colors hover:bg-primary">
                  <Icon className="size-7 text-brand-light" />
                  <h3 className="mt-8 text-lg leading-snug">{r.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-primary-foreground/70">{r.text}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-light group-hover:text-primary-foreground">{t("resources.open")} <ArrowUpRight className="size-4" /></span>
                </a>
              </li>
            );
          })}
        </ul>
        {docs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl sm:text-3xl">{t("nav.library")}</h3>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((d) => (
                <li key={d.id} className="flex flex-col rounded-3xl bg-primary-foreground/10 p-6">
                  <FileText className="size-7 text-brand-light" />
                  <h4 className="mt-4 font-display text-lg">{pick(d, "title", lang)}</h4>
                  <p className="mt-2 flex-1 text-sm text-primary-foreground/70">{pick(d, "body", lang)}</p>
                  {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer" download={d.file_name ?? undefined} className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-brand-light"><Download className="size-4" /> {t("nav.download")}</a>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
