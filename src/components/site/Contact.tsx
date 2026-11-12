import { useState, type FormEvent } from "react";
import { Heart, UserPlus, MapPin, Newspaper, Building2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";

const field = "mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const icons = [Heart, UserPlus, MapPin, Newspaper];
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); e.currentTarget.reset(); };
  return (
    <section id="contacto" className="section">
      <div className="container-site grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {t<{ title: string; text: string; cta: string }[]>("contact.cards").map((c, i) => {
              const Icon = icons[i];
              return (
                <li key={c.title} className={`flex flex-col rounded-3xl p-6 ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  <Icon className={`size-6 ${i === 0 ? "" : "text-primary"}`} />
                  <h3 className={`mt-4 text-lg ${i === 0 ? "" : "text-brand-deep"}`}>{c.title}</h3>
                  <p className={`mt-1 flex-1 text-sm ${i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.text}</p>
                  <Button asChild size="sm" variant={i === 0 ? "secondary" : "default"} className="mt-4 w-fit"><a href="#form">{c.cta}</a></Button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-start gap-3 rounded-3xl border border-border p-6">
            <Building2 className="size-6 shrink-0 text-primary" />
            <div><h3 className="text-lg text-brand-deep">{t("contact.office")}</h3><p className="text-sm text-muted-foreground">{t("contact.officeText")}</p></div>
          </div>
        </div>
        <form id="form" onSubmit={submit} className="h-fit rounded-3xl bg-muted p-6 sm:p-10">
          <h3 className="text-2xl text-brand-deep">{t("contact.form.title")}</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">{t("contact.form.name")}<input required name="name" className={field} /></label>
            <label className="text-sm font-semibold">{t("contact.form.email")}<input required type="email" name="email" className={field} /></label>
            <label className="text-sm font-semibold sm:col-span-2">{t("contact.form.topic")}
              <select name="topic" className={field}>{t<string[]>("contact.form.topics").map((o) => <option key={o}>{o}</option>)}</select>
            </label>
            <label className="text-sm font-semibold sm:col-span-2">{t("contact.form.message")}<textarea required name="message" rows={5} className={field} /></label>
          </div>
          <Button type="submit" size="lg" variant="hero" className="mt-6 w-full sm:w-auto">{t("contact.form.send")}</Button>
          {sent && <p role="status" className="mt-4 flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="size-4" />{t("contact.form.sent")}</p>}
        </form>
      </div>
    </section>
  );
}
