import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { news } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NoticiaDetalle() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  
  // Buscamos la noticia en el array usando el ID de la URL
  const item = news.find((n) => n.id === id);

  // Si la noticia no existe, redirigimos a la página principal de noticias
  useEffect(() => {
    if (!item) {
      navigate("/noticias", { replace: true });
    }
  }, [item, navigate]);

  // Mientras redirige, no mostramos nada
  if (!item) return null;

  return (
    <main className="pb-16">
      <div className="container-site py-6">
        <Button asChild variant="ghost">
          <Link to="/noticias">
            <ArrowLeft />
            {lang === "es" ? "Volver a noticias" : "Back to news"}
          </Link>
        </Button>
      </div>
      <article>
        <div className="container-site max-w-5xl">
          <p className="text-sm font-semibold uppercase text-primary">
            {lang === "es" ? "Noticias" : "News"}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-tight text-brand-deep sm:text-5xl">
            {t(`news.items.${item.id}.title`)}
          </h1>
          <time className="mt-4 block text-sm text-muted-foreground" dateTime={item.date}>
            {new Date(item.date + "T12:00:00").toLocaleDateString(lang === "es" ? "es-BO" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
          </time>
          <img src={item.image} alt={t(`news.items.${item.id}.title`)} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">
              {t(`news.items.${item.id}.text`)}
            </p>
            {item.landscape && (
              <Button asChild variant="outline" className="mt-8">
                <Link to="/paisajes" state={{ hash: "paisajes" }}>
                  {t(`landscapes.items.${item.landscape}.name`)}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}