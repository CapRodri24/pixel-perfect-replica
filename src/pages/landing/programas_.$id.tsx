import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { programs } from "@/config/content";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ProgramaDetalle() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  
  // Buscamos el programa en el array usando el ID de la URL
  const item = programs.find((n) => n.id === id);

  // Si el programa no existe, redirigimos a la página principal de programas
  useEffect(() => {
    if (!item) {
      navigate("/programas", { replace: true });
    }
  }, [item, navigate]);

  // Mientras redirige, no mostramos nada
  if (!item) return null;

  return (
    <main className="pb-16">
      <div className="container-site py-6">
        <Button asChild variant="ghost">
          <Link to="/programas">
            <ArrowLeft />
            {lang === "es" ? "Volver a programas" : "Back to programs"}
          </Link>
        </Button>
      </div>
      <article>
        <div className="container-site max-w-5xl">
          <p className="text-sm font-semibold uppercase text-primary">
            {lang === "es" ? "Programas" : "Programs"}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl leading-tight text-brand-deep sm:text-5xl">
            {t(`programs.items.${item.id}.name`)}
          </h1>
          
          <img src={item.image} alt={t(`programs.items.${item.id}.name`)} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" />
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">
              {t(`programs.items.${item.id}.text`)}
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