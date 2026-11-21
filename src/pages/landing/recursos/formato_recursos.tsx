
import {
  FileText,
  Download,
  Map,
  BookOpen,
  Handshake,
  Scale,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  resourceTypes,
  type Resource,
} from "./recursos-mock";

const icons = {
  informes: FileText,
  publicaciones: BookOpen,
  sig: Map,
  colaboraciones: Handshake,
  legales: Scale,
};

export default function FormatoRecursos({
  resource,
}: {
  resource: Resource;
}) {
  const { lang } = useI18n();
  const es = lang === "es";

  const Icon = icons[resource.type];

  const category = resourceTypes.find(
    (item) => item.id === resource.type
  );

  return (
    <article className="group flex h-full w-full min-w-0 flex-col rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-card motion-safe:hover:-translate-y-1 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary sm:size-14">
          <Icon className="size-6 sm:size-7" />
        </span>

        <span className="max-w-full rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-brand-deep">
          {resource.format} · {resource.year}
        </span>
      </div>

      <p className="mt-5 text-xs font-semibold uppercase leading-relaxed tracking-wider text-primary">
        {es
          ? category?.es
          : category?.en}
      </p>

      <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-brand-deep sm:text-2xl">
        {es
          ? resource.title.es
          : resource.title.en}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {es
          ? resource.description.es
          : resource.description.en}
      </p>

      {resource.url ? (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 w-fit max-w-full items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Download className="size-4 shrink-0" />
          <span>
            {es
              ? "Abrir recurso"
              : "Open resource"}
          </span>
        </a>
      ) : (
        <span className="mt-6 inline-flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
          <FileText className="size-4 shrink-0" />
          {es
            ? "Demo · archivo aún no cargado"
            : "Demo · file not uploaded yet"}
        </span>
      )}
    </article>
  );
}
