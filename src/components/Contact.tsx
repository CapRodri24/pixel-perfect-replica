
import { useState, type FormEvent } from "react";
import {
  Heart,
  UserPlus,
  MapPin,
  Newspaper,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { DonationForm } from "./DonationForm";

const field =
  "mt-1.5 min-h-12 w-full min-w-0 rounded-2xl border border-input bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm";

export function Contact() {
  const { t } = useI18n();

  const [sent, setSent] = useState(false);

  const icons = [
    Heart,
    UserPlus,
    MapPin,
    Newspaper,
  ];

  const submit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <section
      id="contacto"
      className="section overflow-hidden"
    >
      <div className="container-site grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <SectionHeading
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
          />

          <ul className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
            {t<
              {
                title: string;
                text: string;
                cta: string;
              }[]
            >("contact.cards").map((c, i) => {
              const Icon =
                icons[i % icons.length] ?? Heart;

              const isDonate = i === 0;

              return (
                <li
                  key={c.title}
                  className={`flex min-w-0 flex-col rounded-3xl p-5 sm:p-6 ${
                    isDonate
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <span
                    className={`grid size-11 place-items-center rounded-2xl ${
                      isDonate
                        ? "bg-white/15"
                        : "bg-primary/10"
                    }`}
                  >
                    <Icon
                      className={`size-6 ${
                        isDonate
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                    />
                  </span>

                  <h3
                    className={`mt-4 text-lg font-semibold leading-snug ${
                      isDonate
                        ? "text-primary-foreground"
                        : "text-brand-deep"
                    }`}
                  >
                    {c.title}
                  </h3>

                  <p
                    className={`mt-2 flex-1 text-sm leading-relaxed ${
                      isDonate
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {c.text}
                  </p>

                  <Button
                    asChild
                    size="sm"
                    variant={
                      isDonate
                        ? "secondary"
                        : "default"
                    }
                    className="mt-5 min-h-10 w-fit rounded-full"
                  >
                    <a
                      href={
                        isDonate
                          ? "#givebutter-form"
                          : "#form"
                      }
                    >
                      {c.cta}
                    </a>
                  </Button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-start gap-3 rounded-3xl border border-border p-5 sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="size-6" />
            </span>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-brand-deep">
                {t("contact.office")}
              </h3>

              <p className="mt-2 break-words text-sm leading-relaxed text-muted-foreground">
                {t("contact.officeText")}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-8">
          <DonationForm />

          <form
            id="form"
            onSubmit={submit}
            className="h-fit min-w-0 rounded-3xl bg-muted p-5 sm:p-10"
          >
            <h3 className="text-2xl font-semibold leading-tight text-brand-deep">
              {t("contact.form.title")}
            </h3>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block min-w-0 text-sm font-semibold">
                {t("contact.form.name")}

                <input
                  required
                  name="name"
                  className={field}
                />
              </label>

              <label className="block min-w-0 text-sm font-semibold">
                {t("contact.form.email")}

                <input
                  required
                  type="email"
                  name="email"
                  className={field}
                />
              </label>

              <label className="block min-w-0 text-sm font-semibold sm:col-span-2">
                {t("contact.form.topic")}

                <select
                  name="topic"
                  className={field}
                >
                  {t<string[]>(
                    "contact.form.topics"
                  ).map((o) => (
                    <option key={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block min-w-0 text-sm font-semibold sm:col-span-2">
                {t("contact.form.message")}

                <textarea
                  required
                  name="message"
                  rows={5}
                  className={field}
                />
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="hero"
              className="mt-6 min-h-12 w-full rounded-full sm:w-auto"
            >
              {t("contact.form.send")}
            </Button>

            {sent && (
              <p
                role="status"
                className="mt-4 flex items-start gap-2 text-sm font-medium leading-relaxed text-primary"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                {t("contact.form.sent")}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
