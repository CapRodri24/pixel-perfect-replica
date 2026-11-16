import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { programs } from "@/config/content";
import es from "@/i18n/es.json";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/programas_/$id")({
  loader: ({ params }) => {
    const item = programs.find((n) => n.id === params.id);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => {
    const item = loaderData ? es.programs.items[loaderData.id as keyof typeof es.programs.items] : undefined;
    const title = item ? `${item.name} · Asociación Armonía` : "Contenido no disponible · Asociación Armonía";
    const description = item?.text ?? "Contenido de Asociación Armonía.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: DetailPage,
});
function DetailPage() {
  const item = Route.useLoaderData();
  const { t, lang } = useI18n();
  return <main className="pb-16">
    <div className="container-site py-6"><Button asChild variant="ghost"><Link to="/programas"><ArrowLeft />{lang === "es" ? "Volver a programas" : "Back to programs"}</Link></Button></div>
    <article>
      <div className="container-site max-w-5xl">
        <p className="text-sm font-semibold uppercase text-primary">{lang === "es" ? "Programas" : "Programs"}</p>
        <h1 className="mt-4 max-w-4xl text-3xl leading-tight text-brand-deep sm:text-5xl">{t(`programs.items.${item.id}.name`)}</h1>
        
        <img src={item.image} alt={t(`programs.items.${item.id}.name`)} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
        <div className="mx-auto mt-10 max-w-3xl">
          <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">{t(`programs.items.${item.id}.text`)}</p>
          {item.landscape && <Button asChild variant="outline" className="mt-8"><Link to="/paisajes" hash={"paisajes"}>{t(`landscapes.items.${item.landscape}.name`)}</Link></Button>}
        </div>
      </div>
    </article>
  </main>;
}
